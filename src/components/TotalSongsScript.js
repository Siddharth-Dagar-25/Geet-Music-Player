import React, { useState, useEffect, useMemo } from 'react';
import { songsData } from '../constants/data.js';

const TotalSongsScript = () => {
    const skills = useMemo(() => [
        `Geet now boasts a vibrant collection of ${songsData.length} songs.`,
        "Discover diverse tunes for every mood."
    ], []); // Dependency array is empty, indicating it only runs once on mount

    const [currentSkill, setCurrentSkill] = useState('');
    const [index, setIndex] = useState(0); // Current skill index
    const [subIndex, setSubIndex] = useState(0); // Index of the current character in the skill string
    const [reverse, setReverse] = useState(false); // Direction of typing

    useEffect(() => {
        if (index >= skills.length) {
            setIndex(0);
        }

        const skill = skills[index % skills.length];

        if (subIndex === skill.length + 1 && !reverse) {
            setTimeout(() => setReverse(true), 1000);
            return;
        }

        if (subIndex === 0 && reverse) {
            setReverse(false);
            setIndex((prevIndex) => (prevIndex + 1) % skills.length);
            return;
        }

        const timeout = setTimeout(() => {
            setCurrentSkill(skill.substring(0, subIndex));
            setSubIndex((prevSubIndex) => prevSubIndex + (reverse ? -1 : 1));
        }, reverse ? 60 : 100);

        return () => clearTimeout(timeout);
    }, [subIndex, index, reverse, skills]);

    return (
        <div id="skills" className="text-lg font-semibold text-[#ff9e24]">
            <span className="role">{currentSkill}</span>
        </div>
    );
};

export default TotalSongsScript;
