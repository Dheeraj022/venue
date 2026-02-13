import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ArrowUpDown, X } from 'lucide-react';
import RangeSlider from './RangeSlider';

export const FilterBar = ({
    searchValue,
    onSearchChange,
    locations = [],
    selectedLocation,
    onLocationChange,
    cities = [],
    selectedCity,
    onCityChange,
    minRooms,
    maxRooms,
    onRoomsChange,
    sortOrder,
    onSortChange,
    onClear
}) => {
    const [showRoomFilter, setShowRoomFilter] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="sticky top-4 z-50 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg shadow-black/5 rounded-2xl p-4 flex flex-wrap gap-4 items-center justify-between relative">

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

                    {/* Rooms Filter Toggle */}
                    <div className="relative">
                        <button
                            onClick={() => setShowRoomFilter(!showRoomFilter)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${showRoomFilter || (minRooms > 0 || maxRooms < 600)
                                ? 'bg-apple-blue text-white shadow-lg shadow-apple-blue/20'
                                : 'bg-gray-50 hover:bg-gray-100 text-apple-text'
                                }`}
                        >
                            <span>
                                {minRooms > 0 || maxRooms < 600
                                    ? `${minRooms} - ${maxRooms} Rooms`
                                    : 'No of Rooms'}
                            </span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${showRoomFilter ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {showRoomFilter && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 top-full mt-2 p-4 bg-white rounded-2xl shadow-xl border border-gray-100 w-[240px] z-50 origin-top-right"
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm font-semibold text-apple-text">Room Range</span>
                                        <button
                                            onClick={() => setShowRoomFilter(false)}
                                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                        >
                                            <X className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </div>
                                    <div className="px-2 pb-2">
                                        <RangeSlider
                                            min={0}
                                            max={600}
                                            onChange={(min, max) => onRoomsChange(min, max)}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
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
