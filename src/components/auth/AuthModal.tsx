import React, { useState } from 'react';
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

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={cn(
        "relative w-full max-w-md transform transition-all",
        className
      )}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 z-10 p-2 rounded-full bg-card/90 border border-border/20 hover:bg-card transition-colors"
        >
          <X className="w-4 h-4 text-foreground" />
        </button>
        
        <AuthForm 
          mode={mode} 
          onToggleMode={toggleMode}
          onClose={onClose}
        />
      </div>
    </div>
  );
};