import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, FileText, Upload, AlertCircle, Loader2, Key, ChevronDown, ChevronUp, ExternalLink, Check } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { CVData } from '../types';

const API_KEY_STORAGE = 'gemini_api_key';

interface AIImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: Partial<CVData>) => void;
}

export default function AIImportModal({ isOpen, onClose, onImport }: AIImportModalProps) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [keySaved, setKeySaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(API_KEY_STORAGE);
    if (saved) setApiKey(saved);
  }, []);

  const getApiKey = () => apiKey || process.env.GEMINI_API_KEY || '';

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem(API_KEY_STORAGE, apiKey.trim());
      setKeySaved(true);
      setTimeout(() => setKeySaved(false), 2000);
    }
  };

  const handleClearKey = () => {
    localStorage.removeItem(API_KEY_STORAGE);
    setApiKey('');
  };

  const handleImport = async (inputContent: string | { data: string, mimeType: string }) => {
    const key = getApiKey();
    if (!key) {
      setError("Aucune clé API Gemini configurée. Ajoutez votre clé ci-dessous option \"Clé API GEMINI\".");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: key });
      
      const contents = typeof inputContent === 'string' 
        ? [{ text: `Extract structured CV data from the following text. 
            Translate everything to French if it's in another language.
            Return a JSON object that matches the CVData interface.
            
            Text to analyze:
            ${inputContent}` }]
        : [
          {
            text: "Extract structured CV data from this document. Translate everything to French if it's in another language. Return a JSON object that matches the CVData interface."
          },
          {
            inlineData: {
              data: inputContent.data,
              mimeType: inputContent.mimeType
            }
          }
        ];

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              personalInfo: {
                type: Type.OBJECT,
                properties: {
                  fullName: { type: Type.STRING },
                  jobTitle: { type: Type.STRING },
                  email: { type: Type.STRING },
                  phone: { type: Type.STRING },
                  linkedin: { type: Type.STRING },
                  location: { type: Type.STRING },
                  github: { type: Type.STRING },
                  website: { type: Type.STRING },
                }
              },
              profileSummary: { type: Type.STRING },
              experiences: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    role: { type: Type.STRING },
                    company: { type: Type.STRING },
                    location: { type: Type.STRING },
                    startDate: { type: Type.STRING },
                    endDate: { type: Type.STRING },
                    description: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    }
                  }
                }
              },
              skills: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    items: { type: Type.STRING }
                  }
                }
              },
              education: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    degree: { type: Type.STRING },
                    school: { type: Type.STRING },
                    location: { type: Type.STRING },
                    year: { type: Type.STRING }
                  }
                }
              },
              languages: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    level: { type: Type.STRING }
                  }
                }
              },
              interests: { type: Type.STRING },
              awards: { type: Type.STRING }
            }
          }
        }
      });

      const extractedData = JSON.parse(response.text);
      
      // Add IDs to extracted items
      const processedData = {
        ...extractedData,
        experiences: extractedData.experiences?.map((e: any) => ({ ...e, id: Math.random().toString() })) || [],
        skills: extractedData.skills?.map((s: any) => ({ ...s, id: Math.random().toString() })) || [],
        education: extractedData.education?.map((ed: any) => ({ ...ed, id: Math.random().toString() })) || [],
        languages: extractedData.languages?.map((l: any) => ({ ...l, id: Math.random().toString() })) || [],
        recommendations: extractedData.recommendations?.map((r: any) => ({ ...r, id: Math.random().toString() })) || []
      };

      onImport(processedData);
      onClose();
    } catch (err: any) {
      console.error('AI Extraction Error:', err);
      const msg = err?.message || '';
      if (msg.includes('API_KEY') || msg.includes('API key') || msg.includes('403') || msg.includes('401') || msg.includes('not valid') || msg.includes('quota') || msg.includes('billing')) {
        setShowApiKeyInput(true);
        setError("Votre clé API Gemini est invalide, expirée ou a atteint son quota. Ajoutez une nouvelle clé ci-dessous ou obtenez-en une depuis Google AI Studio.");
      } else {
        setError("Une erreur est survenue lors de l'analyse du CV. Vérifiez votre clé API ou réessayez.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === 'text/plain' || file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const textContent = event.target?.result as string;
        setText(textContent);
        handleImport(textContent);
      };
      reader.readAsText(file);
    } else if (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = (event.target?.result as string).split(',')[1];
        handleImport({ data: base64Data, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    } else {
      setError("Format de fichier non supporté. Veuillez utiliser .txt, .md, .pdf ou .docx.");
    }
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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl z-[151] overflow-hidden"
          >
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-black font-bold text-xl">
                    <Sparkles className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    Importation Magique par IA
                  </div>
                  <p className="text-gray-500 text-sm">
                    Collez votre ancien CV ou importez un texte pour le transformer instantanément.
                  </p>
                </div>
                <button onClick={onClose} className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="relative group">
                  <textarea
                    className="w-full h-64 p-6 bg-gray-50/50 border border-gray-100 rounded-[1.5rem] text-sm focus:border-black outline-none transition-all resize-none placeholder:text-gray-300"
                    placeholder="Collez ici le texte de votre ancien CV (Expériences, Diplômes, Compétences...)"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer px-4 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-bold text-gray-400 hover:text-black hover:border-black transition-all flex items-center gap-2 uppercase tracking-widest"
                    >
                      <Upload className="w-3 h-3" /> Fichier
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" accept=".txt,.md,.pdf,.docx" onChange={handleFileUpload} />
                  </div>
                </div>

                <button
                  onClick={() => handleImport(text)}
                  disabled={loading || !text.trim()}
                  className="cursor-pointer w-full py-4 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Générer mon CV
                    </>
                  )}
                </button>
              </div>

              <div className="border-t border-gray-50 pt-4 space-y-3">
                <button
                  onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                  className="flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-black uppercase tracking-widest transition-colors"
                >
                  <Key className="w-3 h-3" />
                  Clé API Gemini
                  {showApiKeyInput ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>

                {showApiKeyInput && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-3 overflow-hidden"
                  >
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                      Entrez votre propre clé API Gemini pour utiliser l'importation IA. 
                      <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-black font-bold hover:underline ml-1"
                      >
                        Obtenir une clé <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 px-4 py-2.5 border border-gray-100 bg-gray-50/30 rounded-xl text-xs focus:border-black outline-none transition-all placeholder:text-gray-300"
                        placeholder="AIzaSy..."
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                      />
                      <button
                        onClick={handleSaveKey}
                        className="px-4 py-2.5 bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shrink-0"
                      >
                        {keySaved ? <Check className="w-3 h-3" /> : 'Sauvegarder'}
                      </button>
                    </div>
                    {apiKey && (
                      <button
                        onClick={handleClearKey}
                        className="text-[10px] text-red-400 hover:text-red-600 font-bold uppercase tracking-widest transition-colors"
                      >
                        Supprimer la clé
                      </button>
                    )}
                  </motion.div>
                )}
              </div>

              <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center justify-center">
                <FileText className="w-3 h-3" /> Supporte .txt, .md, .pdf, .docx
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
