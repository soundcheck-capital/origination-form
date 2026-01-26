import React from 'react';

interface SwitchProps {
  id: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const Switch: React.FC<SwitchProps> = ({ id, name, checked, onChange, className = '' }) => {
  return (
    <div className="relative inline-block">
      {/* Switch avec labels intégrés */}
      <input
        id={id}
        name={name}
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={onChange}
        className={`shrink-0 h-6 w-16 cursor-pointer appearance-none rounded-full 
           relative transition-all duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)]
           backdrop-blur-md border border-white/30
           bg-gradient-to-r from-gray-300/50 via-gray-200/50 to-gray-100/50
           shadow-lg shadow-gray-200/50
           checked:from-blue-200/50 checked:via-purple-100/45 checked:to-rose-200/50
           checked:shadow-lg checked:shadow-blue-200/30 checked:border-white/60
           overflow-visible
           after:absolute after:left-[-4px] after:top-1/2 after:-translate-y-1/2
           after:h-7 after:w-7 after:rounded-full
           after:bg-white after:backdrop-blur-sm
           after:[box-shadow:0_-3px_6px_-2px_rgba(0,0,0,0.4),0_3px_6px_-1px_rgba(0,0,0,0.2)]
           after:transition-transform after:duration-[380ms] after:ease-[cubic-bezier(0.22,1,0.36,1)]
           after:z-10
           checked:after:translate-x-[2.5rem] checked:after:bg-white
           hover:shadow-xl hover:shadow-gray-300/60
           checked:hover:shadow-xl checked:hover:shadow-blue-300/40
           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/30 focus-visible:ring-offset-2
           motion-reduce:transition-none motion-reduce:after:transition-none
           ${className}`}
      />
      
      {/* Label "No" à droite dans le switch - affiché seulement si toggle est à gauche (non activé) */}
      {!checked && (
        <label
          className="absolute right-3 inset-y-3 -translate-y-1/2 flex items-center text-xs font-semibold text-gray-400 cursor-pointer pointer-events-none z-0"
          htmlFor={id}
        >
          No
        </label>
      )}

      {/* Label "Yes" à gauche dans le switch - affiché seulement si toggle est à droite (activé) */}
      {checked && (
        <label
          className="absolute left-3 inset-y-3 -translate-y-1/2 flex items-center text-xs font-semibold text-gray-400 cursor-pointer pointer-events-none z-0"
          htmlFor={id}
        >
          Yes
        </label>
      )}
    </div>
  );
};

export default Switch;

