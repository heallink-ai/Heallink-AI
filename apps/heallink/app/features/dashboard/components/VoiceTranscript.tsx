"use client";

import { motion, AnimatePresence } from "framer-motion";

interface VoiceTranscriptProps {
  showTranscript: boolean;
  transcript: string;
}

const VoiceTranscript = ({ showTranscript, transcript }: VoiceTranscriptProps) => {
  return (
    <AnimatePresence>
      {showTranscript && transcript && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-28 md:bottom-20 left-4 right-4 md:left-auto md:right-24 md:w-96 z-30 voice-transcript-bubble"
        >
          <div className="flex items-start gap-3 p-4 bg-card rounded-lg shadow-lg">
            <div className="bg-gradient-to-tr from-purple-heart to-royal-blue rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2c1.7 0 3 1.3 3 3v9c0 1.7-1.3 3-3 3s-3-1.3-3-3V5c0-1.7 1.3-3 3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium mb-1">
                HealLink AI Assistant
              </h3>
              <p className="text-sm text-foreground/80">{transcript}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VoiceTranscript;