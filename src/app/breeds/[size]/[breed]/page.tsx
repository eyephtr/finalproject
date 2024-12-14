'use client'

import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from 'lucide-react'

interface BreedInfo {
    name: string;
    englishName: string;
    about: string;
    age: string;
    color: string;
    exercise: string;
    habit: string;
    health: string;
    height: string;
    weight: string;
    history: string;
    nutrition: string;
    size: string;
    training: string;
    [key: string]: string; // Allow any string key
}

export default function BreedPage() {
    const params = useParams()
    const router = useRouter()
    const size = params.size as string
    const breedId = params.breed as string
    const [breedInfo, setBreedInfo] = useState<BreedInfo | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchBreedInfo = async () => {
            setLoading(true)
            setError(null)
            try {
                const docRef = doc(db, 'breed', breedId)
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    const data = docSnap.data() as BreedInfo
                    console.log('Fetched breed data:', data)
                    setBreedInfo(data)
                } else {
                    setError('Breed information not found')
                }
            } catch (err) {
                console.error('Error fetching breed info:', err)
                setError(`Failed to fetch breed information: ${(err as Error).message}`)
            } finally {
                setLoading(false)
            }
        }

        fetchBreedInfo()
    }, [breedId])

    if (loading) {
        return <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    }

    if (error) {
        return <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
                <p className="text-gray-700">{error}</p>
            </div>
        </div>
    }

    if (!breedInfo) {
        return <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Breed information not available</h1>
            </div>
        </div>
    }

    const renderField = (label: string, field: string) => {
        return breedInfo[field] ? (
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{label}</h3>
                <p className="text-gray-600">{breedInfo[field]}</p>
            </div>
        ) : null;
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Button 
                    variant="outline" 
                    onClick={() => router.push(`/breed/${size}`)}
                    className="mb-4"
                >
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back to {size} breeds
                </Button>
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="relative h-64 sm:h-96">
                        <Image
                            src={`/img/breed/${breedInfo.name.toLowerCase().replace(/\s+/g, '')}.jpg`}
                            alt={breedInfo.name}
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                    <div className="p-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">{breedInfo.name || 'Unknown Breed'}</h1>
                        {breedInfo.englishName && <p className="text-2xl text-gray-600 mb-6">{breedInfo.englishName}</p>}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {breedInfo.about && (
                                <div className="col-span-2">
                                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">About</h2>
                                    <p className="text-gray-600">{breedInfo.about}</p>
                                </div>
                            )}
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Characteristics</h2>
                                {renderField('Size', 'size')}
                                {renderField('Height', 'height')}
                                {renderField('Weight', 'weight')}
                                {renderField('Color', 'color')}
                                {renderField('Life Expectancy', 'age')}
                            </div>
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Care</h2>
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="exercise">
                                        <AccordionTrigger>Exercise Needs</AccordionTrigger>
                                        <AccordionContent>
                                            {breedInfo.exercise}
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="grooming">
                                        <AccordionTrigger>Grooming</AccordionTrigger>
                                        <AccordionContent>
                                            {breedInfo.habit}
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="health">
                                        <AccordionTrigger>Health Concerns</AccordionTrigger>
                                        <AccordionContent>
                                            {breedInfo.health}
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="nutrition">
                                        <AccordionTrigger>Nutrition</AccordionTrigger>
                                        <AccordionContent>
                                            {breedInfo.nutrition}
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="training">
                                        <AccordionTrigger>Training</AccordionTrigger>
                                        <AccordionContent>
                                            {breedInfo.training}
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                            {breedInfo.history && (
                                <div className="col-span-2">
                                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">History</h2>
                                    <p className="text-gray-600">{breedInfo.history}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

