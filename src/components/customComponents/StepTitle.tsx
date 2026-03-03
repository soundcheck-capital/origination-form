import React from 'react';

const StepTitle = ({ title }: { title: string }) => {
    return (
        <div className="my-4 text-left">
            <h2 className="
                text-lg
                font-bold
                tracking-wide
                text-gray-700
            ">
                {title}
            </h2>
        </div>
    );
};

export default StepTitle;