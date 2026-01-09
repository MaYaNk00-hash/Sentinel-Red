import { useCallback } from 'react'

export interface Toast {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

let toasts: Toast[] = []
let listeners: Set<() => void> = new Set()

function notify() {
  listeners.forEach((listener) => listener())
}

export function toastFn({ title, description, variant }: Omit<Toast, 'id'>) {
  const id = Math.random().toString(36).substring(7)
  const newToast: Toast = { id, title, description, variant }
  toasts = [...toasts, newToast]
  notify()

  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id)
    notify()
  }, 5000)

  return id
}

export function useToast() {
  return useCallback((props: Omit<Toast, 'id'>) => toastFn(props), [])
}

export function getToasts() {
  return toasts
}

export function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
