import React from 'react';
import styles from './Marquee.module.css';

const DiaryPetMarquee = () => {
    const petEntries = [
        "✴︎ Pet Diary For Your Lovely Friends ✴︎",
        "🦴 MEMORIES + MOMENTS + MILESTONES",
        "✴︎ Pet Diary For Your Lovely Friends ✴︎",
        "🦴 MEMORIES + MOMENTS + MILESTONES",
        "✴︎ Pet Diary For Your Lovely Friends ✴︎"
    ];

    return (
        <div className={styles.marqueeContainer}>
            <div className={styles.marqueeWrapper}>
                {petEntries.map((entry, index) => (
                    <React.Fragment key={index}>
                        <div className={styles.marqueeItem}>{entry}</div>
                        <div aria-hidden="true" className={styles.marqueeItem}>{entry}</div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default DiaryPetMarquee;