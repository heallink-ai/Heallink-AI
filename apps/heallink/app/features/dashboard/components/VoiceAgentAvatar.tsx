"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLiveKit } from "@/app/providers/LiveKitProvider";
import { Track } from "livekit-client";

interface VoiceAgentAvatarProps {
  isVisible: boolean;
  isSpeaking: boolean;
  isListening?: boolean;
}

const VoiceAgentAvatar = ({
  isVisible,
  isSpeaking,
  isListening = false,
}: VoiceAgentAvatarProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasVideoTrack, setHasVideoTrack] = useState(false);
  const { remoteParticipants } = useLiveKit();

  // Helper function to get avatar state class
  const getAvatarStateClass = () => {
    if (isSpeaking) return "avatar-speaking";
    if (isListening) return "avatar-listening";
    return "avatar-idle";
  };

  // This effect connects to the LiveKit room and attaches the avatar video stream
  useEffect(() => {
    if (!isVisible) return;

    const avatarIdentity = "heallink-avatar";
    let videoAttached = false;
    const cleanupFunctions: Array<() => void> = [];

    // Create a function to reset and prepare the video element
    const resetVideoElement = () => {
      if (videoRef.current) {
        // Reset the video element first
        if (videoRef.current.srcObject) {
          const tracks = (
            videoRef.current.srcObject as MediaStream
          ).getTracks();
          tracks.forEach((track) => track.stop());
          videoRef.current.srcObject = null;
        }

        // Force a reload of the video element
        videoRef.current.load();
      }
    };

    // Reset video element at the start
    resetVideoElement();

    // Find the avatar participant by identity
    const avatarParticipant = remoteParticipants.find(
      (p) => p.identity === avatarIdentity
    );

    if (avatarParticipant) {
      // Process all track publications, prioritizing video
      const videoPublications = Array.from(
        avatarParticipant.trackPublications.values()
      ).filter((pub) => pub.kind === Track.Kind.Video);

      if (videoPublications.length > 0) {
        const videoPublication = videoPublications[0];

        if (videoPublication.track && videoRef.current) {
          try {
            // Detach from any existing elements first
            videoPublication.track.detach();

            // Then attach to our video element
            videoPublication.track.attach(videoRef.current);

            // Force video to be visible and play
            if (videoRef.current) {
              videoRef.current.style.display = "block";
              videoRef.current.style.visibility = "visible";
              videoRef.current
                .play()
                .catch((e) => console.error("Error playing video:", e));
            }

            videoAttached = true;
            setHasVideoTrack(true);
            setIsLoaded(true);

            // Add cleanup for this track
            cleanupFunctions.push(() => {
              if (videoRef.current) {
                videoPublication.track?.detach(videoRef.current);
              }
            });
          } catch (error) {
            console.error("Error attaching video track:", error);
          }
        }
      }

      // Set up event listener for new video tracks
      const handleTrackSubscribed = (track: Track) => {
        if (
          track.kind === Track.Kind.Video &&
          !videoAttached &&
          videoRef.current
        ) {
          try {
            // First detach from any elements
            track.detach();

            // Then attach to our video element
            track.attach(videoRef.current);

            // Force video to be visible and play
            if (videoRef.current) {
              videoRef.current.style.display = "block";
              videoRef.current.style.visibility = "visible";
              videoRef.current
                .play()
                .catch((e) => console.error("Error playing video:", e));
            }

            videoAttached = true;
            setHasVideoTrack(true);
            setIsLoaded(true);

            // Add cleanup for this track
            cleanupFunctions.push(() => {
              if (videoRef.current) {
                track.detach(videoRef.current);
              }
            });
          } catch (error) {
            console.error("Error attaching new video track:", error);
          }
        }
      };

      // Subscribe to new tracks
      avatarParticipant.on("trackSubscribed", handleTrackSubscribed);

      // Add cleanup for event listener
      cleanupFunctions.push(() => {
        avatarParticipant.off("trackSubscribed", handleTrackSubscribed);
      });

      // Log the video track info for debugging
      console.log("Avatar participant found:", avatarParticipant.identity);
      const videoTracks = Array.from(
        avatarParticipant.trackPublications.values()
      )
        .filter((pub) => pub.kind === Track.Kind.Video)
        .map((pub) => ({
          trackName: pub.trackName,
          isSubscribed: pub.isSubscribed,
          hasTrack: !!pub.track,
        }));
      console.log("Available video tracks:", videoTracks);
    }

    // Force isLoaded to true after 1.5 seconds, even if no video track is found
    const forceLoadTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 1500);

    return () => {
      clearTimeout(forceLoadTimer);

      // Execute all cleanup functions
      cleanupFunctions.forEach((cleanup) => cleanup());

      // Ensure video is properly cleaned up
      resetVideoElement();
    };
  }, [isVisible, remoteParticipants]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="voice-agent-avatar-container"
        >
          <div className={`voice-agent-avatar-card ${getAvatarStateClass()}`}>
            {!isLoaded ? (
              <div className="avatar-loading">
                <div className="avatar-loading-spinner">
                  <div className="spinner-segment"></div>
                  <div className="spinner-segment"></div>
                  <div className="spinner-segment"></div>
                </div>
                <div className="avatar-loading-text">
                  Loading Heallink Assistant...
                </div>
              </div>
            ) : (
              <>
                <div className="avatar-video-container">
                  {/* Fallback image when no video is available */}
                  {!hasVideoTrack && (
                    <div className="avatar-fallback">
                      <div className="avatar-fallback-image">
                        <div className="avatar-pulse"></div>
                      </div>
                    </div>
                  )}

                  {/* Video element for the avatar */}
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted={true}
                    className="avatar-video"
                  />
                </div>

                <div className="avatar-name">Heallink Health Assistant</div>

                <div className="avatar-status">
                  {isSpeaking ? (
                    <div className="speaking-indicator">
                      <span className="speaking-dot"></span>
                      <span className="speaking-text">Speaking</span>
                    </div>
                  ) : isListening ? (
                    <div className="listening-indicator">
                      <span className="listening-dot"></span>
                      <span className="listening-text">Listening</span>
                    </div>
                  ) : (
                    <div className="idle-indicator">
                      <span className="idle-dot"></span>
                      <span className="idle-text">Ready</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VoiceAgentAvatar;
