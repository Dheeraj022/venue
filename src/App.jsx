import { useState, useMemo, useEffect } from 'react';
import { useSheetData } from './hooks/useSheetData';
import { Hero } from './components/Hero';
import { FilterBar } from './components/FilterBar';
import { PropertyGrid } from './components/PropertyGrid';

function App() {
  const { data, loading, error } = useSheetData();

  // Filter States
  const [searchValue, setSearchValue] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedRooms, setSelectedRooms] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Extract unique values for dropdowns
  const locations = useMemo(() => [...new Set(data.map(item => item.location))], [data]);
  const cities = useMemo(() => [...new Set(data.map(item => item.city))], [data]);
  const rooms = useMemo(() => [...new Set(data.map(item => item.rooms))].sort((a, b) => a - b), [data]);

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
        item.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    if (selectedLocation) {
      result = result.filter(item => item.location === selectedLocation);
    }

    if (selectedCity) {
      result = result.filter(item => item.city === selectedCity);
    }

    if (selectedRooms) {
      result = result.filter(item => String(item.rooms) === String(selectedRooms));
    }

    return result.sort((a, b) => {
      return sortOrder === 'asc'
        ? a.rooms - b.rooms
        : b.rooms - a.rooms;
    });

  }, [data, debouncedSearch, selectedLocation, selectedCity, selectedRooms, sortOrder]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-apple-blue/20 selection:text-apple-blue">
      <Hero />

      <main className="relative -mt-20 z-20">
        <FilterBar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          locations={locations}
          selectedLocation={selectedLocation}
          onLocationChange={setSelectedLocation}
          cities={cities}
          selectedCity={selectedCity}
          onCityChange={setSelectedCity}
          rooms={rooms}
          selectedRooms={selectedRooms}
          onRoomsChange={setSelectedRooms}
          sortOrder={sortOrder}
          onSortChange={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
        />

        <PropertyGrid
          properties={filteredData}
          loading={loading}
        />
      </main>

      <footer className="py-10 text-center text-apple-text-secondary text-sm">
        <p>&copy; {new Date().getFullYear()} Premium Properties. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
