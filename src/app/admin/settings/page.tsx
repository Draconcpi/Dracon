'use client';

import { useState, useEffect } from 'react';
import MagicButton from '@/components/ui/MagicButton';

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
        body: JSON.stringify(settings),
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

  const settingFields = [
    { key: 'site_title', label: 'Título do Site', type: 'text' },
    { key: 'site_description', label: 'Descrição do Site', type: 'textarea' },
    { key: 'artist_name', label: 'Nome do Artista', type: 'text' },
    { key: 'artist_bio', label: 'Bio do Artista', type: 'textarea' },
    { key: 'contact_email', label: 'Email de Contato', type: 'text' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white glow-text">Configurações</h1>
        <p className="text-gray-400 text-sm mt-1">Configurações gerais do site</p>
      </div>

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
            {saving ? '💾 Salvando...' : '💾 Salvar Configurações'}
          </MagicButton>
          {saved && (
            <span className="text-green-400 text-sm animate-pulse">✅ Salvo com sucesso!</span>
          )}
        </div>
      </div>
    </div>
  );
}
