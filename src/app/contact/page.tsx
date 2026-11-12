'use client';

import { useRef, useState } from 'react';
import { ArrowUpRight, CircleAlert, CircleCheck, LoaderCircle, Send } from 'lucide-react';
import MagicButton from '@/components/ui/MagicButton';
import Astrolabe from '@/components/ui/Astrolabe';
import SocialIcon from '@/components/ui/SocialIcon';
import PageHeader from '@/components/ui/PageHeader';
import { useReveal } from '@/components/motion/useReveal';
import { SOCIAL_LINKS } from '@/lib/constants';
import { useI18n } from '@/i18n';

const SOCIAL_NAMES: Record<string, string> = {
  instagram: 'Instagram',
  twitter: 'X',
  artstation: 'ArtStation',
  behance: 'Behance',
};

export default function ContactPage() {
  const { t } = useI18n();
  const page = useRef<HTMLDivElement>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  useReveal(page);

  const email = t('contact.info.emailAddress');

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
      } else {
        setFormStatus('error');
      }
    } catch {
      setFormStatus('error');
    }
  };

  return (
    <div ref={page} className="min-h-screen pb-24">
      <PageHeader title={t('contact.header.title')} subtitle={t('contact.header.subtitle')} glyph="cassiopeia" glyphColor="#fdba74" />

      <div className="section-container">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          {/* Contact details */}
          <aside className="lg:col-span-4">
            <dl className="space-y-10">
              <div data-reveal="rise">
                <dt className="meta">{t('contact.info.email')}</dt>
                <dd className="mt-2">
                  <a
                    href={`mailto:${email}`}
                    className="link-underline inline-flex items-center gap-2 pb-1 text-xl font-medium text-dracon-starlight hover:text-white"
                  >
                    {email}
                    <ArrowUpRight className="h-5 w-5 text-dracon-orange-300" aria-hidden />
                  </a>
                </dd>
              </div>
              <div data-reveal="rise">
                <dt className="meta">{t('contact.info.response')}</dt>
                <dd className="mt-2 text-lg text-dracon-starlight">{t('contact.info.responseText')}</dd>
              </div>
              <div data-reveal="rise">
                <dt className="meta">{t('contact.info.social')}</dt>
                <dd className="mt-4">
                  <ul className="space-y-3">
                    {Object.entries(SOCIAL_LINKS).map(([name, url]) => (
                      <li key={name}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center gap-3 text-dracon-mist transition-colors duration-300 hover:text-white"
                        >
                          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-dracon-purple-100/20 transition-colors duration-300 group-hover:border-dracon-orange-300/60 group-hover:text-dracon-orange-200">
                            <SocialIcon name={name} className="h-4 w-4" />
                          </span>
                          {SOCIAL_NAMES[name] ?? name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>

            <div data-reveal="rise" className="mt-14 hidden justify-start opacity-80 lg:flex">
              <Astrolabe className="w-56" />
            </div>
          </aside>

          {/* Contact form */}
          <form data-reveal="rise" onSubmit={handleSubmit} className="card-arcane space-y-6 p-6 sm:p-10 lg:col-span-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-dracon-starlight">
                  {t('contact.form.name')}
                </label>
                <input id="name" name="name" type="text" autoComplete="name" className="input-arcane" placeholder={t('contact.form.namePlaceholder')} required />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-dracon-starlight">
                  {t('contact.form.email')}
                </label>
                <input id="email" name="email" type="email" autoComplete="email" className="input-arcane" placeholder={t('contact.form.emailPlaceholder')} required />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="mb-2 block text-sm font-medium text-dracon-starlight">
                {t('contact.form.subject')}
              </label>
              <input id="subject" name="subject" type="text" className="input-arcane" placeholder={t('contact.form.subjectPlaceholder')} required />
            </div>

            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-medium text-dracon-starlight">
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

            <div aria-live="polite">
              {formStatus === 'sent' && (
                <p className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-900/25 p-4 text-sm text-emerald-200">
                  <CircleCheck className="h-4 w-4 shrink-0" aria-hidden />
                  {t('contact.form.success')}
                </p>
              )}
              {formStatus === 'error' && (
                <p className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-900/25 p-4 text-sm text-red-200">
                  <CircleAlert className="h-4 w-4 shrink-0" aria-hidden />
                  {t('contact.form.error')}
                </p>
              )}
            </div>

            <MagicButton type="submit" variant="primary" className="w-full py-4 text-lg" disabled={formStatus === 'sending'}>
              {formStatus === 'sending' ? <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden /> : <Send className="h-5 w-5" aria-hidden />}
              {formStatus === 'sending' ? t('contact.form.sending') : t('contact.form.submit')}
            </MagicButton>
          </form>
        </div>
      </div>
    </div>
  );
}
