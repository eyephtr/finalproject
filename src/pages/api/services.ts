'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

type Service = {
    id: string
    name: string
    type: string
    address: string
    lat: number
    lng: number
    tel: string
    openingHours: string
    district: string
}

type ServicesByDistrict = {
    [key: string]: Service[]
}

export function useServices() {
    const [services, setServices] = useState<ServicesByDistrict>({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchServices() {
            try {
                const querySnapshot = await getDocs(collection(db, 'services'))
                const servicesData: Service[] = []

                querySnapshot.forEach((doc) => {
                    servicesData.push({
                        id: doc.id,
                        ...doc.data() as Omit<Service, 'id'>
                    })
                })

                // Group services by district
                const groupedServices = servicesData.reduce((acc, service) => {
                    if (!acc[service.district]) {
                        acc[service.district] = []
                    }
                    acc[service.district].push(service)
                    return acc
                }, {} as ServicesByDistrict)

                setServices(groupedServices)
                setLoading(false)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch services')
                setLoading(false)
            }
        }

        fetchServices()
    }, [])

    return { services, loading, error }
}

