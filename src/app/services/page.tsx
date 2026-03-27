'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import GlowText from '@/components/ui/GlowText';
import MagicButton from '@/components/ui/MagicButton';
import AnimatedCard from '@/components/ui/AnimatedCard';

const services = [
  {
    id: '1',
    title: 'Ilustração Personalizada',
    icon: '🎨',
    shortDescription: 'Ilustrações originais de fantasia e magia sob encomenda.',
    description: 'Criação de ilustrações únicas e personalizadas com temática de fantasia, magia e elementos místicos. Cada peça é criada do zero, desde o esboço até a arte final em alta resolução.',
    price: 'A partir de R$ 350',
    priceNote: 'Preço varia conforme complexidade e tamanho',
    features: ['Esboço + 2 revisões', 'Arte final em alta resolução', 'Arquivo PNG e PSD', 'Comercial ou pessoal', 'Prazo: 7-14 dias'],
  },
  {
    id: '2',
    title: 'Concept Art',
    icon: '✏️',
    shortDescription: 'Design visual de personagens, criaturas e ambientes.',
    description: 'Desenvolvimento visual de conceitos para jogos, filmes, livros e projetos criativos. Inclui design de personagens, ambientes e criaturas com estética arcana.',
    price: 'A partir de R$ 500',
    priceNote: 'Pacotes disponíveis para projetos maiores',
    features: ['Múltiplos conceitos iniciais', 'Turnaround sheet', 'Detalhes de design', 'Style guide', 'Prazo: 10-21 dias'],
  },
  {
    id: '3',
    title: 'Animação 2D',
    icon: '🎬',
    shortDescription: 'Animações curtas e loops com temática mística.',
    description: 'Animações curtas, loops e motion graphics com estética mística e fantástica. Ideal para redes sociais, intros de vídeo e projetos artísticos.',
    price: 'A partir de R$ 800',
    priceNote: 'Consulte para projetos mais longos',
    features: ['Storyboard incluído', 'Até 15 segundos', 'Formato MP4/GIF', 'Trilha sonora opcional', 'Prazo: 14-30 dias'],
  },
  {
    id: '4',
    title: 'Design de Personagem',
    icon: '🐉',
    shortDescription: 'Personagens originais com ficha completa de referência.',
    description: 'Criação completa de personagens originais com ficha de referência, poses, expressões e detalhes de equipamento/vestimenta.',
    price: 'A partir de R$ 600',
    priceNote: 'Inclui ficha de referência completa',
    features: ['Design original completo', 'Vista frontal e traseira', 'Expressões faciais', 'Detalhes de equipamento', 'Prazo: 10-18 dias'],
  },
];

const processSteps = [
  { step: 1, title: 'Contato Inicial', description: 'Descreva sua visão, referências e detalhes do projeto.', icon: '💬' },
  { step: 2, title: 'Orçamento', description: 'Receba um orçamento detalhado e prazo de entrega.', icon: '📋' },
  { step: 3, title: 'Esboço', description: 'Aprovação do esboço inicial antes da arte final.', icon: '✏️' },
  { step: 4, title: 'Criação', description: 'Desenvolvimento da arte com atualizações de progresso.', icon: '🎨' },
  { step: 5, title: 'Revisão', description: 'Ajustes finais para garantir sua satisfação.', icon: '🔍' },
  { step: 6, title: 'Entrega', description: 'Arquivos finais em alta resolução prontos para uso.', icon: '✨' },
];

export default function ServicesPage() {
  const [expandedService, setExpandedService] = useState<string | null>(null);

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Header */}
      <section className="section-container text-center mb-20">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-dracon-orange-400 text-sm tracking-[0.3em] uppercase font-medium mb-4"
        >
          ✦ Comissões & Serviços ✦
        </motion.p>
        <GlowText as="h1" className="text-5xl md:text-6xl font-bold mb-4">
          Serviços
        </GlowText>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 max-w-2xl mx-auto text-lg"
        >
          Transforme sua visão em arte. Cada projeto é tratado com dedicação artesanal
          e paixão pelo fantástico.
        </motion.p>
      </section>

      {/* Services Grid */}
      <section className="section-container mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, i) => (
            <AnimatedCard
              key={service.id}
              delay={i * 0.1}
              onClick={() => setExpandedService(expandedService === service.id ? null : service.id)}
            >
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <motion.span
                    className="text-4xl"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                  >
                    {service.icon}
                  </motion.span>
                  <span className="text-dracon-orange-400 font-bold text-lg">
                    {service.price}
                  </span>
                </div>

                <h3 className="text-2xl font-display font-bold text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-400 mb-4">{service.shortDescription}</p>

                {/* Expanded content */}
                <motion.div
                  initial={false}
                  animate={{
                    height: expandedService === service.id ? 'auto' : 0,
                    opacity: expandedService === service.id ? 1 : 0,
                  }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 border-t border-dracon-purple-800/20">
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">{service.description}</p>
                    <p className="text-dracon-purple-400 text-xs mb-4 italic">{service.priceNote}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                          <span className="text-dracon-purple-400">✦</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>

                <button className="mt-4 text-dracon-purple-400 text-sm hover:text-dracon-purple-300 transition-colors">
                  {expandedService === service.id ? '← Menos detalhes' : 'Ver detalhes →'}
                </button>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="section-container mb-32">
        <div className="text-center mb-16">
          <GlowText as="h2" className="text-3xl md:text-4xl font-bold mb-4">
            Como Funciona
          </GlowText>
          <p className="text-gray-400 max-w-lg mx-auto">
            O processo de encomenda em 6 passos simples — do conceito à arte final.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processSteps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-arcane p-6 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-dracon-purple-900/50 border border-dracon-purple-600/30 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">{step.icon}</span>
              </div>
              <div className="text-dracon-orange-400 text-xs font-bold tracking-wider mb-2">
                PASSO {step.step}
              </div>
              <h3 className="text-lg font-display font-bold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-gray-400 text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Commission Form */}
      <section className="section-container">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <GlowText as="h2" className="text-3xl md:text-4xl font-bold mb-4" color="orange">
              Solicitar Orçamento
            </GlowText>
            <p className="text-gray-400">
              Preencha o formulário abaixo e retornarei em até 48 horas.
            </p>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-arcane p-8 space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              alert('Mensagem enviada! (Em produção, isto será enviado ao servidor)');
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-300 mb-2 font-medium">Nome</label>
                <input type="text" className="input-arcane" placeholder="Seu nome" required />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2 font-medium">Email</label>
                <input type="email" className="input-arcane" placeholder="seu@email.com" required />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2 font-medium">Tipo de Serviço</label>
              <select className="input-arcane" required>
                <option value="">Selecione um serviço</option>
                {services.map((s) => (
                  <option key={s.id} value={s.title}>{s.title}</option>
                ))}
                <option value="outro">Outro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2 font-medium">Assunto</label>
              <input type="text" className="input-arcane" placeholder="Sobre o que é sua encomenda?" required />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2 font-medium">Descrição do Projeto</label>
              <textarea
                className="input-arcane min-h-[150px] resize-y"
                placeholder="Descreva sua visão, referências, personagens, cenários... quanto mais detalhes, melhor!"
                required
              />
            </div>

            <MagicButton type="submit" variant="fire" className="w-full text-lg py-4">
              🔥 Enviar Solicitação
            </MagicButton>
          </motion.form>
        </div>
      </section>
    </div>
  );
}
