import AnimatedSection from './AnimatedSection'
import { cn } from '@/lib/utils'

interface Props {
  badge?: string
  title: string
  subtitle?: string
  align?: 'center' | 'left'
  light?: boolean
  className?: string
}

export default function SectionTitle({ badge, title, subtitle, align = 'center', light = false, className }: Props) {
  return (
    <AnimatedSection className={cn('mb-12', align === 'center' && 'text-center', className)}>
      {badge && (
        <span className={cn(
          'inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4',
          light ? 'bg-white/15 text-white' : 'bg-medical-light text-primary-800'
        )}>
          {badge}
        </span>
      )}
      <h2 className={cn('text-3xl md:text-4xl lg:text-5xl font-bold leading-tight', light ? 'text-white' : 'text-primary-900')}>
        {title}
      </h2>
      {subtitle && (
        <p className={cn('mt-4 text-base md:text-lg max-w-2xl leading-relaxed', align === 'center' && 'mx-auto', light ? 'text-white/75' : 'text-slate-500')}>
          {subtitle}
        </p>
      )}
    </AnimatedSection>
  )
}
