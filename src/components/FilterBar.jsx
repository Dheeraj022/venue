import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ArrowUpDown, X } from 'lucide-react';
import RangeSlider from './RangeSlider';

export const FilterBar = ({
    searchValue,
    onSearchChange,
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
    const [showCityDropdown, setShowCityDropdown] = useState(false);

    const hasFilters = searchValue || selectedCity || (minRooms > 0) || (maxRooms < 600);

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
                    <div className="relative">
                        <button
                            onClick={() => setShowCityDropdown(!showCityDropdown)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${showCityDropdown || selectedCity
                                ? 'bg-apple-blue text-white shadow-lg shadow-apple-blue/20'
                                : 'bg-gray-50 hover:bg-gray-100 text-apple-text'
                                }`}
                        >
                            <span>{selectedCity || 'All Cities'}</span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${showCityDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {showCityDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute left-0 top-full mt-2 bg-white rounded-2xl shadow-xl shadow-black/10 border border-gray-100 w-[200px] z-50 origin-top-left ring-1 ring-black/5 overflow-hidden"
                                >
                                    <div className="max-h-[300px] overflow-y-auto py-2">
                                        <button
                                            onClick={() => {
                                                onCityChange("");
                                                setShowCityDropdown(false);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 flex items-center justify-between ${selectedCity === "" ? 'font-semibold text-apple-blue bg-blue-50/50' : 'text-apple-text'
                                                }`}
                                        >
                                            All Cities
                                            {selectedCity === "" && <div className="w-1.5 h-1.5 rounded-full bg-apple-blue" />}
                                        </button>
                                        {cities.map(city => (
                                            <button
                                                key={city}
                                                onClick={() => {
                                                    onCityChange(city);
                                                    setShowCityDropdown(false);
                                                }}
                                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 flex items-center justify-between ${selectedCity === city ? 'font-semibold text-apple-blue bg-blue-50/50' : 'text-apple-text'
                                                    }`}
                                            >
                                                {city}
                                                {selectedCity === city && <div className="w-1.5 h-1.5 rounded-full bg-apple-blue" />}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
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
                                    className="absolute right-0 top-full mt-3 p-4 bg-white rounded-2xl shadow-xl shadow-black/10 border border-gray-100 w-[280px] z-50 origin-top-right ring-1 ring-black/5"
                                >
                                    <div className="flex justify-between items-center mb-2 px-2">
                                        <span className="text-sm font-semibold text-apple-text tracking-wide">Room Range</span>
                                        <button
                                            onClick={() => setShowRoomFilter(false)}
                                            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                                        >
                                            <X className="w-4 h-4" />
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

                    {/* Clear Filters Button */}
                    <AnimatePresence>
                        {hasFilters && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                onClick={onClear}
                                className="px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors font-medium text-sm whitespace-nowrap"
                            >
                                Clear Filters
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};
