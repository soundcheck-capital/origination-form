import React from 'react';

const StepTitle = ({ title }: { title: string }) => {
    return (
        <div className="my-4 text-left">
            <h2 className="
                text-base
                font-semibold
                tracking-wide
                text-gray-600
            ">
                {title}
            </h2>
        </div>
    );
};

export default StepTitle;