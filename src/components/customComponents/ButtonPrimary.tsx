import React from 'react';

const ButtonPrimary = ({ children, onClick, disabled, className }: { children: React.ReactNode, onClick: () => void, disabled: boolean, className?: string }) => {
    const enabled =
        'cursor-pointer bg-gradient-to-r from-[#f78fa7] to-[#fbbf7a] shadow-[0_8px_22px_rgba(247,143,167,0.4)]';
    const disabledClass =
        'cursor-not-allowed bg-gradient-to-r from-[#f9c3cf] to-[#fcdcae] opacity-85 shadow-none';
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${className || ''} inline-flex items-center justify-center rounded-full border-0 px-11 py-4 text-[17px] font-bold text-white transition-opacity duration-150 ${disabled ? disabledClass : enabled}`}
        >
            {children}
        </button>
    );
};

export default ButtonPrimary;
