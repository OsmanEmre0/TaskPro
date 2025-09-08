import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function CustomSelect({ options, value, onChange, placeholder, disabled, className }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = useMemo(() => options.find(o => o.value === value), [options, value]);

  useEffect(() => {
    if (!open || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const update = () => {
      const r = buttonRef.current!.getBoundingClientRect();
      setPosition({ top: r.bottom + 6 + window.scrollY, left: r.left + window.scrollX, width: r.width });
    };
    setPosition({ top: rect.bottom + 6 + window.scrollY, left: rect.left + window.scrollX, width: rect.width });
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target) && buttonRef.current && !buttonRef.current.contains(target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(o => !o);
    }
  };

  return (
    <>
      <button
        type="button"
        ref={buttonRef}
        disabled={disabled}
        onClick={() => setOpen(o => !o)}
        onKeyDown={handleKeyDown}
        className={`relative w-full appearance-none border border-gray-200 rounded-xl h-11 pl-4 pr-10 text-sm bg-white text-gray-700 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''} ${className || ''}`}
      >
        <span className="truncate">{selected ? selected.label : (placeholder || 'Seçiniz')}</span>
        <ChevronDown className={`absolute right-3 h-4 w-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-[100000000] pointer-events-none">
          <div
            ref={dropdownRef}
            className="absolute pointer-events-auto bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
            style={{ top: position.top, left: position.left, width: position.width }}
          >
            <ul className="max-h-72 overflow-auto py-1">
              {options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <li key={opt.value}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(opt.value);
                        setOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-violet-50 ${isSelected ? 'bg-violet-50 text-violet-700' : 'text-gray-700'}`}
                    >
                      <Check className={`h-4 w-4 ${isSelected ? 'opacity-100 text-violet-600' : 'opacity-0'}`} />
                      <span className="truncate">{opt.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}


