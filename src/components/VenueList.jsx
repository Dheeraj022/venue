import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSheetData } from '../hooks/useSheetData';
import { FilterBar } from './FilterBar';
import { PropertyGrid } from './PropertyGrid';

export const VenueList = () => {
    const { data, loading, error } = useSheetData();

    // Filter States
    const [searchValue, setSearchValue] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [minRooms, setMinRooms] = useState(0);
    const [maxRooms, setMaxRooms] = useState(600);
    const [sortOrder, setSortOrder] = useState("desc");

    // Extract unique values for dropdowns
    const locations = useMemo(() => [...new Set(data.map(item => item.location))], [data]);
    const cities = useMemo(() => [...new Set(data.map(item => item.city))], [data]);

    // Debounce search
    const [debouncedSearch, setDebouncedSearch] = useState(searchValue);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchValue);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchValue]);

    // Filter Logic
    const filteredData = useMemo(() => {
        let result = data;

        if (debouncedSearch) {
            result = result.filter(item =>
                item.name.toLowerCase().includes(debouncedSearch.trim().toLowerCase())
            );
        }

        if (selectedLocation) {
            result = result.filter(item => item.location === selectedLocation);
        }

        if (selectedCity) {
            result = result.filter(item => item.city === selectedCity);
        }

        // Range Filter Logic
        result = result.filter(item =>
            item.rooms >= minRooms && item.rooms <= maxRooms
        );

        return result.sort((a, b) => {
            return sortOrder === 'asc'
                ? a.rooms - b.rooms
                : b.rooms - a.rooms;
        });

    }, [data, debouncedSearch, selectedLocation, selectedCity, minRooms, maxRooms, sortOrder]);

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <>
            <FilterBar
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                cities={cities}
                selectedCity={selectedCity}
                onCityChange={setSelectedCity}
                minRooms={minRooms}
                maxRooms={maxRooms}
                onRoomsChange={(min, max) => {
                    setMinRooms(min);
                    setMaxRooms(max);
                }}
                sortOrder={sortOrder}
                onSortChange={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                onClear={() => {
                    setSearchValue("");
                    setSelectedCity("");
                    setMinRooms(0);
                    setMaxRooms(600);
                    setSortOrder("desc");
                }}
            />

            <div className="max-w-7xl mx-auto px-6 mt-8 mb-2">
                <p className="text-apple-text-secondary font-medium">
                    Showing <span className="text-apple-dark font-semibold">{filteredData.length}</span> properties
                </p>
            </div>

            <PropertyGrid
                properties={filteredData}
                loading={loading}
            />
        </>
    );
};
