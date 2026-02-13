import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown, ArrowUpDown } from 'lucide-react';

export const FilterBar = ({
    searchValue,
    onSearchChange,
    locations = [],
    selectedLocation,
    onLocationChange,
    cities = [],
    selectedCity,
    onCityChange,
    rooms = [],
    selectedRooms,
    onRoomsChange,
    sortOrder,
    onSortChange
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="sticky top-4 z-50 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg shadow-black/5 rounded-2xl p-4 flex flex-wrap gap-4 items-center justify-between">

                {/* Search Input */}
                <div className="relative flex-grow min-w-[200px] group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-apple-blue transition-colors" />
                    <input
                        type="text"
                        placeholder="Search Venue Name..."
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full bg-gray-100/50 hover:bg-gray-100 focus:bg-white border-none rounded-xl py-3 pl-10 pr-4 text-apple-text outline-none ring-0 focus:ring-2 focus:ring-apple-blue/20 transition-all duration-300 placeholder:text-gray-400"
                    />
                </div>

                {/* Filters Group */}
                <div className="flex flex-wrap gap-3 items-center flex-grow sm:flex-grow-0">

                    {/* City Dropdown */}
                    <div className="relative group">
                        <select
                            value={selectedCity}
                            onChange={(e) => onCityChange(e.target.value)}
                            className="appearance-none bg-gray-50 hover:bg-gray-100 cursor-pointer py-3 pl-4 pr-10 rounded-xl text-sm font-medium text-apple-text outline-none border border-transparent focus:border-apple-blue/30 transition-all"
                        >
                            <option value="">All Cities</option>
                            {cities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Location Dropdown */}
                    <div className="relative group">
                        <select
                            value={selectedLocation}
                            onChange={(e) => onLocationChange(e.target.value)}
                            className="appearance-none bg-gray-50 hover:bg-gray-100 cursor-pointer py-3 pl-4 pr-10 rounded-xl text-sm font-medium text-apple-text outline-none border border-transparent focus:border-apple-blue/30 transition-all max-w-[200px]"
                        >
                            <option value="">All Locations</option>
                            {locations.map(loc => (
                                <option key={loc} value={loc} className="truncate">{loc}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Rooms Dropdown */}
                    <div className="relative group">
                        <select
                            value={selectedRooms}
                            onChange={(e) => onRoomsChange(e.target.value)}
                            className="appearance-none bg-gray-50 hover:bg-gray-100 cursor-pointer py-3 pl-4 pr-10 rounded-xl text-sm font-medium text-apple-text outline-none border border-transparent focus:border-apple-blue/30 transition-all"
                        >
                            <option value="">No of Rooms</option>
                            {rooms.map(room => (
                                <option key={room} value={room}>{room} Rooms</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Sort Button */}
                    <button
                        onClick={onSortChange}
                        className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-apple-text px-4 py-3 rounded-xl text-sm font-medium transition-all active:scale-95"
                    >
                        <ArrowUpDown className="w-4 h-4 text-gray-500" />
                        <span className="hidden sm:inline">{sortOrder === 'asc' ? 'Low to High' : 'High to Low'}</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
