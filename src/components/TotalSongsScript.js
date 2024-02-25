import React, { useState, useEffect } from 'react';
import { songsData } from '../constants/data.js';

const TotalSongsScript = () => {
    const skills = [
        `Geet now boasts a vibrant collection of ${songsData.length} songs.`,
        "Discover diverse tunes for every mood."
    ];
    const [currentSkill, setCurrentSkill] = useState('');
    const [index, setIndex] = useState(0); // Current skill index
    const [subIndex, setSubIndex] = useState(0); // Index of the current character in the skill string
    const [reverse, setReverse] = useState(false); // Direction of typing

    useEffect(() => {
        if (index >= skills.length) {
            // Reset to the first skill when reaching the end
            setIndex(0);
        }

        const skill = skills[index % skills.length]; // Use modulo to loop back to 0

        if (subIndex === skill.length + 1 && !reverse) {
            // Once the full skill is typed out, pause then start deleting
            setTimeout(() => setReverse(true), 1000); // Pause at the end before deleting
            return;
        }

        if (subIndex === 0 && reverse) {
            // Once the skill is fully deleted, move to the next skill
            setReverse(false);
            setIndex((prevIndex) => (prevIndex + 1) % skills.length); // Loop back to the start
            return;
        }

        // Handle the typing effect
        const timeout = setTimeout(() => {
            setCurrentSkill(skill.substring(0, subIndex));
            setSubIndex((prevSubIndex) => prevSubIndex + (reverse ? -1 : 1));
        }, reverse ? 60 : 100); // Speed of typing or deleting

        return () => clearTimeout(timeout);
    }, [subIndex, index, reverse, skills]);

    return (
        <div id="skills" className="text-lg font-semibold text-[#ff9e24] mt-2 sm:mt-8">
            <span className="role">{currentSkill}</span>
        </div>
    );
};

export default TotalSongsScript;
