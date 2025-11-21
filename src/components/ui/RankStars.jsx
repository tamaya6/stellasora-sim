import React from 'react';
import { Star } from 'lucide-react';

const RankStars = ({ rank, size = 14 }) => {
    return (
        <div className="flex gap-0.5">
            {[...Array(rank)].map((_, i) => (
                <Star key={i} size={size} className="fill-yellow-400 text-yellow-400" />
            ))}
        </div>
    );
};

export default RankStars;