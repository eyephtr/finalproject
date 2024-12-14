'use client'

import { useState, useEffect } from 'react'
import PetForm from './PetForm'
import PetCard from './PetCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PawPrint, Heart, Info, Star, Lightbulb } from 'lucide-react'
import { Plus } from 'lucide-react'

interface Pet {
    id: number
    name: string
    type: string
    breed: string
    birthDate: string
    color: string
    weight: number
    image: string
    audio?: string
    isInHeaven: boolean
}

const whyPetDiary = [
    {
        icon: <Heart className="w-6 h-6 text-pink-500" />,
        title: "Cherish Memories",
        desc: "Keep photos and lovely stories of your four-legged friends forever"
    },
    {
        icon: <PawPrint className="w-6 h-6 text-amber-600" />,
        title: "Track Development",
        desc: "Monitor the growth, health, and behavior of your pets continuously"
    },
    {
        icon: <Star className="w-6 h-6 text-yellow-500" />,
        title: "Share Joy",
        desc: "Share special moments with family and friends"
    }
]

const petTips = [
    {
        title: "Health Care",
        items: [
            "Regular health check-ups and vaccinations",
            "Exercise daily for at least 30 minutes",
            "Maintain regular dental and grooming care"
        ]
    },
    {
        title: "Nutrition",
        items: [
            "Provide food suitable for age and breed",
            "Control appropriate portion sizes",
            "Ensure clean water is always available"
        ]
    }
]

export default function PetDiary() {
    const [pets, setPets] = useState<Pet[]>([])
    const [showForm, setShowForm] = useState(false)
    const [showTips, setShowTips] = useState(false)

    const addPet = (pet: Omit<Pet, 'id' | 'isInHeaven'>) => {
        setPets([...pets, { ...pet, id: Date.now(), isInHeaven: false }])
        setShowForm(false)
    }

    const updatePetHeaven = (id: number) => {
        setPets(pets.map(pet => pet.id === id ? { ...pet, isInHeaven: true } : pet))
    }

    const updatePet = (updatedPet: Pet) => {
        setPets(pets.map(pet => pet.id === updatedPet.id ? updatedPet : pet))
    }

    useEffect(() => {
        const timer = setTimeout(() => setShowTips(true), 1000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12 animate-fade-in">
                    <div className="flex flex-col items-center justify-center mb-2">
                        <PawPrint className="w-8 h-8 text-[#543A14] animate-bounce mb-2" />
                        <h1 className="text-4xl font-bold text-[#543A14]">Pet Diary</h1>
                    </div>
                    <p className="text-[#543A14]/80 mt-2">Record precious memories with our beloved companions</p>
                </div>

                {/* Add Pet Button */}
                <div className="flex justify-center mb-8">
                    {!showForm && (
                        <div className="relative group">
                            <Button
                                onClick={() => setShowForm(true)}
                                className="bg-[#F0BB78] text-[#543A14] hover:bg-[#FADA7A] 
                  transform transition-all duration-300 
                  px-8 py-6 
                  text-lg 
                  rounded-full 
                  shadow-xl 
                  hover:scale-110 
                  flex items-center gap-3 
                  group-hover:shadow-2xl 
                  group-hover:bg-[#FADA7A]"
                            >
                                <Plus className="w-6 h-6 -ml-1 group-hover:rotate-180 transition-transform duration-300" />
                                <span className="font-bold">Add New Pet Member</span>
                            </Button>
                            <div className="absolute inset-0 bg-[#F0BB78]/20 rounded-full animate-ping opacity-0 group-hover:opacity-100 -z-10"></div>
                        </div>
                    )}
                </div>

                {/* Pet Form */}
                {showForm && (
                    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg animate-fade-in">
                        <PetForm onAddPet={addPet} onCancel={() => setShowForm(false)} />
                    </div>
                )}

                {/* Why Pet Diary Section */}
                <div className="grid md:grid-cols-3 gap-6 mb-12 mt-20">
                    {whyPetDiary.map((item, index) => (
                        <Card key={index} className="bg-white/80 backdrop-blur transition-all duration-300 hover:scale-105">
                            <CardContent className="p-6 flex flex-col items-center text-center">
                                <div className="mb-4 transform transition-transform duration-300 hover:rotate-12">
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-[#543A14] mb-2">{item.title}</h3>
                                <p className="text-[#543A14]/70">{item.desc}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Pet Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                    {pets.map(pet => (
                        <div key={pet.id} className="transform transition-all duration-300 hover:scale-105">
                            <PetCard
                                pet={pet}
                                onUpdateHeaven={updatePetHeaven}
                                onUpdatePet={updatePet}
                            />
                        </div>
                    ))}
                </div>

                {/* Pet Care Tips */}
                {showTips && (
                    <div className="mt-16 animate-fade-in">
                        <div className="flex items-center justify-center gap-2 mb-8">
                            <Lightbulb className="w-6 h-6 text-[#543A14]" />
                            <h2 className="text-2xl font-semibold text-[#543A14]">Pet Care Tips</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {petTips.map((section, index) => (
                                <Card key={index} className="bg-white/80 backdrop-blur">
                                    <CardContent className="p-6">
                                        <h3 className="text-xl font-semibold text-[#543A14] mb-4">{section.title}</h3>
                                        <ul className="space-y-2">
                                            {section.items.map((tip, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <span className="text-[#F0BB78] mt-1">•</span>
                                                    <span className="text-[#543A14]">{tip}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
        </div>
    )
}