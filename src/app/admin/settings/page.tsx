'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CircleCheck, LoaderCircle, Save, Type } from 'lucide-react';
import MagicButton from '@/components/ui/MagicButton';

const settingFields = [
  { key: 'site_title', label: 'Título do site (aba do navegador e Google)', type: 'text' },
  { key: 'site_description', label: 'Descrição do site (Google e redes sociais)', type: 'textarea' },
] as const;

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success) setSettings(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          Object.fromEntries(settingFields.map(({ key }) => [key, settings[key] ?? '']))
        ),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) return <div className="text-gray-400">Carregando...</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white glow-text">Configurações</h1>
        <p className="text-gray-400 text-sm mt-1">Como o site aparece no Google, nas abas e ao ser compartilhado</p>
      </div>

      <Link
        href="/admin/content"
        className="card-arcane mb-6 flex max-w-2xl items-center gap-3 p-4 text-sm text-gray-300 hover:text-white"
      >
        <Type className="h-5 w-5 flex-shrink-0 text-dracon-purple-300" />
        Para editar os textos das páginas (títulos, descrições, botões, rodapé...), use <strong>Textos do Site</strong>.
      </Link>

      <div className="card-arcane p-8 max-w-2xl space-y-6">
        {settingFields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm text-gray-300 mb-2 font-medium">{field.label}</label>
            {field.type === 'textarea' ? (
              <textarea
                className="input-arcane min-h-[100px]"
                value={settings[field.key] || ''}
                onChange={(e) => updateSetting(field.key, e.target.value)}
              />
            ) : (
              <input
                type="text"
                className="input-arcane"
                value={settings[field.key] || ''}
                onChange={(e) => updateSetting(field.key, e.target.value)}
              />
            )}
          </div>
        ))}

        <div className="flex items-center gap-4 pt-4">
          <MagicButton onClick={handleSave} disabled={saving}>
            {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </MagicButton>
          {saved && (
            <span className="flex items-center gap-2 text-green-400 text-sm">
              <CircleCheck className="h-4 w-4" /> Salvo com sucesso!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
