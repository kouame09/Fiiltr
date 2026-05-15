import { useState, useEffect } from 'react';
import { Monitor, X } from 'lucide-react';

export default function MobileBlocker() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (!isMobile) return null;

  return (
    <div className="fixed inset-0 bg-white z-[9999] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="bg-black p-6 rounded-3xl">
            <Monitor className="w-16 h-16 text-white" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            ChapChapCV
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Pour une expérience optimale, veuillez utiliser cet outil sur un ordinateur (PC ou laptop).
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-gray-50 rounded-2xl p-6 space-y-3">
          <p className="text-sm text-gray-700 font-medium">
            Pourquoi cette restriction ?
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            L'éditeur de CV nécessite un écran suffisamment grand pour vous permettre de travailler confortablement sur votre document et de voir le aperçu en temps réel.
          </p>
        </div>

        {/* CTA */}
        <div className="space-y-2">
          <p className="text-sm font-bold text-gray-900">
            Revenez sur un ordinateur pour accéder à l'outil !
          </p>
          <p className="text-xs text-gray-400">
            Merci de votre compréhension 🙏
          </p>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-gray-100">
          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">
            By Prince Kouamé
          </p>
        </div>
      </div>
    </div>
  );
}
