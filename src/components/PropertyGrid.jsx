import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PropertyCard } from './PropertyCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const PropertyGrid = ({ properties, loading }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    // Pagination logic
    const totalPages = Math.ceil(properties.length / itemsPerPage);
    const displayedProperties = properties.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-6 py-12">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-gray-100 rounded-3xl h-[400px] animate-pulse" />
                ))}
            </div>
        );
    }

    if (properties.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center px-4"
            >
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <span className="text-4xl">🔍</span>
                </div>
                <h3 className="text-xl font-medium text-apple-dark mb-2">No properties found</h3>
                <p className="text-apple-text-secondary">Try adjusting your filters to find what you're looking for.</p>
            </motion.div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                <AnimatePresence mode='popLayout'>
                    {displayedProperties.map((property, index) => (
                        <PropertyCard key={property.id} property={property} index={index} />
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-16">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6 text-apple-dark" />
                    </button>

                    <span className="text-sm font-medium text-apple-text-secondary">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight className="w-6 h-6 text-apple-dark" />
                    </button>
                </div>
            )}
        </div>
    );
};
