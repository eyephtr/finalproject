'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { Notebook, HeartPulse, Camera, Trophy } from 'lucide-react'
import DiaryPetMarquee from '@/components/Marquee'

// Animated Pet Mascot Component
const PetMascot = () => {
    return (
        <div className="flex justify-center items-center mb-5">
        <div className="relative w-64 h-64">
            <svg
                width="700"
                height="700"
                viewBox="0 0 500 500"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0 w-full h-full"
                role="img"
                aria-labelledby="title desc"
            >
                <title id="title">Dog</title>
                <desc id="desc">Animated cartoon of a dog, drawn starting from the word "dog"</desc>
                <style>{`
                    @keyframes draw {
                        0% { stroke-dashoffset: 650; }
                        100% { stroke-dashoffset: 0; }
                    }
                    @keyframes pop {
                        0% { fill: transparent; }
                        100% { fill: #000; }
                    }
                    path { animation: draw 1s 1; animation-fill-mode: forwards; } /* ลดเวลาเหลือ 1s */
                    #ear-1 { animation-delay: 1s; } /* ลด delay */
                    #tail { animation-delay: 2s; }
                    #ear-2 { animation-delay: 3s; }
                    #snout { animation-delay: 3.5s; }
                    #mouth { animation-delay: 4s; }
                    #mouth-1 { animation-delay: 4.25s; }
                    #mouth-2 { animation-delay: 4.5s; }
                    #nose { animation-delay: 5s; }
                    circle { animation: pop 0.5s 1; animation-fill-mode: forwards; } /* ลด pop เหลือ 0.5s */
                    #eye-1 { animation-delay: 6s; }
                    #eye-2 { animation-delay: 5.5s; }
                `}</style>
                <text x="181.5" y="190" fontFamily="Tahoma,Helvetica,Arial,sans-serif" fontSize="150" letterSpacing="-5" fill="#000">dog</text>
                <g fill="transparent">
                    <circle id="eye-1" cx="220" cy="150" r="8" />
                    <circle id="eye-2" cx="300" cy="150" r="8" />
                </g>
                <g fill="none" stroke="#000" strokeWidth="14" strokeDashoffset="650" strokeDasharray="650">
                    <path id="ear-1" d="M 247.5,81 C 247.5,8 121,34 117,114 113,194 62,161 60,229 58,297 210,308 189,214" />
                    <path id="ear-2" d="M 245,59 C 275,23 371,5 365,115" />
                    <path id="snout" d="M 329,126 C 344,116 370,101 407,113" />
                    <path id="mouth" d="M 358,214 C 339,204 303,205 260,219" />
                    <path id="tail" d="M 163,276 C 161,332 82,362 77,498 40,444 18,350 52,296 45,364 71,417 86,434" />
                    <path id="mouth-1" d="M 350,214 C 352,239 335,244 262,247" />
                    <path id="mouth-2" d="M 282,247 C 288,411 328,381 342,501" />
                    <path id="nose" d="M 351,140 385,112 349,158 395,117 353,164 396,130 358,172 399,142 369,176 401,154 386,176" />
                </g>
            </svg>
        </div>
        </div>
    )
}

// Enhanced Feature Card with Hover Effects
const EnhancedFeatureCard = ({
    title,
    description,
    icon: Icon
}: {
    title: string,
    description: string,
    icon: React.ElementType
}) => {
    return (
        <motion.div
            whileHover={{
                scale: 1.05,
                boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)"
            }}
            className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-secondary transition-all"
        >
            <div className="text-5xl mb-4 text-accent">
                <Icon size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-semibold text-primary mb-2">{title}</h3>
            <p className="text-text">{description}</p>
        </motion.div>
    )
}

// Diary Entry Preview Component
const DiaryEntryPreview = () => {
    const [activeEntry, setActiveEntry] = useState(0)
    const entries = [
        {
            date: "Today",
            pet: "Luna (Golden Retriever)",
            content: "Went to the dog park, made new friends! Chased squirrels and played fetch. So tired but happy! 🐾"
        },
        {
            date: "Yesterday",
            pet: "Whiskers (Tabby Cat)",
            content: "Spent most of the day napping in the sunny spot. Had tuna for lunch and got extra cuddles! 😻"
        },
        {
            date: "Last Week",
            pet: "Buddy (Beagle)",
            content: "Vet checkup went great! All vaccinations updated and got a clean bill of health. Good boy! 🩺"
        }
    ]

    return (
        <div className="bg-white/70 backdrop-blur-md rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-primary">Recent Diary Entries</h2>
                <Link href="/diary" className="text-accent hover:text-secondary">View All</Link>
            </div>
            <div className="space-y-4">
                {entries.map((entry, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className={`p-4 rounded-lg ${activeEntry === index
                                ? 'bg-highlight/20 border-highlight border'
                                : 'bg-gray-50'
                            } cursor-pointer`}
                        onClick={() => setActiveEntry(index)}
                    >
                        <div className="flex justify-between">
                            <h3 className="font-semibold text-primary">{entry.pet}</h3>
                            <span className="text-text text-sm">{entry.date}</span>
                        </div>
                        <p className="text-text mt-2">{entry.content}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-secondary to-primary relative overflow-hidden">
            <DiaryPetMarquee />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                        

                        <PetMascot />
                    <h1 className="text-5xl font-extrabold text-background sm:text-6xl md:text-7xl mb-4 drop-shadow-sm">
                        PetPet Diary
                    </h1>
                    <p className="mt-3 max-w-2xl mx-auto text-xl text-background sm:mt-5 md:mt-5">
                        Capture every wag, purr, and precious moment of your furry friend's life journey.
                    </p>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid md:grid-cols-2 gap-12 mb-16">
                    {/* Left Side: Mascot & Diary Preview */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex flex-col items-center"
                    >
                        <DiaryEntryPreview />
                    </motion.div>

                    {/* Right Side: Features */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="grid gap-6 md:grid-cols-2"
                    >
                        <EnhancedFeatureCard
                            title="Daily Log"
                            description="Record your pet's daily adventures and memories."
                            icon={Notebook}
                        />
                        <EnhancedFeatureCard
                            title="Health Tracker"
                            description="Monitor vaccinations, check-ups, and wellness."
                            icon={HeartPulse}
                        />
                        <EnhancedFeatureCard
                            title="Memory Wall"
                            description="Collect and showcase your pet's best moments."
                            icon={Camera}
                        />
                        <EnhancedFeatureCard
                            title="Achievement Board"
                            description="Celebrate your pet's milestones and growth."
                            icon={Trophy}
                        />
                    </motion.div>
                </div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-center"
                >
                    <h2 className="text-3xl font-bold text-background mb-4">Start Your Pet's Digital Memory Book</h2>
                    <p className="text-xl text-background mb-8 max-w-2xl mx-auto">
                        Join thousands of pet lovers in creating a beautiful, lasting record of your furry companion's life.
                    </p>
                    <Link
                        href="/signup"
                        className="bg-accent text-background px-10 py-4 rounded-full text-lg font-semibold 
            hover:bg-highlight transition duration-300 shadow-lg hover:shadow-xl"
                    >
                        Begin Your Journey
                    </Link>
                </motion.div>
            </div>
        </div>
    )
}

