"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  const [videoElementReady, setVideoElementReady] = useState(false);
  const { remoteParticipants } = useLiveKit();

  // Track when video element is available
  const videoRefCallback = useCallback((element: HTMLVideoElement | null) => {
    videoRef.current = element;
    setVideoElementReady(!!element);
    console.log("📺 Video element ref updated, ready:", !!element);
  }, []);

  // Helper function to get avatar state class
  const getAvatarStateClass = () => {
    if (isSpeaking) return "avatar-speaking";
    if (isListening) return "avatar-listening";
    return "avatar-idle";
  };

  // This effect connects to the LiveKit room and attaches the avatar video stream
  useEffect(() => {
    if (!isVisible) return;

    const avatarIdentity = "Heallink Health Assistant";
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

    // Function to attach a video track
    const attachVideoTrack = (track: Track) => {
      console.log(
        "🔧 attachVideoTrack called - videoRef.current:",
        !!videoRef.current,
        "videoAttached:",
        videoAttached,
        "videoElementReady:",
        videoElementReady
      );
      if (!videoRef.current) {
        console.log("❌ No video ref available, will retry in 100ms");
        // Retry after a short delay
        setTimeout(() => {
          if (videoRef.current && !videoAttached) {
            console.log("🔄 Retrying video track attachment");
            attachVideoTrack(track);
          }
        }, 100);
        return false;
      }
      if (videoAttached) {
        console.log("❌ Video already attached");
        return false;
      }

      try {
        console.log("🎬 Attempting to attach video track");

        // First detach from any elements
        track.detach();

        // Then attach to our video element
        track.attach(videoRef.current);
        console.log("✅ Video track attached to video element");

        // Force video to be visible and play
        if (videoRef.current) {
          videoRef.current.style.display = "block";
          videoRef.current.style.visibility = "visible";

          // Add event listeners for debugging
          videoRef.current.onloadeddata = () =>
            console.log("🎬 Video data loaded");
          videoRef.current.oncanplay = () => console.log("🎬 Video can play");
          videoRef.current.onplaying = () => console.log("🎬 Video is playing");

          videoRef.current
            .play()
            .then(() => console.log("🎬 Video play() succeeded"))
            .catch((e) => console.error("❌ Error playing video:", e));
        }

        videoAttached = true;
        setHasVideoTrack(true);
        setIsLoaded(true);
        console.log("✅ Avatar video track setup complete");

        // Add cleanup for this track
        cleanupFunctions.push(() => {
          if (videoRef.current) {
            track.detach(videoRef.current);
          }
        });

        return true;
      } catch (error) {
        console.error("❌ Error attaching video track:", error);
        return false;
      }
    };

    // Reset video element at the start
    resetVideoElement();

    // Debug: Log all participants
    console.log(
      "All remote participants:",
      remoteParticipants.map((p) => ({
        identity: p.identity,
        videoTracks: p.videoTrackPublications.size,
        hasVideo: Array.from(p.videoTrackPublications.values()).some(
          (pub) => pub.track
        ),
      }))
    );

    // Find the avatar participant by identity
    const avatarParticipant = remoteParticipants.find(
      (p) => p.identity === avatarIdentity
    );

    console.log("Looking for avatar identity:", avatarIdentity);
    console.log("Avatar participant found:", !!avatarParticipant);

    if (avatarParticipant) {
      // Process all track publications, prioritizing video
      const videoPublications = Array.from(
        avatarParticipant.trackPublications.values()
      ).filter((pub) => pub.kind === Track.Kind.Video);

      console.log("🔍 Found video publications:", videoPublications.length);

      // Try to attach existing video tracks
      for (const videoPublication of videoPublications) {
        if (videoPublication.track) {
          console.log("📹 Found existing video track, attempting to attach");
          if (attachVideoTrack(videoPublication.track)) {
            break; // Successfully attached, stop looking
          }
        } else {
          console.log(
            "📹 Video publication found but no track yet (isSubscribed:",
            videoPublication.isSubscribed,
            ")"
          );
        }
      }

      // Set up event listener for new video tracks
      const handleTrackSubscribed = (track: Track) => {
        console.log(
          "🎵 Track subscribed event:",
          track.kind,
          "videoAttached:",
          videoAttached
        );
        if (track.kind === Track.Kind.Video && !videoAttached) {
          console.log("🎬 Processing new video track subscription");
          attachVideoTrack(track);
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
          trackSid: pub.trackSid,
        }));
      console.log("Available video tracks:", videoTracks);

      // Also log all track publications for debugging
      const allTracks = Array.from(
        avatarParticipant.trackPublications.values()
      ).map((pub) => ({
        kind: pub.kind,
        trackName: pub.trackName,
        isSubscribed: pub.isSubscribed,
        hasTrack: !!pub.track,
      }));
      console.log("All tracks from avatar participant:", allTracks);
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
  }, [isVisible, remoteParticipants, videoElementReady]);

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
                    ref={videoRefCallback}
                    autoPlay
                    playsInline
                    muted={true}
                    className="avatar-video"
                    style={{
                      display: hasVideoTrack ? 'block' : 'none',
                      backgroundColor: 'transparent'
                    }}
                  />
                  
                  {/* Debug info - remove in production */}
                  {process.env.NODE_ENV === 'development' && (
                    <div style={{
                      position: 'absolute',
                      bottom: '5px',
                      left: '5px',
                      background: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      fontSize: '10px',
                      padding: '2px 4px',
                      borderRadius: '3px',
                      zIndex: 10
                    }}>
                      Video: {hasVideoTrack ? 'ON' : 'OFF'}
                    </div>
                  )}
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
