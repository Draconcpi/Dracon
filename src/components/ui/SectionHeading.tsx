import type { ReactNode } from 'react';

interface SectionHeadingProps {
  title: ReactNode;
  subtitle?: ReactNode;
  id?: string;
  /** `split`: title left, subtitle right (default). `center`: stacked and centred. */
  align?: 'split' | 'center';
  className?: string;
  action?: ReactNode;
}

/** Section title with its subtitle and the orbit rule. Animated by the page's `useReveal`. */
export default function SectionHeading({ title, subtitle, id, align = 'split', className = '', action }: SectionHeadingProps) {
  if (align === 'center') {
    return (
      <div className={`mx-auto max-w-2xl text-center ${className}`}>
        <h2 id={id} data-reveal="rise" className="display text-[clamp(2.25rem,4.6vw,3.75rem)]">
          {title}
        </h2>
        {subtitle && (
          <p data-reveal="rise" className="text-pretty mx-auto mt-5 max-w-[52ch] text-lg leading-relaxed text-dracon-mist">
            {subtitle}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="grid gap-6 md:grid-cols-12 md:items-end">
        <h2 id={id} data-reveal="rise" className="display text-[clamp(2.25rem,4.6vw,3.75rem)] md:col-span-7">
          {title}
        </h2>
        <div className="md:col-span-5 md:pb-2">
          {subtitle && (
            <p data-reveal="rise" className="text-pretty max-w-[46ch] text-lg leading-relaxed text-dracon-mist">
              {subtitle}
            </p>
          )}
          {action && (
            <div data-reveal="rise" className="mt-5">
              {action}
            </div>
          )}
        </div>
      </div>
      <div data-reveal="line" className="rule-orbit mt-10" />
    </div>
  );
}
