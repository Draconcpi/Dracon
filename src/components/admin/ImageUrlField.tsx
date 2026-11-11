'use client';

import { ImageOff, Info } from 'lucide-react';
import ArtImage from '@/components/ui/ArtImage';

interface ImageUrlFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
}

/** Image link input (Google Drive, uploads or any URL) with a live preview. */
export default function ImageUrlField({ value, onChange, label = 'Imagem', required }: ImageUrlFieldProps) {
  return (
    <div>
      <label className="block text-sm text-gray-300 mb-1">{label}</label>
      <input
        type="text"
        className="input-arcane"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder="Cole aqui o link do Google Drive"
      />
      <p className="mt-1.5 flex items-start gap-1.5 text-xs text-gray-500">
        <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
        No Google Drive: Compartilhar → Acesso geral → “Qualquer pessoa com o link” → Copiar link.
      </p>
      {value.trim() && (
        <div className="relative mt-3 h-40 overflow-hidden rounded-lg border border-white/10 bg-dracon-void/60">
          <ArtImage
            src={value}
            alt="Pré-visualização"
            fill
            sizes="640px"
            className="object-contain"
            fallback={
              <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center text-xs text-amber-300/90">
                <ImageOff className="h-6 w-6" />
                Não foi possível carregar a imagem. Verifique se o arquivo está compartilhado como “Qualquer pessoa com o link”.
              </div>
            }
          />
        </div>
      )}
    </div>
  );
}
