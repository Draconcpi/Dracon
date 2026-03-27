'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import GlowText from '@/components/ui/GlowText';
import MagicButton from '@/components/ui/MagicButton';
import { SOCIAL_LINKS } from '@/lib/constants';

export default function ContactPage() {
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
          ✦ Fale Comigo ✦
        </motion.p>
        <GlowText as="h1" className="text-5xl md:text-6xl font-bold mb-4">
          Contato
        </GlowText>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 max-w-2xl mx-auto text-lg"
        >
          Tem um projeto em mente? Uma dúvida? Ou simplesmente quer conversar sobre arte?
          Envie uma mensagem e retornarei o mais breve possível.
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
              <div className="text-2xl mb-3">📧</div>
              <h3 className="font-display font-bold text-white mb-1">Email</h3>
              <p className="text-dracon-purple-300 text-sm">contato@dracon.art</p>
            </div>

            {/* Response time */}
            <div className="card-arcane p-6">
              <div className="text-2xl mb-3">⏰</div>
              <h3 className="font-display font-bold text-white mb-1">Tempo de Resposta</h3>
              <p className="text-gray-400 text-sm">Respondo em até 48 horas</p>
            </div>

            {/* Social Links */}
            <div className="card-arcane p-6">
              <div className="text-2xl mb-3">🌐</div>
              <h3 className="font-display font-bold text-white mb-3">Redes Sociais</h3>
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
            <div className="hidden lg:block relative h-48">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <svg width="150" height="150" viewBox="0 0 150 150" className="opacity-20">
                  <circle cx="75" cy="75" r="70" fill="none" stroke="rgba(168,85,244,0.4)" strokeWidth="0.5" />
                  <circle cx="75" cy="75" r="50" fill="none" stroke="rgba(168,85,244,0.3)" strokeWidth="0.5" />
                  <circle cx="75" cy="75" r="30" fill="none" stroke="rgba(249,115,22,0.2)" strokeWidth="0.5" />
                  {[0, 72, 144, 216, 288].map((angle) => {
                    const rad = (angle * Math.PI) / 180;
                    const x = 75 + 60 * Math.cos(rad);
                    const y = 75 + 60 * Math.sin(rad);
                    return <circle key={angle} cx={x} cy={y} r="3" fill="rgba(168,85,244,0.4)" />;
                  })}
                </svg>
              </motion.div>
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
                    Nome *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="input-arcane"
                    placeholder="Seu nome completo"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm text-gray-300 mb-2 font-medium">
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="input-arcane"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm text-gray-300 mb-2 font-medium">
                  Assunto *
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  className="input-arcane"
                  placeholder="Sobre o que gostaria de conversar?"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm text-gray-300 mb-2 font-medium">
                  Mensagem *
                </label>
                <textarea
                  id="message"
                  name="message"
                  className="input-arcane min-h-[200px] resize-y"
                  placeholder="Escreva sua mensagem aqui... descreva seu projeto, suas ideias, referências visuais, ou qualquer outra informação relevante."
                  required
                />
              </div>

              {formStatus === 'sent' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-green-900/30 border border-green-600/30 text-green-300 text-sm"
                >
                  ✅ Mensagem enviada com sucesso! Retornarei em breve.
                </motion.div>
              )}

              {formStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-red-900/30 border border-red-600/30 text-red-300 text-sm"
                >
                  ❌ Erro ao enviar mensagem. Por favor, tente novamente.
                </motion.div>
              )}

              <MagicButton
                type="submit"
                variant="primary"
                className="w-full text-lg py-4"
                disabled={formStatus === 'sending'}
              >
                {formStatus === 'sending' ? '✦ Enviando...' : '✦ Enviar Mensagem'}
              </MagicButton>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
