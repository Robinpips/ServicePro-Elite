"use client"

import { useState, useEffect, useCallback } from "react"

type ToastType = "success" | "error" | "warning" | "info"

interface ToastProps {
  message: string
  type: ToastType
  duration?: number
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const addToast = useCallback(({ message, type, duration = 3000 }: ToastProps) => {
    const id = Date.now()
    setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }])
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setToasts((prevToasts) => {
        const now = Date.now()
        return prevToasts.filter((toast) => now - toast.id < toast.duration)
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const toast = useCallback(
    (props: Omit<ToastProps, "id">) => {
      addToast(props)
    },
    [addToast],
  )

  return { toast, toasts, removeToast }
}

