import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, BookOpen } from "lucide-react";

export const DemoModal = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden relative"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-orient-purple/5 to-orient-blue/5">
                <div className="flex items-center gap-3">
                  <div className="bg-orient-gold p-2 rounded-full text-white">
                    <BookOpen size={24} />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-orient-dark">
                    Découvrir Hakawa
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content - Video Player */}
              <div className="relative aspect-video bg-gray-900 flex items-center justify-center group overflow-hidden">
                {!isPlaying ? (
                  <div
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    onClick={() => setIsPlaying(true)}
                  >
                    {/* Abstract Background Animation */}
                    <div className="absolute inset-0 opacity-30">
                      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                    </div>

                    {/* Play Button */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="relative z-10 w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/50 shadow-2xl group-hover:bg-white/20 transition-all"
                    >
                      <Play size={32} className="text-white ml-1 fill-white" />
                    </motion.div>

                    <div className="absolute bottom-8 left-8 right-8 text-center">
                      <p className="text-white/80 text-lg font-medium">
                        Lancer la démonstration
                      </p>
                    </div>
                  </div>
                ) : (
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                    title="Hakawa Demo"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0"
                  ></iframe>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 bg-gray-50 flex justify-end gap-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2 text-gray-600 font-medium hover:text-gray-900 transition-colors"
                >
                  Fermer
                </button>
                <a
                  href="/register"
                  className="px-6 py-2 bg-orient-purple text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  Commencer l'aventure
                </a>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
