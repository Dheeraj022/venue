import { motion } from 'framer-motion';
import { MapPin, BedDouble } from 'lucide-react';

export const PropertyCard = ({ property, index }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all duration-500 cursor-pointer"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                    src={property.image || `https://source.unsplash.com/800x600/?house,modern,${index}`}
                    alt={property.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-apple-dark line-clamp-1 group-hover:text-apple-blue transition-colors">
                        {property.name}
                    </h3>
                    <span className="text-sm font-semibold text-apple-blue bg-apple-blue/10 px-3 py-1 rounded-full">
                        {property.price || "Contact"}
                    </span>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                    <div className="flex items-center gap-2 text-apple-text-secondary text-sm">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{property.location}, {property.city}</span>
                    </div>

                    <div className="flex items-center gap-2 text-apple-text-secondary text-sm">
                        <BedDouble className="w-4 h-4" />
                        <span>{property.rooms} Bedrooms</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
