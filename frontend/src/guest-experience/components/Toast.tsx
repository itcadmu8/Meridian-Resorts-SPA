import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  message?: string;
  type?: 'success' | 'info' | 'gold';
}

export type ToastNotification = ToastMessage;

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss?: (id: string) => void;
  onClose?: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss, onClose }) => {
  const dismiss = (id: string) => {
    if (onClose) onClose(id);
    else if (onDismiss) onDismiss(id);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full px-4 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-auto bg-[#0D242E] text-white p-4 rounded-xl shadow-2xl border border-[#C5A880]/40 flex items-start gap-3.5 backdrop-blur-md"
          >
            {toast.type === 'info' ? (
              <Info className="w-5 h-5 text-[#DFCDAA] shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
            )}
            <div className="flex-1 pr-2">
              <p className="font-serif text-base tracking-wide text-[#FBF9F5] font-medium">{toast.title}</p>
              {(toast.description || toast.message) && (
                <p className="text-xs text-[#EFE8DE]/80 mt-1 leading-relaxed font-sans">
                  {toast.description || toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className="text-[#EFE8DE]/60 hover:text-white transition-colors p-1"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export const Toast = ToastContainer;
