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
  before:bg-gradient-to-br before:from-white/30 before:to-transparent
  before:pointer-events-none
`;

const ButtonSecondary = ({ children, onClick, disabled, className }: { children: React.ReactNode, onClick: () => void, disabled: boolean, className?: string }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`
                ${className || ''}
                ${glassButtonBase}
                text-gray-800
                border border-gray-300/70
                bg-gradient-to-br from-white/85 via-gray-50/80 to-white/75
                shadow-lg shadow-gray-300/45
                hover:from-white/95 hover:via-white/90 hover:to-gray-50/90
                hover:border-gray-400/75
                hover:shadow-xl hover:shadow-gray-300/55
                hover:text-gray-900
                active:translate-y-0.5 active:shadow-lg active:shadow-gray-300/45
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg
            `}
        >
            <span className="relative z-10">{children}</span>
        </button>
    );
};

export default ButtonSecondary;
