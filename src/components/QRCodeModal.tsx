import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check, Download, Share2, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import logoImg from '../assets/images/delicias_logo_1789583829461.jpg';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantName: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  restaurantName,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    if (!isOpen) return;
    const generateQR = async () => {
      try {
        const urlToEncode = window.location.href || 'https://delicias-del-atlantico.menu';
        const dataUrl = await QRCode.toDataURL(urlToEncode, {
          width: 512,
          margin: 2,
          color: {
            dark: '#081E3D', // Ocean navy
            light: '#FFFFFF',
          },
          errorCorrectionLevel: 'H',
        });
        setQrDataUrl(dataUrl);
      } catch (err) {
        console.error('Error generating QR code:', err);
      }
    };
    generateQR();
  }, [isOpen]);

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // fallback
    }
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `QR_Menu_${restaurantName.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: restaurantName,
          text: `Menú Digital de Mariscos y Ceviches - ${restaurantName}`,
          url: window.location.href,
        });
      } catch {
        // cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-cyan-200 text-slate-800"
          >
            {/* Header with ocean gradient */}
            <div className="bg-gradient-to-r from-[#081E3D] via-[#0C2B54] to-[#0A3A6B] p-5 text-white text-center relative">
              <button
                id="btn-close-qr-modal"
                onClick={onClose}
                aria-label="Cerrar modal de código QR"
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-cyan-200 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex justify-center mb-2">
                <div className="w-14 h-14 rounded-2xl bg-white p-1 shadow-lg border-2 border-cyan-300/40 flex items-center justify-center overflow-hidden">
                  <img
                    src={logoImg}
                    alt={restaurantName}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <h3 className="font-['Outfit'] font-black text-lg sm:text-xl tracking-tight text-white">
                {restaurantName}
              </h3>
              <p className="text-xs text-cyan-200 font-semibold tracking-wider uppercase mt-0.5">
                CÓDIGO QR · CARTA DIGITAL
              </p>
            </div>

            {/* QR Visual Canvas */}
            <div className="p-6 flex flex-col items-center text-center">
              <div className="relative p-4 bg-white rounded-2xl shadow-lg border-2 border-slate-100 flex items-center justify-center">
                {qrDataUrl ? (
                  <div className="relative">
                    <img
                      src={qrDataUrl}
                      alt="Código QR del Menú Digital"
                      className="w-56 h-56 sm:w-60 sm:h-60 rounded-xl"
                    />
                    {/* Small center logo badge */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 bg-white rounded-xl p-1 shadow-md border-2 border-[#081E3D] overflow-hidden flex items-center justify-center">
                        <img
                          src={logoImg}
                          alt="Logo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-56 h-56 flex flex-col items-center justify-center gap-2 text-slate-400">
                    <QrCode className="w-10 h-10 animate-pulse text-cyan-600" />
                    <span className="text-xs">Generando código QR...</span>
                  </div>
                )}
              </div>

              <p className="text-xs font-semibold text-slate-600 mt-4 leading-relaxed max-w-[240px]">
                Apunta la cámara de tu celular para abrir y explorar la carta en tu mesa
              </p>

              {/* Action buttons */}
              <div className="w-full grid grid-cols-2 gap-2.5 mt-5">
                <button
                  id="btn-qr-copy-link"
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-600" />
                      <span>Copiar link</span>
                    </>
                  )}
                </button>

                <button
                  id="btn-qr-download"
                  onClick={handleDownloadQR}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border border-cyan-200 font-bold text-xs transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-cyan-700" />
                  <span>Descargar</span>
                </button>
              </div>

              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  id="btn-qr-share"
                  onClick={handleShare}
                  className="w-full mt-2.5 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-white" />
                  <span>Compartir con clientes</span>
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
