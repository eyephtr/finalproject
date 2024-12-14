'use client'

import React, { useState, useEffect } from "react";
import { CalendarIcon, ChevronUpDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PetNameDisplay from '@/components/PetNameDisplay';
import Cat404 from '@/components/404/cat404';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const FoodCalculator = () => {
    const [isCatSelected, setIsCatSelected] = useState(false);
    const [formVisible, setFormVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        gender: "",
        breed: "",
        dob: "",
        weight: "",
        activityLevel: "1",
        desexed: "yes",
        bodyCondition: "5",
        foodCalories: ""
    });
    const [solution, setSolution] = useState(null);

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

    const handleCatClick = () => {
        setIsCatSelected(true);
        setFormVisible(false);
        setErrorMessage("Sorry, we don't support cats yet!");
    };

    const handleDogClick = () => {
        setIsCatSelected(false);
        setFormVisible(true);
        setErrorMessage("");
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleGenderSelect = (gender) => {
        setFormData(prev => ({
            ...prev,
            gender
        }));
    };

    const calculateAge = (dob) => {
        const dobDate = new Date(dob);
        const currentDate = new Date();
        const diffTime = Math.abs(currentDate - dobDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const years = Math.floor(diffDays / 365);
        const months = Math.floor((diffDays % 365) / 30);
        const days = (diffDays % 365) % 30;
        return { years, months, days };
    };

    const [breeds, setBreeds] = useState<string[]>([]);

    useEffect(() => {
        const fetchBreeds = async () => {
            const breedsCollection = collection(db, 'breed');
            const breedsSnapshot = await getDocs(breedsCollection);
            const breedsList = breedsSnapshot.docs.map(doc => doc.id);
            setBreeds(breedsList);
        };

        fetchBreeds();
    }, []);

    const handleCalculate = () => {
        const {
            name,
            gender,
            breed,
            dob,
            weight: weightStr,
            bodyCondition: bodyConditionStr,
            activityLevel,
            desexed,
            foodCalories: foodCaloriesStr
        } = formData;

        const weight = parseFloat(weightStr);
        const bodyCondition = parseFloat(bodyConditionStr);
        const foodCalories = parseFloat(foodCaloriesStr);

        if (!name || !dob || isNaN(weight) || isNaN(bodyCondition) || isNaN(foodCalories)) {
            alert("Please ensure all fields are filled out correctly.");
            return;
        }

        const age = calculateAge(dob);
        const conditionAdjustment = (bodyCondition - 5) * 10;
        const idealWeight = weight * (100 - conditionAdjustment) / 100;
        const percentOver = ((weight / idealWeight) * 100) - 100;
        const rer = 70 * Math.pow(weight, 0.75);

        let factor;
        switch (activityLevel) {
            case "0": factor = 1.2; break;
            case "1": factor = 1.6; break;
            case "2": factor = 2.0; break;
            case "3": factor = 2.5; break;
            default: factor = 1.6; break;
        }

        const caloricNeeds = rer * factor;
        const foodPerGramCal = foodCalories / 100;
        const dailyFoodAmount = caloricNeeds / foodPerGramCal;

        setSolution({
            name,
            dob,
            age,
            gender,
            breed,
            weight,
            bodyCondition,
            activityLevel,
            desexed,
            foodCalories,
            idealWeight,
            percentOver,
            caloricNeeds,
            dailyFoodAmount
        });

        // Open the modal
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="bg-[#fff4d1] min-h-screen">
        <div className="container mx-auto p-6 max-w-4xl">
            <h1 className="text-4xl font-bold text-center mb-4 text-primary">
                Pet Food Calculator
            </h1>
            <h3 className="text-center mb-8 text-muted-foreground">
                Calculate the daily energy needs of your dog or cat easily!
            </h3>

            <div className="flex justify-center gap-4 mb-8">
                <Button
                    variant={isCatSelected ? "default" : "outline"}
                    onClick={handleCatClick}
                >
                    Cat
                </Button>
                <Button
                    variant={!isCatSelected ? "default" : "outline"}
                    onClick={handleDogClick}
                >
                    Dog
                </Button>
            </div>

            {errorMessage && isCatSelected && (
                <Cat404 onGoBack={() => {
                    setIsCatSelected(false);
                    setErrorMessage("");
                }} />
            )}

            {errorMessage && !isCatSelected && (
                <Card className="bg-white mb-8">
                    <CardContent className="text-center text-destructive pt-6">
                        <div className="text-6xl font-bold">404</div>
                        <div className="text-xl">{errorMessage}</div>
                    </CardContent>
                </Card>
            )}

            {formVisible && (
                <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
                    <Card className="bg-white">
                        <CardHeader>
                            <CardTitle>Lifestage</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-4 mb-4">
                                <Button
                                    type="button"
                                    variant={formData.gender === 'male' ? "default" : "outline"}
                                    className="flex-1"
                                    onClick={() => handleGenderSelect('male')}
                                >
                                    His name is
                                </Button>
                                <Button
                                    type="button"
                                    variant={formData.gender === 'female' ? "default" : "outline"}
                                    className="flex-1"
                                    onClick={() => handleGenderSelect('female')}
                                >
                                    Her name is
                                </Button>
                            </div>

                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-muted-foreground">Your dog's name:</label>
                                <Input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter your pet's name"
                                />
                            </div>

                            <div>
                                <label htmlFor="breed" className="block text-sm font-medium text-muted-foreground">Breed:</label>
                                <div className="relative">
                                    <Input
                                        list="breeds"
                                        id="breed"
                                        value={formData.breed}
                                        onChange={handleInputChange}
                                        placeholder="Type to search..."
                                        required
                                    />
                                    <ChevronUpDownIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                </div>
                                <datalist id="breeds">
                                    {breeds.map((breed, index) => (
                                        <option key={index} value={breed} />
                                    ))}
                                </datalist>
                            </div>

                            <div>
                                <label htmlFor="dob" className="block text-sm font-medium text-muted-foreground">Date of Birth:</label>
                                <div className="relative">
                                    <Input
                                        type="date"
                                        id="dob"
                                        value={formData.dob}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="weight" className="block text-sm font-medium text-muted-foreground">Weight (kg):</label>
                                <Input
                                    type="text"
                                    id="weight"
                                    value={formData.weight}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                            handleInputChange(e);
                                        }
                                    }}
                                    pattern="^\d*\.?\d*$"
                                    placeholder="Enter weight in kg"
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white">
                        <CardHeader>
                            <CardTitle>Lifestyle</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label htmlFor="activityLevel" className="block text-sm font-medium text-muted-foreground">Activity Level:</label>
                                <Select
                                    value={formData.activityLevel}
                                    onValueChange={(value) => handleInputChange({ target: { id: 'activityLevel', value } })}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select activity level" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white shadow-md rounded-md z-10">
                                        <SelectItem value="0" className="hover:bg-gray-100">Less active (&lt; 1hr/day)</SelectItem>
                                        <SelectItem value="1" className="hover:bg-gray-100">Average activity (1-1.5hr/day)</SelectItem>
                                        <SelectItem value="2" className="hover:bg-gray-100">More active (1.5-2hr/day)</SelectItem>
                                        <SelectItem value="3" className="hover:bg-gray-100">Highly active/working (&gt;2hr/day)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label htmlFor="desexed" className="block text-sm font-medium text-muted-foreground">Is your dog desexed?</label>
                                <Select
                                    value={formData.desexed}
                                    onValueChange={(value) => handleInputChange({ target: { id: 'desexed', value } })}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select desexed status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="yes">Yes</SelectItem>
                                        <SelectItem value="no">No</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label htmlFor="bodyCondition" className="block text-sm font-medium text-muted-foreground">Body Condition Score (1-9):</label>
                                <div className="text-center text-2xl font-bold mb-2">{formData.bodyCondition}</div>
                                <Slider
                                    id="bodyCondition"
                                    min={1}
                                    max={9}
                                    step={0.5}
                                    value={[parseFloat(formData.bodyCondition)]}
                                    onValueChange={(value) => handleInputChange({ target: { id: 'bodyCondition', value: value[0].toString() } })}
                                />
                                <p className="mt-2 text-sm text-muted-foreground">Use the score to assess your pet's body condition based on this <a href="#" className="text-primary hover:underline">chart</a>.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white">
                        <CardHeader>
                            <CardTitle>About your dog's food</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div>
                                <label htmlFor="foodCalories" className="block text-sm font-medium text-muted-foreground">Calories in selected food:</label>
                                <Input
                                    type="number"
                                    id="foodCalories"
                                    value={formData.foodCalories}
                                    onChange={handleInputChange}
                                    placeholder="Enter calories per 100 grams"
                                    required
                                />
                                <p className="mt-2 text-sm text-muted-foreground">Note: The entered value represents kilocalories (kcal) per 100 grams of the food.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Button
                        type="button"
                        className="w-full"
                        onClick={handleCalculate}
                    >
                        Calculate
                    </Button>
                </form>
            )}

            {isModalOpen && solution && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 z-10"
                            onClick={handleCloseModal}
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </Button>

                        <PetNameDisplay name={solution.name} />

                        <CardContent className="p-6 mt-20">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                                <p><strong>Date of Birth:</strong> {solution.dob}</p>
                                <p><strong>Age:</strong> {solution.age.years} years, {solution.age.months} months, {solution.age.days} days</p>
                                <p><strong>Gender:</strong> {solution.gender}</p>
                                <p><strong>Breed:</strong> {solution.breed}</p>
                                <p><strong>Weight:</strong> {solution.weight} kg</p>
                                <p><strong>Body Condition Score:</strong> {solution.bodyCondition}</p>
                                <p><strong>Activity Level:</strong> {solution.activityLevel}</p>
                                <p><strong>Desexed:</strong> {solution.desexed === "yes" ? "Yes" : "No"}</p>
                                <p><strong>Calories in Selected Food:</strong> {solution.foodCalories} kcal/100g</p>
                            </div>
                            <hr className="my-4 border-border" />
                            <h3 className="text-xl font-semibold mb-2">Calculation Breakdown:</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <p><strong>Approx Ideal Weight:</strong> {solution.idealWeight.toFixed(1)} kg</p>
                                <p><strong>% Over/Under Weight:</strong> {solution.percentOver.toFixed(0)}%</p>
                                <p><strong>Approx Daily Calories:</strong> {Math.round(solution.caloricNeeds)} kcal/day</p>
                                <p><strong>Suggested Starting Daily Feeding Amount:</strong> {Math.round(solution.dailyFoodAmount)} g</p>
                            </div>
                        </CardContent>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
};

export default FoodCalculator;

