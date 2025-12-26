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
    <input
      id={id}
      name={name}
      type="checkbox"
      role="switch"
      checked={checked}
      onChange={onChange}
      className={`shrink-0 mt-[0.2rem] h-6 w-12 cursor-pointer appearance-none rounded-full 
         relative transition-all duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)]
         backdrop-blur-md border border-white/30
         bg-gradient-to-r from-gray-300/50 via-gray-200/50 to-gray-100/50
         shadow-lg shadow-gray-200/50
         checked:from-blue-200/50 checked:via-purple-100/45 checked:to-rose-200/50
         checked:shadow-lg checked:shadow-blue-200/30 checked:border-white/60
         overflow-visible
         after:absolute after:left-[-2px] after:top-[calc(50%+1px)] after:-translate-y-1/2
         after:h-7 after:w-7 after:rounded-full
         after:bg-white after:backdrop-blur-sm
         after:[box-shadow:0_-2px_4px_-3px_rgba(0,0,0,0.3),0_2px_4px_-2px_rgba(0,0,0,0.1)]
         after:transition-transform after:duration-[380ms] after:ease-[cubic-bezier(0.22,1,0.36,1)]
         checked:after:translate-x-[1.25rem] checked:after:bg-white
         hover:shadow-xl hover:shadow-gray-300/60
         checked:hover:shadow-xl checked:hover:shadow-blue-300/40
         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/30 focus-visible:ring-offset-2
         motion-reduce:transition-none motion-reduce:after:transition-none
         ${className}`}
    />
  );
};

export default Switch;

