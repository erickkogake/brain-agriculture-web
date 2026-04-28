'use client'

import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export function Button({
  variant = 'primary', size = 'md', loading, children, className, disabled, ...props
}: ButtonProps) {
  const variants = {
    primary:   'bg-meadow-600 text-white hover:bg-meadow-700 border-transparent shadow-sm',
    secondary: 'bg-white text-stone-700 hover:bg-stone-50 border-stone-200 shadow-sm',
    ghost:     'bg-transparent text-stone-600 hover:bg-stone-100 border-transparent',
    danger:    'bg-red-600 text-white hover:bg-red-700 border-transparent shadow-sm',
  }
  const sizes = {
    sm: 'h-8  px-3   text-xs  gap-1.5',
    md: 'h-9  px-4   text-sm  gap-2',
    lg: 'h-11 px-5   text-sm  gap-2',
  }
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-lg border transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-meadow-500 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant], sizes[size], className,
      )}
      {...props}
    >
      {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      {children}
    </button>
  )
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-')
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-stone-600 uppercase tracking-wide">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full h-9 px-3 rounded-lg border text-sm bg-white text-stone-900 placeholder-stone-400 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-meadow-500 focus:border-transparent',
            error ? 'border-red-400 bg-red-50/30' : 'border-stone-200 hover:border-stone-300',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
        {hint && !error && <p className="text-xs text-stone-400">{hint}</p>}
      </div>
    )
  },
)
Input.displayName = 'Input'

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, options, placeholder, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-')
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-stone-600 uppercase tracking-wide">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={cn(
            'w-full h-9 px-3 rounded-lg border text-sm bg-white text-stone-900 transition-colors appearance-none cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-meadow-500 focus:border-transparent',
            error ? 'border-red-400' : 'border-stone-200 hover:border-stone-300',
            className,
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    )
  },
)
SelectField.displayName = 'SelectField'

interface BadgeProps {
  variant?: 'green' | 'amber' | 'stone' | 'soil' | 'red' | 'blue'
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = 'stone', children, className }: BadgeProps) {
  const variants = {
    green: 'bg-meadow-100 text-meadow-700 border-meadow-200',
    amber: 'bg-harvest-100 text-harvest-700 border-harvest-200',
    stone: 'bg-stone-100 text-stone-600 border-stone-200',
    soil:  'bg-soil-100  text-soil-700  border-soil-200',
    red:   'bg-red-100   text-red-700   border-red-200',
    blue:  'bg-blue-100  text-blue-700  border-blue-200',
  }
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border', variants[variant], className)}>
      {children}
    </span>
  )
}

export function Card({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={cn('bg-white rounded-xl border border-stone-200/80 shadow-sm', className)} style={style}>
      {children}
    </div>
  )
}

interface ModalProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function Modal({ open, onOpenChange, title, description, children, className }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 data-[state=open]:animate-fade-in" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-[40%] -translate-x-1/2 -translate-y-[40%] z-50',
            'bg-white rounded-2xl shadow-2xl border border-stone-200/60 w-full max-w-lg max-h-[90vh] overflow-y-auto',
            'data-[state=open]:animate-fade-up',
            className,
          )}
        >
          <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-stone-100">
            <div>
              <Dialog.Title className="font-display text-lg font-semibold text-stone-900">{title}</Dialog.Title>
              {description && <Dialog.Description className="text-sm text-stone-500 mt-0.5">{description}</Dialog.Description>}
            </div>
            <Dialog.Close asChild>
              <button className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors mt-0.5">
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>
          <div className="px-6 py-5">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

interface ConfirmProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  title: string
  description: string
  onConfirm: () => void
  loading?: boolean
}

export function Confirm({ open, onOpenChange, title, description, onConfirm, loading }: ConfirmProps) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl border border-stone-200/60 w-full max-w-md p-6">
          <AlertDialog.Title className="font-display text-base font-semibold text-stone-900">
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description className="text-sm text-stone-500 mt-2">
            {description}
          </AlertDialog.Description>
          <div className="flex justify-end gap-3 mt-6">
            <AlertDialog.Cancel asChild>
              <Button variant="secondary" size="sm">Cancelar</Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button variant="danger" size="sm" loading={loading} onClick={onConfirm}>
                Confirmar exclusão
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-lg bg-stone-200/80 animate-pulse', className)} />
  )
}

interface EmptyProps {
  icon: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
}

export function Empty({ icon, title, description, action }: EmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center mb-4 text-stone-400">
        {icon}
      </div>
      <p className="font-display text-base font-semibold text-stone-700">{title}</p>
      <p className="text-sm text-stone-400 mt-1 max-w-xs">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-8">
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-semibold text-stone-900">{title}</h1>
        {description && <p className="text-sm text-stone-500 mt-1">{description}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}