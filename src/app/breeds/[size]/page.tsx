'use client'

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from "@/components/ui/button"
import { ChevronLeft } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger, Observer);

interface DogBreed {
    id: string;
    name: string;
    description: string;
    image: string;
    size: 'small' | 'medium' | 'large';
}

const truncateText = (text: string, maxLines: number = 4, charsPerLine: number = 60): string => {
    const words = text.split(' ');
    let result = '';
    let lineCount = 1;
    let charCount = 0;

    for (const word of words) {
        if (charCount + word.length > charsPerLine) {
            if (lineCount >= maxLines) {
                return result.trim() + '...';
            }
            result += '\n';
            lineCount++;
            charCount = 0;
        }
        result += word + ' ';
        charCount += word.length + 1;
    }

    return result.trim();
};

export default function DogBreedsPage() {
    const params = useParams();
    const router = useRouter();
    const initialSize = params.size as 'small' | 'medium' | 'large' | 'all';
    const [selectedSize, setSelectedSize] = useState<'all' | 'small' | 'medium' | 'large'>(initialSize);
    const [breeds, setBreeds] = useState<DogBreed[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const mainRef = useRef<HTMLDivElement>(null);
    const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const fetchBreeds = async () => {
            setLoading(true);
            setError(null);
            try {
                let breedQuery;
                if (selectedSize === 'all') {
                    breedQuery = collection(db, 'breed');
                } else {
                    breedQuery = query(collection(db, 'breed'), where('size', '==', selectedSize));
                }

                const querySnapshot = await getDocs(breedQuery);
                const fetchedBreeds: DogBreed[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data() as DogBreed;
                    fetchedBreeds.push({
                        id: doc.id,
                        name: data.name,
                        description: data.about,
                        image: `/img/breed/${data.name.toLowerCase().replace(/\s+/g, '')}.jpg`,
                        size: data.size,
                    });
                });

                setBreeds(fetchedBreeds.sort((a, b) => a.name.localeCompare(b.name)));
            } catch (err) {
                console.error("Error fetching breeds:", err);
                setError("Failed to fetch breeds. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchBreeds();
    }, [selectedSize]);

    useEffect(() => {
        if (typeof window !== 'undefined' && !loading && breeds.length > 0) {
            const main = mainRef.current;
            const items = itemsRef.current;

            items.forEach((item, index) => {
                if (item) {
                    const txt = item.querySelector('.txt');
                    const thumb = item.querySelector('.thumb');
                    const img = thumb?.querySelector('img');
                    const overlay = item.querySelector('.overlay');
                    const hit = item.querySelector('.hit');

                    gsap.fromTo(img, { xPercent: -18 }, {
                        scrollTrigger: {
                            trigger: item,
                            start: '0 100%',
                            end: '100% 0',
                            horizontal: true,
                            scrub: 0
                        },
                        xPercent: 0,
                        ease: 'none'
                    });

                    item.onpointerenter = (e) => {
                        gsap.to(overlay, { opacity: 0.5 });
                        gsap.to(img, { duration: 0.3, scale: 1.2, overwrite: 'auto', ease: 'back' });
                        gsap.to(item.querySelector('h2'), { color: 'rgb(160,180,225)' });
                        gsap.to(item.querySelector('.item-info'), { opacity: 0.6 });
                        gsap.to([thumb, txt], { ease: 'power3', yPercent: [-6], overwrite: 'auto' });
                    };

                    item.onpointermove = (e) => {
                        const xp = gsap.utils.interpolate(-40, 20, (e as MouseEvent).offsetX / 500);
                        const yp = gsap.utils.interpolate(-40, 40, (e as MouseEvent).offsetY / 400);
                        gsap.to(overlay, { duration: 0.7, ease: 'power2', x: xp * 4, y: yp * 4 });
                        gsap.to([hit, thumb], { duration: 0.7, ease: 'power2', x: xp, y: yp });
                        gsap.to([img], { duration: 0.7, ease: 'power2', x: -xp / 1.3, y: -yp / 1.3 });
                        gsap.to(txt, { duration: 0.7, x: xp, y: yp });
                    };

                    item.onpointerleave = (e) => {
                        gsap.to(overlay, { opacity: 0, x: 0, y: 0, overwrite: 'auto' });
                        gsap.to(img, { duration: 0.3, scale: 1, x: 0, y: 0, overwrite: 'auto' });
                        gsap.to(item.querySelector('h2'), { color: 'rgb(255,255,255)' });
                        gsap.to(item.querySelector('.item-info'), { opacity: 0.2 });
                        gsap.to([hit, thumb, txt], { duration: 0.7, x: 0, y: 0, yPercent: 0, ease: 'elastic.out(0.8)', overwrite: 'auto' });
                    };
                }
            });

            gsap.timeline()
                .to(main, { opacity: 1 })
                .from('.item', { x: window.innerWidth, skewX: 20, stagger: 0.2, duration: 1, ease: 'elastic.out(0.3)' }, 0.4)
                .from('.txt', { x: window.innerWidth, stagger: 0.2, duration: 1, ease: 'elastic.out(0.2)' }, 0.44)
                .set(main, { pointerEvents: 'auto' }, 1);

            gsap.set('.item', { transformOrigin: '50% 0' });
        }
    }, [breeds, loading]);

    if (loading) {
        return <div className="min-h-screen bg-[#191814] text-white font-poppins flex items-center justify-center">Loading...</div>;
    }

    if (error) {
        return <div className="min-h-screen bg-[#191814] text-white font-poppins flex items-center justify-center">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-[#191814] text-white font-poppins">
            <div className="w-full bg-[#191814] p-4 md:p-8">
                <Button
                    variant="outline"
                    onClick={() => router.push('/')}
                    className="mb-4 rounded-full p-3 text-primary hover:bg-primary hover:text-[#191814]"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
                    Dog Breeds
                </h1>
                <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6">
                    A Guide to Adorable Companions
                </h2>
                <div className="max-w-4xl mx-auto text-center mb-8">
                    <p className="text-lg md:text-xl leading-relaxed">
                        Explore our comprehensive collection of dog breeds, from small and cuddly companions to large and majestic guardians. Each breed offers unique characteristics and personalities, perfect for various lifestyles and preferences. Whether you're looking for a playful family pet, a loyal companion, or a working dog, you'll find a breed that matches your needs and captures your heart.
                    </p>
                </div>
                <div className="flex justify-center gap-4 mb-8">
                    <button
                        className={`px-4 py-2 rounded-lg ${selectedSize === 'all' ? 'bg-white text-[#191814]' : 'bg-[#191814] text-white border border-white'}`}
                        onClick={() => setSelectedSize('all')}
                    >
                        All Breeds
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg ${selectedSize === 'small' ? 'bg-white text-[#191814]' : 'bg-[#191814] text-white border border-white'}`}
                        onClick={() => setSelectedSize('small')}
                    >
                        Small Breeds
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg ${selectedSize === 'medium' ? 'bg-white text-[#191814]' : 'bg-[#191814] text-white border border-white'}`}
                        onClick={() => setSelectedSize('medium')}
                    >
                        Medium Breeds
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg ${selectedSize === 'large' ? 'bg-white text-[#191814]' : 'bg-[#191814] text-white border border-white'}`}
                        onClick={() => setSelectedSize('large')}
                    >
                        Large Breeds
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <main ref={mainRef} className="flex items-center flex-row opacity-0 w-max">
                    {breeds.map((breed, index) => (
                        <div key={breed.id} ref={(el) => (itemsRef.current[index] = el)} className="item w-[500px] h-[450px] m-[50px] block relative">
                            <div className="thumb w-[500px] h-[250px] overflow-hidden pointer-events-none">
                                <Image
                                    src={`/img/breed/${breed.name.toLowerCase().replace(/\s+/g, '')}.jpg`}
                                    alt={breed.name}
                                    width={750}
                                    height={250}
                                    objectFit="cover"
                                />
                                <div className="overlay absolute top-[-75px] left-0 w-[500px] h-[500px] bg-radial-gradient opacity-0 mix-blend-overlay"></div>
                            </div>
                            <div className="txt pointer-events-auto">
                                <h2 className="item-head text-2xl font-bold mb-2">{breed.name}</h2>
                                <div className="item-info opacity-20 tracking-wide mb-4 h-24 overflow-hidden">
                                    {truncateText(breed.description, 4)}
                                </div>
                                <Link href={`/breeds/${breed.size}/${breed.id}`} passHref>
                                    <button className="learn-more mt-4 px-6 py-3 bg-white text-[#191814] border-none rounded-lg text-lg font-bold cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-100 hover:text-black relative z-20 pointer-events-auto">
                                        Learn More
                                    </button>
                                </Link>
                            </div>
                            <div className="hit bg-transparent w-[540px] h-[390px] absolute top-[-20px] left-[-20px]"></div>
                        </div>
                    ))}
                </main>
            </div>
        </div>
    );
}

