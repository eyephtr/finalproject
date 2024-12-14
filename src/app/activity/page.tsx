'use client'

import { useState } from 'react'
import styles from './FortuneStickGame.module.css'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const fortunes = {
    1: "🦮 RUN-RUN-RUN 💨",
    2: "Walking them in different places 🐩",
    3: "Some EXTRA treats! 🍵",
    4: "🐶 Play HIDE and SEEK together (yayyy)",
    5: "Time for new ToYssssssss 🧸",
    6: "🤿 Swimming (boong-boong🫧)",
    7: "🐕‍🦺 Doggy photoshoot 🤳🏼",
    8: "🦴 Teach TRICKS!",
    9: "Doggo playDATES 💋🐾",
    10: "It's time to go to the VET (😿)🩻"
}

const cardData = [
    { text: "Doggo Crossword", buttonText: "Let's Go!", link: "/game/crossword.html", color: "#800000" },
    { text: "Dachshund Snake", buttonText: "Start!", link: "/game/dachshund.html", color: "#F96E2A" },
    { text: "DogSPEEDtest", buttonText: "Ready?", link: "/game/dogspeedtest.html", color: "#ff9e00" },
    { text: "Find the Dog ?", buttonText: "GO!", link: "/game/findthedog.html", color: "#859F3D" },
    { text: "Matching Animals", buttonText: "Game Start!", link: "/game/matching.html", color: "#0A3981" },
    { text: "Whack-a-dog", buttonText: "Time To Hit!", link: "/game/whackadog.html", color: "#227B94" },
    { text: "WOOF Wordle", buttonText: "Let's Guess!", link: "/game/wordle.html", color: "#A64D79" },
    { text: "XOXO", buttonText: "Battle!", link: "/game/xoxo.html", color: "#640D6B" },
]

export default function FortuneStickGame() {
    const [selectedStick, setSelectedStick] = useState<number | null>(null)
    const [showAlert, setShowAlert] = useState(false)
    const [isShaking, setIsShaking] = useState(false)
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
      if (status === 'unauthenticated') {
        alert('You need to be logged in to access this page.')
        router.push('/member/login')
      }
    }, [status, router])

    if (status === 'loading') {
      return <div>Loading...</div>
    }

    if (status === 'unauthenticated') {
      return null
    }

    const handleCaseClick = () => {
        setIsShaking(true)
        setTimeout(() => {
            const randomStick = Math.floor(Math.random() * 10) + 1
            setSelectedStick(randomStick)
            setShowAlert(true)
            setIsShaking(false)
        }, 500) // Shake for 500ms before showing the result
    }

    const closeAlert = () => {
        setShowAlert(false)
    }

    return (
        <div className="container mx-auto px-4">
            <div className={styles.templeContainer}>
                <h1 className={styles.templeTitle}>🦮 RANDOM ACTIVITIES 🐾</h1>

                <div className={styles.fortuneContainer}>
                    <div 
                        id="lotteryCase" 
                        className={`${styles.lotteryCase} ${isShaking ? styles.shake : ''}`} 
                        onClick={handleCaseClick}
                    >
                        {[...Array(10)].map((_, index) => (
                            <div
                                key={index + 1}
                                className={`${styles.lotteryStick} ${selectedStick === index + 1 ? styles.selected : ''}`}
                                data-number={index + 1}
                            >
                                <span>{index + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div id="fortuneResult" className={styles.fortuneResult}>
                    {selectedStick
                        ? `URRR activity isss: ${fortunes[selectedStick as keyof typeof fortunes]}`
                        : "Click to see activities with your good boi/gurl"}
                </div>

                {showAlert && (
                    <div id="customAlert" className={styles.customAlert}>
                        <div className={`${styles.alertBox} ${styles.show}`}>
                            <button className={styles.alertClose} onClick={closeAlert}>×</button>
                            <div id="alertContent">
                                <h2>activity nooo {selectedStick}</h2>
                                <p>{fortunes[selectedStick as keyof typeof fortunes]}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <br />
            <br />
            <h2 className="text-3xl font-bold text-center my-8">Mini Games</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
                {cardData.map((card, index) => (
                    <Card key={index} className="flex flex-col">
                        <CardContent className="flex-grow flex items-center justify-center p-4">
                            <p className="text-center text-lg font-medium">{card.text}</p>
                        </CardContent>
                        <CardFooter className="p-4">
                            <Link href={card.link} target="_blank" rel="noopener noreferrer" className="w-full">
                                <Button className="w-full" style={{ backgroundColor: card.color, borderColor: card.color }}>
                                    {card.buttonText}
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
                <br />
                <br />
            </div>
        </div>
    )
}

