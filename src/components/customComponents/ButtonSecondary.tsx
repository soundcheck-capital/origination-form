import React from 'react';

const ButtonSecondary = ({ children, onClick, disabled }: { children: React.ReactNode, onClick: () => void, disabled: boolean }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="inline-flex cursor-pointer items-center justify-center rounded-full border border-[#dfe3e8] bg-white px-[26px] py-3.5 text-[15px] font-bold text-[#1f2a37] shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-opacity duration-150 hover:border-[#cfd5dd] disabled:cursor-not-allowed disabled:opacity-60"
        >
            {children}
        </button>
    );
};

export default ButtonSecondary;
