import React from 'react';
import { X, Download, ExternalLink } from 'lucide-react';

interface ImageLightboxModalProps {
  imageUrl: string | null;
  title?: string;
  onClose: () => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({ imageUrl, title, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center">
        
        {/* Top Controls */}
        <div className="w-full flex items-center justify-between text-white pb-3 px-1">
          <span className="text-sm font-semibold truncate text-slate-200">
            {title || 'Laboratory Attachment / Image Preview'}
          </span>
          <div className="flex items-center gap-2">
            <a
              href={imageUrl}
              download="beergeel_lab_attachment.png"
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-1 text-xs"
              title="Download image"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </a>
            <button
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Display */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl max-h-[80vh] flex items-center justify-center p-2">
          <img
            src={imageUrl}
            alt="Lab attachment"
            className="max-h-[75vh] max-w-full object-contain rounded-lg"
          />
        </div>

      </div>
    </div>
  );
};
