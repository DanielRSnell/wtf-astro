import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';
import { AuthForm } from './AuthForm';
import { cn } from '@/lib/utils';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
  className?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'signin',
  className 
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [mounted, setMounted] = useState(false);

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
  };

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Update mode when initialMode changes
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  if (!mounted || !isOpen) return null;

  const modalContent = (
    <>
      {/* Backdrop - fixed to viewport with enhanced blur */}
      <div 
        className="fixed inset-0 z-[99998] bg-black/60 backdrop-blur-md animate-in fade-in-0 duration-200"
        onClick={onClose}
        aria-hidden="true"
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      
      {/* Modal Container - fixed to viewport center */}
      <div className="fixed inset-0 z-[99999] pointer-events-none" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className={cn(
            "pointer-events-auto relative w-full max-w-md transform transition-all animate-in fade-in-0 zoom-in-95 duration-200",
            className
          )}>
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute -top-2 -right-2 z-10 p-2 rounded-full bg-card border border-border/30 hover:bg-muted transition-colors shadow-lg"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
            
            {/* Modal Content with glassmorphism */}
            <div className="relative bg-card/95 backdrop-blur-2xl border border-border/30 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <AuthForm 
                mode={mode} 
                onToggleMode={toggleMode}
                onClose={onClose}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Use React Portal to render at document body level
  return ReactDOM.createPortal(
    modalContent,
    document.body
  );
};