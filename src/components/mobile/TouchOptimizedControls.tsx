// Touch Optimized Controls
// Large touch targets and gesture-friendly components for mobile devices

import React, { useState, useCallback } from 'react';
import { Plus, Minus, Check, X, MoreHorizontal } from 'lucide-react';

interface TouchSliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  label: string;
  onChange: (value: number) => void;
  color?: 'green' | 'blue' | 'red' | 'orange';
}

export const TouchSlider: React.FC<TouchSliderProps> = ({
  value,
  min,
  max,
  step = 1,
  label,
  onChange,
  color = 'green'
}) => {
  const percentage = ((value - min) / (max - min)) * 100;
  
  const colorClasses = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    orange: 'bg-orange-500'
  };

  const handleDecrease = useCallback(() => {
    if (value > min) {
      onChange(Math.max(min, value - step));
    }
  }, [value, min, step, onChange]);

  const handleIncrease = useCallback(() => {
    if (value < max) {
      onChange(Math.min(max, value + step));
    }
  }, [value, max, step, onChange]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-lg font-semibold text-gray-900">{value}</span>
      </div>
      
      <div className="flex items-center space-x-3">
        {/* Decrease Button */}
        <button
          onClick={handleDecrease}
          disabled={value <= min}
          className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 active:bg-gray-400 transition-colors"
        >
          <Minus className="h-5 w-5 text-gray-700" />
        </button>

        {/* Slider Track */}
        <div className="flex-1 relative">
          <div className="w-full h-6 bg-gray-200 rounded-full">
            <div 
              className={`h-6 ${colorClasses[color]} rounded-full transition-all duration-200`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          
          {/* Value Indicator */}
          <div 
            className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white border-2 border-gray-300 rounded-full shadow-sm"
            style={{ left: `calc(${percentage}% - 8px)` }}
          />
        </div>

        {/* Increase Button */}
        <button
          onClick={handleIncrease}
          disabled={value >= max}
          className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 active:bg-gray-400 transition-colors"
        >
          <Plus className="h-5 w-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
};

interface TouchButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
}

export const TouchButton: React.FC<TouchButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 transform transition-transform';
  
  const variantClasses = {
    primary: 'bg-tcm-accent text-white hover:bg-tcm-accent-dark focus:ring-tcm-accent',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    warning: 'bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm min-h-[40px]',
    md: 'px-6 py-3 text-base min-h-[48px]',
    lg: 'px-8 py-4 text-lg min-h-[56px]'
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${widthClass}
        ${disabledClass}
      `}
    >
      {children}
    </button>
  );
};

interface TouchCardProps {
  children: React.ReactNode;
  onTap?: () => void;
  selected?: boolean;
  className?: string;
}

export const TouchCard: React.FC<TouchCardProps> = ({
  children,
  onTap,
  selected = false,
  className = ''
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleTouchStart = () => setIsPressed(true);
  const handleTouchEnd = () => setIsPressed(false);

  return (
    <div
      onClick={onTap}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      className={`
        bg-white rounded-lg border transition-all duration-150 min-h-[60px]
        ${selected ? 'border-tcm-accent bg-tcm-light' : 'border-gray-200'}
        ${onTap ? 'cursor-pointer hover:shadow-md active:shadow-sm' : ''}
        ${isPressed ? 'transform scale-98' : 'transform scale-100'}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

interface TouchToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  label: string;
  description?: string;
}

export const TouchToggle: React.FC<TouchToggleProps> = ({
  enabled,
  onToggle,
  label,
  description
}) => {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <h4 className="text-base font-medium text-gray-900">{label}</h4>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      
      <button
        onClick={() => onToggle(!enabled)}
        className={`
          relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-tcm-accent focus:ring-offset-2
          ${enabled ? 'bg-tcm-accent' : 'bg-gray-300'}
        `}
      >
        <span
          className={`
            inline-block h-6 w-6 transform rounded-full bg-white transition-transform
            ${enabled ? 'translate-x-7' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
};

interface TouchSelectProps {
  options: Array<{ value: string; label: string; icon?: React.ComponentType<any> }>;
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
}

export const TouchSelect: React.FC<TouchSelectProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select option...'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      {/* Selected Value Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-tcm-accent min-h-[48px]"
      >
        <div className="flex items-center">
          {selectedOption?.icon && (
            <selectedOption.icon className="h-5 w-5 mr-3 text-gray-500" />
          )}
          <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
            {selectedOption?.label || placeholder}
          </span>
        </div>
        <MoreHorizontal className="h-5 w-5 text-gray-400" />
      </button>

      {/* Options Dropdown */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
            {options.map((option) => {
              const Icon = option.icon;
              const isSelected = option.value === value;
              
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors min-h-[48px]
                    ${isSelected ? 'bg-tcm-light text-tcm-accent' : 'text-gray-900'}
                  `}
                >
                  {Icon && (
                    <Icon className={`h-5 w-5 mr-3 ${isSelected ? 'text-tcm-accent' : 'text-gray-500'}`} />
                  )}
                  <span className="flex-1">{option.label}</span>
                  {isSelected && (
                    <Check className="h-5 w-5 text-tcm-accent" />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

// Swipe gesture hook for mobile interactions
export const useSwipeGesture = (
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  threshold: number = 50
) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > threshold;
    const isRightSwipe = distance < -threshold;

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft();
    }
    
    if (isRightSwipe && onSwipeRight) {
      onSwipeRight();
    }
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };
};
