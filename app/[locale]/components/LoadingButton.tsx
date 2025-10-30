"use client"

import { ButtonHTMLAttributes, useState } from "react"
import { Loader2 } from "lucide-react"

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  children: React.ReactNode
}

export function LoadingButton({ 
  loading, 
  children, 
  onClick, 
  disabled,
  className = "",
  ...props 
}: LoadingButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      setIsLoading(true)
      try {
        await onClick(e)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const showLoading = loading || isLoading

  return (
    <button
      onClick={handleClick}
      disabled={disabled || showLoading}
      className={`relative ${className} ${showLoading ? 'cursor-wait' : ''}`}
      {...props}
    >
      {showLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-inherit">
          <Loader2 size={18} className="animate-spin" />
        </div>
      )}
      <span className={showLoading ? 'opacity-0' : ''}>
        {children}
      </span>
    </button>
  )
}
