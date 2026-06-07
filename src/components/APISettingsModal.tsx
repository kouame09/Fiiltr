import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Key, Check, ExternalLink, Trash2, AlertCircle, Eye, EyeOff } from 'lucide-react';

const API_KEY_STORAGE = 'gemini_api_key';

interface APISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function APISettingsModal({ isOpen, onClose }: APISettingsModalProps) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(API_KEY_STORAGE) || '');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);

  const handleSave = () => {
    const trimmed = apiKey.trim();
    if (!trimmed) {
      setError('Veuillez entrer une clé API valide.');
      return;
    }
    localStorage.setItem(API_KEY_STORAGE, trimmed);
    setSaved(true);
    setError(null);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClear = () => {
    localStorage.removeItem(API_KEY_STORAGE);
    setApiKey('');
    setError(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] cursor-pointer"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-[2rem] shadow-2xl z-[151] overflow-hidden"
          >
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-black font-bold text-xl">
                    <Key className="w-5 h-5" />
                    Clé API Gemini
                  </div>
                  <p className="text-gray-500 text-sm">
                    Configurez votre clé pour utiliser l'IA dans l'application.
                  </p>
                </div>
                <button onClick={onClose} className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4 bg-gray-50/50 rounded-2xl p-5 text-sm text-gray-600 leading-relaxed">
                <p>
                  Une clé API Gemini est requise pour les fonctionnalités <strong>d'importation IA</strong> et de <strong>génération de lettres de motivation</strong>.
                </p>
                <p>
                  Cette clé est personnelle et reste stockée uniquement dans votre navigateur. Elle n'est jamais envoyée ailleurs que vers l'API Google Gemini.
                </p>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-black hover:underline"
                >
                  Obtenir une clé API gratuite <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Votre clé API
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showKey ? "text" : "password"}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="AIzaSy..."
                      className="w-full px-4 py-3 pr-12 border border-gray-100 bg-gray-50/30 rounded-xl text-sm focus:border-black outline-none transition-all font-mono placeholder:text-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                    >
                      {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <button
                    onClick={handleSave}
                    className="cursor-pointer px-5 py-3 bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shrink-0"
                  >
                    {saved ? <Check className="w-3.5 h-3.5" /> : 'Sauvegarder'}
                  </button>
                </div>

                {apiKey && (
                  <div className="flex justify-end">
                    <button
                      onClick={handleClear}
                      className="cursor-pointer flex items-center gap-1.5 text-[10px] text-red-400 hover:text-red-600 font-bold uppercase tracking-widest transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      Supprimer la clé
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center justify-center pt-2 border-t border-gray-50">
                <Key className="w-3 h-3" /> Stockée localement dans votre navigateur
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
