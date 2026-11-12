'use client';

import { useEffect, useRef, useState } from 'react';
import { Briefcase, Check, ChevronDown, CircleAlert, CircleCheck, Flame, LoaderCircle } from 'lucide-react';
import MagicButton from '@/components/ui/MagicButton';
import ServiceIcon from '@/components/ui/ServiceIcon';
import ConstellationDivider from '@/components/ui/ConstellationDivider';
import ConstellationLoader from '@/components/ui/ConstellationLoader';
import PageHeader from '@/components/ui/PageHeader';
import SectionHeading from '@/components/ui/SectionHeading';
import { useReveal } from '@/components/motion/useReveal';
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, EASE } from '@/lib/gsap';
import { useI18n } from '@/i18n';

interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: string | null;
  priceNote: string | null;
  features: string[];
  icon: string;
  order: number;
  active: boolean;
}

const processSteps = [0, 1, 2, 3, 4, 5];

/** A small ringed planet carrying the service's icon. */
function ServicePlanet({ icon }: { icon: string }) {
  return (
    <span className="relative flex h-16 w-16 shrink-0 items-center justify-center">
      <span
        aria-hidden
        className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,#c9a5f5_0%,#7c22ce_38%,#2e0550_75%)] shadow-[inset_-6px_-8px_14px_rgba(5,0,16,0.75),0_0_30px_-6px_rgba(168,85,244,0.7)]"
      />
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[34%] w-[150%] -translate-x-1/2 -translate-y-1/2 -rotate-[18deg] rounded-[50%] border border-dracon-orange-200/60 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-[4deg]"
      />
      <ServiceIcon name={icon} className="relative h-6 w-6 text-white" />
    </span>
  );
}

function ServiceRow({
  service,
  open,
  onToggle,
  onRequest,
}: {
  service: Service;
  open: boolean;
  onToggle: () => void;
  onRequest: () => void;
}) {
  const { t } = useI18n();
  const panel = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const panelId = `servico-${service.id}`;

  useGSAP(
    () => {
      const el = panel.current;
      if (!el) return;
      if (first.current) {
        first.current = false;
        gsap.set(el, { height: open ? 'auto' : 0 });
        return;
      }
      const reduce = !window.matchMedia(MOTION_OK).matches;
      if (open) {
        gsap.fromTo(el, { height: 0 }, { height: 'auto', duration: reduce ? 0 : 0.8, ease: EASE, onComplete: () => ScrollTrigger.refresh() });
        if (!reduce) gsap.from(el.querySelectorAll('[data-feature]'), { x: -12, opacity: 0, duration: 0.6, stagger: 0.05, ease: EASE, delay: 0.15 });
      } else {
        gsap.to(el, { height: 0, duration: reduce ? 0 : 0.55, ease: 'power3.inOut', onComplete: () => ScrollTrigger.refresh() });
      }
    },
    { dependencies: [open], scope: panel }
  );

  return (
    <li data-reveal="rise" className="group border-b border-dracon-purple-100/15">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-5 py-8 text-left sm:gap-8 md:grid-cols-[auto_1fr_auto_auto]"
        >
          <ServicePlanet icon={service.icon} />
          <span className="min-w-0">
            <span className="block font-display text-[clamp(1.5rem,2.6vw,2.25rem)] font-semibold leading-tight text-dracon-starlight transition-colors duration-300 group-hover:text-white">
              {service.title}
            </span>
            <span className="mt-1.5 block font-body text-base text-dracon-mist">{service.shortDescription}</span>
          </span>
          {service.price && (
            <span className="hidden whitespace-nowrap text-right font-display text-lg font-semibold text-dracon-orange-300 md:block">
              {service.price}
            </span>
          )}
          <ChevronDown
            className={`h-6 w-6 shrink-0 text-dracon-mist transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? 'rotate-180 text-dracon-orange-300' : ''}`}
            aria-hidden
          />
        </button>
      </h3>

      <div ref={panel} id={panelId} className="overflow-hidden" style={{ height: 0 }}>
        <div className="grid gap-10 pb-10 md:grid-cols-12 md:pl-24">
          <div className="md:col-span-6">
            {service.price && <p className="font-display text-xl font-semibold text-dracon-orange-300 md:hidden">{service.price}</p>}
            <p className="text-pretty mt-2 leading-relaxed text-dracon-starlight/90 md:mt-0">{service.description}</p>
            {service.priceNote && <p className="mt-4 text-sm italic text-dracon-dust">{service.priceNote}</p>}
            <div className="mt-7">
              <MagicButton variant="fire" onClick={onRequest}>
                <Flame className="h-4 w-4" aria-hidden />
                {t('services.requestQuote')}
              </MagicButton>
            </div>
          </div>
          {service.features.length > 0 && (
            <ul className="grid content-start gap-3 sm:grid-cols-2 md:col-span-6">
              {service.features.map((feature, fi) => (
                <li key={fi} data-feature className="flex items-start gap-3 text-dracon-mist">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-dracon-orange-300" aria-hidden />
                  {feature}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </li>
  );
}

/** The commission path: a line of light that reaches each stage as the visitor scrolls. */
function ProcessOrbit() {
  const { t } = useI18n();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        { wide: `(min-width: 1024px) and ${MOTION_OK}`, narrow: `(max-width: 1023px) and ${MOTION_OK}` },
        (ctx) => {
          const wide = Boolean(ctx.conditions?.wide);
          const nodes = gsap.utils.toArray<HTMLElement>('[data-step-node]');
          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: '[data-steps]', start: 'top 75%', end: 'bottom 55%', scrub: 0.6 },
          });
          tl.fromTo('[data-step-line]', wide ? { scaleX: 0 } : { scaleY: 0 }, wide ? { scaleX: 1, duration: nodes.length } : { scaleY: 1, duration: nodes.length }, 0);
          nodes.forEach((node, i) => {
            tl.fromTo(
              node,
              { backgroundColor: '#0a0015', color: '#9a8db1', boxShadow: '0 0 0 0 rgba(249,115,22,0)' },
              { backgroundColor: '#f97316', color: '#1a0033', boxShadow: '0 0 30px 2px rgba(249,115,22,0.55)', duration: 0.4 },
              i + 0.1
            );
          });
        }
      );
    },
    { scope: root }
  );

  return (
    <section ref={root} aria-labelledby="processo" className="section-container relative py-28">
      <ConstellationDivider />
      <SectionHeading id="processo" title={t('services.process.title')} subtitle={t('services.process.subtitle')} />

      <ol data-steps className="relative mt-16 grid gap-10 lg:mt-20 lg:grid-cols-6 lg:gap-6">
        <span aria-hidden className="absolute bottom-6 left-6 top-6 w-px bg-dracon-purple-100/15 lg:bottom-auto lg:left-7 lg:right-7 lg:top-7 lg:h-px lg:w-auto" />
        <span
          aria-hidden
          data-step-line
          className="absolute bottom-6 left-6 top-6 w-px origin-top bg-gradient-to-b from-dracon-purple-300 to-dracon-orange-300 lg:bottom-auto lg:left-7 lg:right-7 lg:top-7 lg:h-px lg:w-auto lg:origin-left lg:bg-gradient-to-r"
        />
        {processSteps.map((i) => (
          <li key={i} data-reveal="rise" className="relative grid grid-cols-[3rem_1fr] gap-5 lg:block">
            <span
              data-step-node
              className="num relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-dracon-purple-100/30 bg-dracon-orange-500 font-display text-lg font-bold text-dracon-purple-950 lg:h-14 lg:w-14"
            >
              {i + 1}
            </span>
            <div className="lg:mt-7 lg:pr-2">
              <h3 className="font-display text-xl font-semibold text-dracon-starlight">{t(`services.process.steps.${i}.title`)}</h3>
              <p className="text-pretty mt-2 text-dracon-mist">{t(`services.process.steps.${i}.description`)}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function ServicesPage() {
  const { t } = useI18n();
  const page = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [serviceType, setServiceType] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        if (data.success) setServices(data.data);
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  useReveal(page, [loading]);

  useEffect(() => {
    if (loading) return;
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [loading]);

  const requestQuote = (title: string) => {
    setServiceType(title);
    const reduce = !window.matchMedia(MOTION_OK).matches;
    document.getElementById('orcamento')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    window.setTimeout(() => document.getElementById('quote-subject')?.focus({ preventScroll: true }), reduce ? 0 : 700);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const field = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement).value.trim();
    const subject = field('subject');
    setStatus('sending');
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: field('name'),
          email: field('email'),
          subject: serviceType ? `[${serviceType}] ${subject}` : subject,
          message: field('description'),
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('sent');
      form.reset();
      setServiceType('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div ref={page} className="min-h-screen pb-24">
      <PageHeader title={t('services.header.title')} subtitle={t('services.header.subtitle')} glyph="orion" glyphColor="#fdba74" />

      {/* Services */}
      <section aria-label={t('services.header.title')} className="section-container">
        {loading && <ConstellationLoader label={t('common.loading')} className="py-20" />}
        {!loading && services.length === 0 && (
          <div className="py-20 text-center">
            <Briefcase className="mx-auto mb-4 h-12 w-12 text-dracon-purple-300/60" strokeWidth={1.25} aria-hidden />
            <p className="text-lg text-dracon-mist">{t('services.empty')}</p>
          </div>
        )}
        {services.length > 0 && (
          <ul className="border-t border-dracon-purple-100/15">
            {services.map((service) => (
              <ServiceRow
                key={service.id}
                service={service}
                open={expandedService === service.id}
                onToggle={() => setExpandedService(expandedService === service.id ? null : service.id)}
                onRequest={() => requestQuote(service.title)}
              />
            ))}
          </ul>
        )}
      </section>

      <ProcessOrbit />

      {/* Commission form */}
      <section id="orcamento" aria-labelledby="orcamento-titulo" className="section-container relative scroll-mt-28 pt-16">
        <ConstellationDivider tone="orange" variant={2} />
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="orcamento-titulo" data-reveal="rise" className="display text-[clamp(2.25rem,4.6vw,3.5rem)]">
              {t('services.form.title')}
            </h2>
            <p data-reveal="rise" className="text-pretty mt-5 max-w-[36ch] text-lg text-dracon-mist">
              {t('services.form.subtitle')}
            </p>
          </div>

          <form ref={formRef} data-reveal="rise" onSubmit={handleSubmit} className="card-arcane space-y-6 p-6 sm:p-10 lg:col-span-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="quote-name" className="mb-2 block text-sm font-medium text-dracon-starlight">
                  {t('services.form.name')}
                </label>
                <input id="quote-name" name="name" type="text" autoComplete="name" className="input-arcane" placeholder={t('services.form.namePlaceholder')} required />
              </div>
              <div>
                <label htmlFor="quote-email" className="mb-2 block text-sm font-medium text-dracon-starlight">
                  {t('services.form.email')}
                </label>
                <input id="quote-email" name="email" type="email" autoComplete="email" className="input-arcane" placeholder={t('services.form.emailPlaceholder')} required />
              </div>
            </div>

            <div>
              <label htmlFor="quote-service" className="mb-2 block text-sm font-medium text-dracon-starlight">
                {t('services.form.serviceType')}
              </label>
              <select
                id="quote-service"
                name="serviceType"
                className="input-arcane"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                required
              >
                <option value="">{t('services.form.serviceDefault')}</option>
                {services.map((s) => (
                  <option key={s.id} value={s.title}>
                    {s.title}
                  </option>
                ))}
                <option value={t('services.form.serviceOther')}>{t('services.form.serviceOther')}</option>
              </select>
            </div>

            <div>
              <label htmlFor="quote-subject" className="mb-2 block text-sm font-medium text-dracon-starlight">
                {t('services.form.subject')}
              </label>
              <input id="quote-subject" name="subject" type="text" className="input-arcane" placeholder={t('services.form.subjectPlaceholder')} required />
            </div>

            <div>
              <label htmlFor="quote-description" className="mb-2 block text-sm font-medium text-dracon-starlight">
                {t('services.form.description')}
              </label>
              <textarea
                id="quote-description"
                name="description"
                className="input-arcane min-h-[160px] resize-y"
                placeholder={t('services.form.descriptionPlaceholder')}
                required
              />
            </div>

            <div aria-live="polite">
              {status === 'sent' && (
                <p className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-900/25 p-4 text-sm text-emerald-200">
                  <CircleCheck className="h-4 w-4 shrink-0" aria-hidden />
                  {t('services.form.success')}
                </p>
              )}
              {status === 'error' && (
                <p className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-900/25 p-4 text-sm text-red-200">
                  <CircleAlert className="h-4 w-4 shrink-0" aria-hidden />
                  {t('services.form.error')}
                </p>
              )}
            </div>

            <MagicButton type="submit" variant="fire" className="w-full py-4 text-lg" disabled={status === 'sending'}>
              {status === 'sending' ? <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden /> : <Flame className="h-5 w-5" aria-hidden />}
              {status === 'sending' ? t('services.form.sending') : t('services.form.submit')}
            </MagicButton>
          </form>
        </div>
      </section>
    </div>
  );
}
