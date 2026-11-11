'use client';

import { useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import GlowText from '@/components/ui/GlowText';
import MagicButton from '@/components/ui/MagicButton';
import Astrolabe from '@/components/ui/Astrolabe';
import { SOCIAL_LINKS } from '@/lib/constants';
import { useI18n } from '@/i18n';

function IconBadge({ children }: { children: ReactNode }) {
  return (
    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-dracon-purple-100/25 bg-dracon-purple-500/10 text-dracon-purple-100 shadow-[0_0_20px_rgba(168,85,244,0.25)]">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {children}
      </svg>
    </div>
  );
}

export default function ContactPage() {
  const { t } = useI18n();
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('sending');

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      subject: (form.elements.namedItem('subject') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setFormStatus('sent');
        form.reset();
        setTimeout(() => setFormStatus('idle'), 5000);
      } else {
        setFormStatus('error');
        setTimeout(() => setFormStatus('idle'), 5000);
      }
    } catch {
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 5000);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Header */}
      <section className="section-container text-center mb-20">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-dracon-orange-400 text-sm tracking-[0.3em] uppercase font-medium mb-4"
        >
          {t('contact.header.tag')}
        </motion.p>
        <GlowText as="h1" className="text-5xl md:text-6xl font-bold mb-4">
          {t('contact.header.title')}
        </GlowText>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 max-w-2xl mx-auto text-lg"
        >
          {t('contact.header.subtitle')}
        </motion.p>
      </section>

      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Email */}
            <div className="card-arcane p-6">
              <IconBadge>
                <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
                <path d="m4 7 8 6 8-6" />
              </IconBadge>
              <h3 className="font-display font-bold text-white mb-1">{t('contact.info.email')}</h3>
              <p className="text-dracon-purple-300 text-sm">{t('contact.info.emailAddress')}</p>
            </div>

            {/* Response time */}
            <div className="card-arcane p-6">
              <IconBadge>
                <circle cx="12" cy="12" r="8.5" />
                <path d="M12 7.5V12l3 2" />
              </IconBadge>
              <h3 className="font-display font-bold text-white mb-1">{t('contact.info.response')}</h3>
              <p className="text-gray-400 text-sm">{t('contact.info.responseText')}</p>
            </div>

            {/* Social Links */}
            <div className="card-arcane p-6">
              <IconBadge>
                <circle cx="12" cy="12" r="8.5" />
                <path d="M3.5 12h17" />
                <path d="M12 3.5a13 13 0 0 1 0 17a13 13 0 0 1 0-17" />
              </IconBadge>
              <h3 className="font-display font-bold text-white mb-3">{t('contact.info.social')}</h3>
              <div className="space-y-2">
                {Object.entries(SOCIAL_LINKS).map(([name, url]) => (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-400 hover:text-dracon-purple-300 transition-colors py-1"
                  >
                    <span className="w-8 h-8 rounded bg-dracon-purple-900/30 border border-dracon-purple-800/30 flex items-center justify-center text-xs font-bold uppercase">
                      {name.slice(0, 2)}
                    </span>
                    <span className="text-sm capitalize">{name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Cosmic decoration */}
            <div className="hidden lg:flex justify-center opacity-80">
              <Astrolabe className="w-56" />
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit} className="card-arcane p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm text-gray-300 mb-2 font-medium">
                    {t('contact.form.name')}
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="input-arcane"
                    placeholder={t('contact.form.namePlaceholder')}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm text-gray-300 mb-2 font-medium">
                    {t('contact.form.email')}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="input-arcane"
                    placeholder={t('contact.form.emailPlaceholder')}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm text-gray-300 mb-2 font-medium">
                  {t('contact.form.subject')}
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  className="input-arcane"
                  placeholder={t('contact.form.subjectPlaceholder')}
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm text-gray-300 mb-2 font-medium">
                  {t('contact.form.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  className="input-arcane min-h-[200px] resize-y"
                  placeholder={t('contact.form.messagePlaceholder')}
                  required
                />
              </div>

              {formStatus === 'sent' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-green-900/30 border border-green-600/30 text-green-300 text-sm"
                >
                  {t('contact.form.success')}
                </motion.div>
              )}

              {formStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-red-900/30 border border-red-600/30 text-red-300 text-sm"
                >
                  {t('contact.form.error')}
                </motion.div>
              )}

              <MagicButton
                type="submit"
                variant="primary"
                className="w-full text-lg py-4"
                disabled={formStatus === 'sending'}
              >
                {formStatus === 'sending' ? t('contact.form.sending') : t('contact.form.submit')}
              </MagicButton>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
