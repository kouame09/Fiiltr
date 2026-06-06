import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Clipboard, FileText, AlertCircle, Loader2, Check, Eye, Pencil, Trash2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { CVData } from '../types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const API_KEY_STORAGE = 'gemini_api_key';
const LETTER_STORAGE = 'cover_letter_text';

interface CoverLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CVData;
  onOpenAPISettings?: () => void;
}

export default function CoverLetterModal({ isOpen, onClose, data, onOpenAPISettings }: CoverLetterModalProps) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isApiKeyError, setIsApiKeyError] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem(LETTER_STORAGE);
      if (saved) {
        setText(saved);
      }
      setError(null);
      setIsApiKeyError(false);
      setCopied(false);
    }
  }, [isOpen]);

  useEffect(() => {
    localStorage.setItem(LETTER_STORAGE, text);
  }, [text]);

  const handleReset = () => {
    setText('');
    setPreviewMode(false);
    setCopied(false);
    setError(null);
    setIsApiKeyError(false);
    localStorage.removeItem(LETTER_STORAGE);
  };

  const getApiKey = () => {
    const saved = localStorage.getItem(API_KEY_STORAGE);
    return saved || process.env.GEMINI_API_KEY || '';
  };

  const handleAIGenerate = async () => {
    const key = getApiKey();
    if (!key) {
      setError("Aucune clé API Gemini configurée.");
      setIsApiKeyError(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: key });
      const expText = data.experiences.map(e =>
        `- ${e.role} chez ${e.company} (${e.startDate} - ${e.endDate}):\n${(e.description || []).filter(Boolean).map(d => `  • ${d}`).join('\n')}`
      ).join('\n');
      const skillsText = data.skills.map(s => `${s.category}: ${s.items}`).join('\n');
      const eduText = data.education.map(e => `- ${e.degree}, ${e.school} (${e.year})`).join('\n');

      const prompt = `Génère une lettre de motivation professionnelle et personnalisée en français à partir de ces données CV. La lettre doit tenir sur une seule page A4 (environ 2500 caractères max).

Structure à respecter impérativement :
- Ne mets PAS de coordonnées en haut (le nom, email et téléphone seront ajoutés automatiquement après)
- Ne mets PAS d'en-tête "À l'attention de" ni d'"Objet" (ils seront ajoutés automatiquement)
- Ne termine PAS par le nom du candidat (il sera ajouté automatiquement en bas)
- Corps : présente le parcours, les compétences clés et les réalisations. Ne pas inventer d'expériences. Sois naturel et fluide.
- Formule de politesse classique

Ne mets pas de titre "Lettre de motivation" ni de note éditoriale. Rédige directement la lettre sans les coordonnées d'en-tête.

Données CV :
- Nom : ${data.personalInfo.fullName}
- Poste : ${data.personalInfo.jobTitle}
- Résumé : ${data.profileSummary}
- Expériences :\n${expText || 'Aucune'}
- Compétences :\n${skillsText || 'Aucune'}
- Formation :\n${eduText || 'Aucune'}`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ text: prompt }],
      });

      const letter = response.text || '';
      const formatted = `${data.personalInfo.fullName}\n${data.personalInfo.email}\n${data.personalInfo.phone || ''}\n${data.personalInfo.location || ''}\n\nÀ l'attention de [Nom de l'entreprise]\n\nObjet : Candidature pour le poste de ${data.personalInfo.jobTitle || '[Poste]'}\n\n${letter.replace(/^[\s\n]+/, '')}\n\n${data.personalInfo.fullName}`;

      setText(formatted);
    } catch (err: any) {
      console.error('AI Generation Error:', err);
      const msg = err?.message || '';
      if (msg.includes('API_KEY') || msg.includes('API key') || msg.includes('403') || msg.includes('401')) {
        setError("Votre clé API Gemini est invalide ou expirée.");
        setIsApiKeyError(true);
      } else {
        setError("Erreur lors de la génération. Vérifiez votre connexion et réessayez.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Impossible de copier le texte.");
    }
  };

  const handleDownloadPDF = async () => {
    if (!text.trim()) return;

    const previewDiv = document.createElement('div');
    previewDiv.style.width = '210mm';
    previewDiv.style.padding = '15mm 15mm 0 15mm';
    previewDiv.style.backgroundColor = '#ffffff';
    previewDiv.style.boxSizing = 'border-box';
    previewDiv.style.fontFamily = '"Times New Roman", Times, serif';
    previewDiv.style.fontSize = '12pt';
    previewDiv.style.lineHeight = '1.6';
    previewDiv.style.wordBreak = 'break-word';
    previewDiv.style.textAlign = 'justify';
    previewDiv.style.position = 'fixed';
    previewDiv.style.left = '-9999px';
    previewDiv.style.top = '0';
    previewDiv.style.zIndex = '-1';
    previewDiv.innerHTML = text.split('\n').map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '<div style="height:1em"></div>';
      return `<div>${trimmed}</div>`;
    }).join('');
    document.body.appendChild(previewDiv);

    try {
      const canvas = await html2canvas(previewDiv, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const elementWidth = previewDiv.offsetWidth;
      const elementHeight = previewDiv.offsetHeight;
      const canvasScaleY = canvas.height / elementHeight;

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      const pxToMM = pdfW / elementWidth;

      const MARGIN_MM = 15;
      const firstPageMaxPx = (pdfH - MARGIN_MM) / pxToMM;
      const laterPageMaxPx = (pdfH - MARGIN_MM * 2) / pxToMM;

      const pageCuts = [0];
      let cursor = 0;
      let isFirst = true;

      while (cursor < elementHeight) {
        const maxPx = isFirst ? firstPageMaxPx : laterPageMaxPx;
        const pageBottom = cursor + maxPx;
        if (pageBottom >= elementHeight) break;
        pageCuts.push(pageBottom);
        cursor = pageBottom;
        isFirst = false;
      }

      for (let i = 0; i < pageCuts.length; i++) {
        const startPx = pageCuts[i];
        const endPx = i + 1 < pageCuts.length ? pageCuts[i + 1] : elementHeight;

        const cropY = Math.round(startPx * canvasScaleY);
        const cropH = Math.round((endPx - startPx) * canvasScaleY);
        if (cropH <= 0) continue;

        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = cropH;
        const ctx = pageCanvas.getContext('2d')!;
        ctx.drawImage(canvas, 0, cropY, canvas.width, cropH, 0, 0, canvas.width, cropH);

        const imgData = pageCanvas.toDataURL('image/png');
        const contentHeightMM = (endPx - startPx) * pxToMM;
        const topMM = i === 0 ? 0 : MARGIN_MM;

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, topMM, pdfW, contentHeightMM);
      }

      pdf.save('Lettre de motivation.pdf');
    } catch {
      setError("Erreur lors de la génération du PDF.");
    } finally {
      document.body.removeChild(previewDiv);
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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] bg-white rounded-[2rem] shadow-2xl z-[151] overflow-hidden flex flex-col"
          >
            <div className="p-6 md:p-8 space-y-5 overflow-y-auto">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-black font-bold text-xl">
                    <FileText className="w-5 h-5" />
                    Lettre de Motivation
                  </div>
                  <p className="text-gray-500 text-sm">
                    Personnalisez et générez votre lettre à partir de votre CV.
                  </p>
                </div>
                <button onClick={onClose} className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleAIGenerate}
                  disabled={loading}
                  className="cursor-pointer px-4 py-2 bg-black text-white rounded-xl text-[10px] font-bold flex items-center gap-2 uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                  Générer avec IA
                </button>
                <button
                  onClick={handleCopy}
                  disabled={!text.trim()}
                  className="cursor-pointer px-4 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-bold text-gray-400 hover:text-black hover:border-black transition-all flex items-center gap-2 uppercase tracking-widest disabled:opacity-30"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Clipboard className="w-3 h-3" />}
                  {copied ? 'Copié' : 'Copier'}
                </button>
                <button
                  onClick={handleDownloadPDF}
                  disabled={!text.trim()}
                  className="cursor-pointer px-4 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-bold text-gray-400 hover:text-black hover:border-black transition-all flex items-center gap-2 uppercase tracking-widest disabled:opacity-30"
                >
                  <FileText className="w-3 h-3" />
                  Télécharger PDF
                </button>
                <button
                  onClick={handleReset}
                  disabled={!text.trim()}
                  className="cursor-pointer px-4 py-2 bg-white border border-red-100 rounded-xl text-[10px] font-bold text-red-300 hover:text-red-500 hover:border-red-200 transition-all flex items-center gap-2 uppercase tracking-widest disabled:opacity-30"
                >
                  <Trash2 className="w-3 h-3" />
                  Réinitialiser
                </button>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <p>{error}</p>
                    {isApiKeyError && onOpenAPISettings && (
                      <button
                        onClick={onOpenAPISettings}
                        className="text-xs font-bold text-red-600 underline hover:text-red-800 transition-colors cursor-pointer"
                      >
                        Configurer la clé API →
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="relative">
                {previewMode ? (
                  <div className="w-full min-h-[500px] p-8 bg-white border border-gray-100 rounded-2xl text-sm font-[Times_New_Roman,Times,serif] whitespace-pre-wrap leading-relaxed text-justify">
                    {text || (
                      <span className="text-gray-300 italic">
                        Aucun contenu à afficher. Générez ou rédigez votre lettre.
                      </span>
                    )}
                  </div>
                ) : (
                  <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full min-h-[500px] p-8 bg-white border border-gray-100 rounded-2xl text-sm leading-relaxed resize-y focus:border-black outline-none transition-all font-[Times_New_Roman,Times,serif]"
                    placeholder="Cliquez sur « Générer avec IA » pour créer votre lettre, ou rédigez-la directement ici."
                    style={{ lineHeight: '1.6' }}
                  />
                )}
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className="cursor-pointer absolute top-3 right-3 p-2 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-black hover:border-gray-200 transition-all shadow-sm"
                  title={previewMode ? 'Modifier' : 'Aperçu'}
                >
                  {previewMode ? <Pencil className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center justify-center pt-2 border-t border-gray-50">
                <FileText className="w-3 h-3" /> Générée à partir de votre CV
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
