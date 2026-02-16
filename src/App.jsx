import { useState, useMemo, useEffect } from 'react';
import { useSheetData } from './hooks/useSheetData';

import { FilterBar } from './components/FilterBar';
import { PropertyGrid } from './components/PropertyGrid';
import VenueForm from './components/VenueForm';

function App() {
  const { data, loading, error } = useSheetData();

  // View State: 'list' | 'form'
  const [view, setView] = useState('list');

  // Filter States
  const [searchValue, setSearchValue] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  // const [selectedRooms, setSelectedRooms] = useState(""); // Removed single value
  const [minRooms, setMinRooms] = useState(0);
  const [maxRooms, setMaxRooms] = useState(600);
  const [sortOrder, setSortOrder] = useState("desc");

  // Extract unique values for dropdowns
  const locations = useMemo(() => [...new Set(data.map(item => item.location))], [data]);
  const cities = useMemo(() => [...new Set(data.map(item => item.city))], [data]);
  // const rooms = useMemo(() => [...new Set(data.map(item => item.rooms))].sort((a,b) => a-b), [data]); // Not needed for slider

  // find max rooms dynamically if needed, but 100 is safe upper bound for now based on data

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
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-apple-blue/20 selection:text-apple-blue">
      <header className="bg-white shadow-sm border-b border-gray-100 z-30 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 cursor-pointer" onClick={() => setView('list')}>
            Venue Manager
          </h1>
          <button
            onClick={() => setView(view === 'list' ? 'form' : 'list')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'form'
                ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
          >
            {view === 'list' ? '+ Add Venue' : 'Back to List'}
          </button>
        </div>
      </header>

      <main className="relative z-20 pt-8 pb-20">
        {view === 'list' ? (
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

            <PropertyGrid
              properties={filteredData}
              loading={loading}
            />
          </>
        ) : (
          <VenueForm />
        )}
      </main>

      <footer className="py-10 text-center text-apple-text-secondary text-sm border-t border-gray-200">
        <p>&copy; {new Date().getFullYear()} Premium Properties. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
