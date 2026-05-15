import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Globe, Coffee, ShieldCheck, CheckCircle2, Heart } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] cursor-pointer"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[85vh] overflow-y-auto bg-white rounded-3xl shadow-2xl z-[101] p-8 md:p-12 scrollbar-none"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>

            <div className="space-y-12">
              {/* Header Section */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-50 text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">
                  À propos l'outil
                </div>
                <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                  Pourquoi utiliser <span className="text-black">ChapChapCV</span> ?
                </h2>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                  L'outil conçu avec les critères ATS pour maximiser vos chances de décrocher un entretien en Côte d'Ivoire et partout ailleurs.
                </p>
              </div>

              {/* Grid Content */}
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="p-3 bg-black rounded-2xl shrink-0 h-fit">
                      <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-gray-900">C'est quoi un ATS ?</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        L'<strong>Applicant Tracking System</strong> est un robot utilisé par les recruteurs pour trier automatiquement les CV. 
                        90% des CV sont rejetés avant même d'être vus par un humain car ils sont illisibles par ces machines.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="p-3 bg-gray-50 rounded-2xl shrink-0 h-fit border border-gray-100">
                      <CheckCircle2 className="w-6 h-6 text-black" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-gray-900">Sobriété & Efficacité</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Contrairement aux CV avec beaucoup de graphismes, de couleurs et de colonnes complexes (Canva, etc.), 
                        ce format minimaliste garantit que les algorithmes extraient vos compétences sans erreur.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-3xl p-8 space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500 fill-red-500" /> Le Développeur
                  </h3>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Salut ! Je suis <strong>Prince Kouamé</strong>, Software developer passionné par la Tech for Good. 
                      J'ai créé cet outil pour aider les talents à decrocher facilement les entretiens d'embauche.
                    </p>
                    <a 
                      href="https://www.princekouame.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-bold text-black hover:underline"
                    >
                      <Globe className="w-4 h-4" /> www.princekouame.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Support Section */}
              <div className="border-t border-gray-100 pt-10">
                <div className="bg-black text-white p-8 md:p-10 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="space-y-2 text-center md:text-left">
                    <h3 className="text-2xl font-bold">Soutenir le projet</h3>
                    <p className="text-gray-400 text-sm max-w-sm">
                      Si vous trouvez cet outil utile et que vous souhaitez soutenir sa maintenance et son développement futur, n'hésitez pas à contribuer.
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <a 
                      href="https://pay.wave.com/m/M_ci_BzrF5N5Dmt4d/c/ci/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-4 bg-white text-black font-bold rounded-2xl flex items-center gap-3 shadow-xl transform transition hover:scale-105"
                    >
                      <Coffee className="w-5 h-5" /> Contribution libre via Wave
                    </a>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Merci pour votre soutien !</p>
                  </div>
                </div>
              </div>

              <div className="text-center text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">
                Fait avec passion pour vous!
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
