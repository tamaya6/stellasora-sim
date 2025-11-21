import React, { useState } from 'react';

const CharacterIcon = ({ char, size = "md", className = "" }) => {
    const [imgError, setImgError] = useState(false);
    const ElementIcon = char.element.icon;

    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-16 h-16",
        xl: "w-20 h-20" 
    };

    const containerSize = sizeClasses[size] || sizeClasses.md;

    if (!imgError && char.imagePath) {
        return (
            <img 
                src={char.imagePath} 
                alt={char.name} 
                className={`object-cover rounded-lg border-2 border-slate-600 bg-slate-800 ${containerSize} ${className}`}
                onError={() => setImgError(true)}
            />
        );
    }

    return (
        <div className={`flex items-center justify-center rounded-lg bg-gradient-to-br ${char.element.color} shadow-lg ${containerSize} ${className}`}>
            <ElementIcon className="text-white w-[60%] h-[60%]" />
        </div>
    );
};

export default CharacterIcon;