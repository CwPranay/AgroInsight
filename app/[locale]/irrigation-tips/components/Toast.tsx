"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, AlertCircle, CheckCircle, Info } from "lucide-react"

interface ToastProps {
    message: string
    type?: "success" | "error" | "info"
    onClose: () => void
}

export function Toast({ message, type = "info", onClose }: ToastProps) {
    const icons = {
        success: <CheckCircle className="w-5 h-5" />,
        error: <AlertCircle className="w-5 h-5" />,
        info: <Info className="w-5 h-5" />
    }

    const colors = {
        success: "from-green-500 to-emerald-500",
        error: "from-red-500 to-rose-500",
        info: "from-blue-500 to-cyan-500"
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                className="fixed top-4 right-4 z-50 max-w-md"
            >
                <div className={`bg-gradient-to-r ${colors[type]} text-white rounded-xl shadow-2xl p-4 flex items-start gap-3`}>
                    <div className="flex-shrink-0 mt-0.5">
                        {icons[type]}
                    </div>
                    <p className="flex-1 text-sm font-medium leading-relaxed">
                        {message}
                    </p>
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 hover:bg-white/20 rounded-lg p-1 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
