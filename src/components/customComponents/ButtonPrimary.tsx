import React from 'react';

const glassButtonBase = `
  px-6 py-2.5
  min-h-[44px]
  rounded-3xl
  font-bold
  flex items-center justify-center
  relative
  overflow-hidden
  backdrop-blur-md
  transition-[transform,box-shadow,border-color] duration-300 ease-out
  before:absolute before:inset-0 before:rounded-3xl
  before:bg-gradient-to-br before:from-white/20 before:to-transparent
  before:pointer-events-none
`;

const ButtonPrimary = ({ children, onClick, disabled, className }: { children: React.ReactNode, onClick: () => void, disabled: boolean, className?: string }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`
                ${className || ''}
                ${glassButtonBase}
                text-white
                border border-white/50
                bg-gradient-to-br from-rose-500/80 via-rose-600/85 to-amber-500/80
                shadow-lg shadow-rose-400/45
                hover:from-rose-500/85 hover:via-rose-600/90 hover:to-amber-600/85
                hover:shadow-xl hover:shadow-rose-400/55
                hover:border-white/60
                active:translate-y-0.5 active:shadow-lg active:shadow-rose-400/45
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg
            `}
        >
            <span className="relative z-10 drop-shadow-sm">{children}</span>
        </button>
    );
};

export default ButtonPrimary;
