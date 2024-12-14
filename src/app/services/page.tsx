"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Clock, Info, Heart } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useServices } from '@/pages/api/services'
import Link from 'next/link';
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

// Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoicGh0cnMiLCJhIjoiY200a3JzNmNwMHF5MjJscHRzNHN0aGptZiJ9.pRmC1vCjW1B3Ol4lAF47HA';

const ServicePage = () => {
    const [selectedDistrict, setSelectedDistrict] = useState('Bang Phlat');
    const [selectedType, setSelectedType] = useState('All');
    const [selectedService, setSelectedService] = useState(null);
    const mapContainer = useRef(null);
    const map = useRef(null);

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

    const { services: servicesData, loading, error } = useServices()

    const serviceTypes = ['All', 'Hospital', 'Clinic', 'Shop', 'Hotel', 'Grooming', 'Training'];

    const filteredServices = selectedType === 'All'
        ? servicesData[selectedDistrict]
        : servicesData[selectedDistrict]?.filter(service => service.type === selectedType);

    // Initialize map and markers
    useEffect(() => {
        if (map.current) return;
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/light-v11',
            center: [100.5018, 13.7563],
            zoom: 10
        });

        map.current.addControl(new mapboxgl.NavigationControl());
    }, []);

    // Update markers when district or type changes
    useEffect(() => {
        if (!map.current) return;

        const existingMarkers = document.getElementsByClassName('mapboxgl-marker');
        while (existingMarkers.length > 0) {
            existingMarkers[0].remove();
        }

        filteredServices?.forEach(service => {
            const marker = new mapboxgl.Marker({ color: '#3B82F6' }) // Blue marker
                .setLngLat([service.lng, service.lat])
                .addTo(map.current);

            marker.getElement().addEventListener('click', () => {
                map.current.flyTo({
                    center: [service.lng, service.lat],
                    zoom: 15
                });
                setSelectedService(service);
            });
        });

        if (filteredServices && filteredServices.length > 0) {
            const firstService = filteredServices[0];
            map.current.flyTo({
                center: [firstService.lng, firstService.lat],
                zoom: 12
            });
        }
    }, [selectedDistrict, selectedType, filteredServices]);

    return (
        <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
            <div className="flex items-center mb-6">
                <Heart className="w-10 h-10 text-red-500 mr-4" />
                <h1 className="text-4xl font-bold text-gray-800">Pet Services in Bangkok</h1>
            </div>

            {loading && <p className="text-center text-gray-600">Loading services...</p>}
            {error && <p className="text-center text-red-500">Error: {error}</p>}
            {!loading && !error && Object.keys(servicesData).length === 0 && (
                <p className="text-center text-gray-600">No services found</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left sidebar - District selection */}
                <div className="space-y-4">
                    <Card className="shadow-lg">
                        <CardHeader className="bg-blue-50">
                            <CardTitle className="text-blue-800">Districts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {Object.keys(servicesData).map(district => (
                                    <button
                                        key={district}
                                        onClick={() => setSelectedDistrict(district)}
                                        className={`w-full text-left px-4 py-2 rounded transition duration-200 ${selectedDistrict === district
                                                ? 'bg-blue-500 text-white'
                                                : 'hover:bg-blue-100 text-gray-700'
                                            }`}
                                    >
                                        {district}
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pet Services Information Card */}
                    <Card className="shadow-lg">
                        <CardHeader className="bg-green-50">
                            <CardTitle className="text-green-800 flex items-center">
                                <Info className="w-5 h-5 mr-2" />
                                Pet Care Tips
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-gray-700">
                            <ul className="space-y-2 list-disc pl-4">
                                <li>Always check veterinary credentials before choosing a service</li>
                                <li>Regular check-ups are crucial for pet health</li>
                                <li>Consider pet insurance for unexpected medical expenses</li>
                                <li>Look for services with positive reviews and recommendations</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Main content */}
                <div className="md:col-span-2 space-y-6">
                    {/* Map Container */}
                    <Card className="shadow-xl">
                        <CardContent className="p-0">
                            <div 
                                ref={mapContainer} 
                                className="w-full h-[500px] rounded-lg"
                            />
                        </CardContent>
                    </Card>

                    {/* Service type filter */}
                    <Card className="shadow-lg">
                        <CardHeader className="bg-purple-50">
                            <CardTitle className="text-purple-800">Filter by Type</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {serviceTypes.map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setSelectedType(type)}
                                        className={`px-4 py-2 rounded-full transition duration-200 ${selectedType === type
                                                ? 'bg-purple-500 text-white'
                                                : 'border border-purple-200 hover:bg-purple-100 text-purple-700'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Service listings */}
                    <div className="space-y-4">
                        {filteredServices?.map(service => (
                            <Card 
                                key={service.id}
                                onClick={() => {
                                    map.current.flyTo({
                                        center: [service.lng, service.lat],
                                        zoom: 15
                                    });
                                    setSelectedService(service);
                                }}
                                className={`cursor-pointer transition duration-300 transform hover:scale-[1.02] ${selectedService?.id === service.id 
                                    ? 'border-2 border-blue-500 shadow-2xl' 
                                    : 'hover:shadow-lg'}`}
                            >
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-2xl font-bold mb-2 text-gray-800">{service.name}</h3>
                                            <p className="text-blue-600 mb-4 font-semibold">{service.type}</p>

                                            <div className="space-y-2 text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-5 h-5 text-green-500" />
                                                    <Link 
                                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(service.address)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="hover:underline hover:text-blue-700"
                                                    >
                                                        {service.address}
                                                    </Link>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-5 h-5 text-blue-500" />
                                                    <Link href={`tel:${service.tel}`} className="hover:underline hover:text-blue-700">
                                                        {service.tel}
                                                    </Link>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-5 h-5 text-purple-500" />
                                                    <span>{service.openingHours}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServicePage;

