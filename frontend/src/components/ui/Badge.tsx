import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  variant?: 'primary' | 'teal' | 'green' | 'amber' | 'red' | 'gray'
  className?: string
}

const variants = {
  primary: 'bg-primary-100 text-primary-800',
  teal:    'bg-teal-100 text-teal-700',
  green:   'bg-emerald-100 text-emerald-700',
  amber:   'bg-amber-100 text-amber-700',
  red:     'bg-red-100 text-red-700',
  gray:    'bg-gray-100 text-gray-600',
}

export default function Badge({ children, variant = 'primary', className }: Props) {
  return (
    <span className={cn('badge', variants[variant], className)}>
      {children}
    </span>
  )
}
