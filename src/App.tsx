import { useState, useEffect } from 'react';
import { CVData } from './types';
import { initialData } from './initialData';
import CVEditor from './components/CVEditor';
import CVPreview from './components/CVPreview';
import AboutModal from './components/AboutModal';
import AIImportModal from './components/AIImportModal';
import MobileBlocker from './components/MobileBlocker';
import { Download, FileText, User, RefreshCw, Info, Sparkles } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const CV_STORAGE_KEY = 'ats_cv_data';

export default function App() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [data, setData] = useState<CVData>(() => {
    const saved = localStorage.getItem(CV_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migration: If the saved data is the old English example, update to the new Ivorian one
        if (parsed.personalInfo?.fullName === "ROHIT RAMESH SHARNA") {
          return initialData;
        }
        // Ensure settings exist (schema migration)
        return {
          ...initialData,
          ...parsed,
          personalInfo: { ...initialData.personalInfo, ...parsed.personalInfo },
          settings: { ...initialData.settings, ...(parsed.settings || {}) }
        };
      } catch (e) {
        console.error("Failed to parse saved CV data", e);
        return initialData;
      }
    }
    return initialData;
  });

  useEffect(() => {
    localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const handleReset = () => {
    if (window.confirm('Voulez-vous vraiment réinitialiser le CV avec les données d\'exemple ?')) {
      setData(initialData);
    }
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('cv-preview');
    if (!element) return;

    const btn = document.activeElement as HTMLButtonElement;
    if (btn) btn.disabled = true;

    try {
      // Temporarily remove transform for clean capture
      const originalTransform = element.style.transform;
      element.style.transform = 'none';

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 794
      });

      // Restore transform
      element.style.transform = originalTransform;

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = pdfWidth / imgWidth;
      const finalHeight = imgHeight * ratio;

      let heightLeft = finalHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, finalHeight);
      heightLeft -= pdfHeight;

      // Additional pages
      while (heightLeft > 0) {
        position = heightLeft - finalHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, finalHeight);
        heightLeft -= pdfHeight;
      }
      
      const fileName = data.personalInfo.fullName ? `CV - ${data.personalInfo.fullName}` : 'CV';
      pdf.save(`${fileName}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Une erreur est survenue lors de la génération du PDF. Essayez d\'utiliser Ctrl+P pour imprimer en PDF.');
    } finally {
      if (btn) btn.disabled = false;
    }
  };

  const handleAIImport = (importedData: Partial<CVData>) => {
    setData(prev => ({
      ...prev,
      ...importedData,
      personalInfo: { ...prev.personalInfo, ...(importedData.personalInfo || {}) },
      settings: { ...prev.settings, ...(importedData.settings || {}) }
    }));
  };

  return (
    <>
      <MobileBlocker />
      <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between z-50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-black p-2 rounded-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 tracking-tight uppercase leading-none">ChapChapCV</h1>
            <p className="text-[10px] font-medium text-gray-400 mt-1 italic">By Prince Kouamé</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsAIOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-black/10"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            Import IA
          </button>
          <button
            onClick={() => setIsAboutOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-500 hover:text-black uppercase tracking-widest transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
            À propos
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-500 hover:text-black uppercase tracking-widest transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Réinitialiser
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-8 py-2.5 text-xs font-bold text-white bg-black hover:bg-gray-800 rounded-full transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm tracking-widest uppercase"
          >
            <Download className="w-4 h-4" />
            Exporter PDF
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left: Editor (Scrolkable) */}
        <div className="w-full md:w-1/2 lg:w-[45%] h-full overflow-y-auto border-r border-gray-200 bg-white">
          <CVEditor data={data} onChange={setData} />
        </div>

        {/* Right: Preview (Sticky/Fixed Viewport) */}
        <div className="w-full md:w-1/2 lg:w-[55%] h-full overflow-y-auto bg-gray-100 p-8 flex justify-center">
          <div className="cv-preview-container h-fit sticky top-0">
             <CVPreview data={data} id="cv-preview" />
          </div>
        </div>
      </main>

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      <AIImportModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        onImport={handleAIImport}
      />
      </div>
    </>
  );
}
