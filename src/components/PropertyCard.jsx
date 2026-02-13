import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, BedDouble, Phone, User } from 'lucide-react';

export const PropertyCard = ({ property, index }) => {
    const [showContact, setShowContact] = useState(false);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all duration-500"
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
                    <h3 className="text-lg font-semibold text-apple-dark line-clamp-1 group-hover:text-apple-blue transition-colors" title={property.name}>
                        {property.name}
                    </h3>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowContact(!showContact);
                        }}
                        className={`text-sm font-semibold px-4 py-1.5 rounded-full transition-all duration-300 ${showContact
                            ? 'bg-gray-900 text-white shadow-md'
                            : 'bg-blue-50 text-apple-blue hover:bg-apple-blue hover:text-white'
                            }`}
                    >
                        {showContact ? 'Close' : 'Contact'}
                    </button>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                    <div className="flex items-center gap-2 text-apple-text-secondary text-sm">
                        <MapPin className="w-4 h-4 shrink-0" />
                        <span className="truncate">{property.location}, {property.city}</span>
                    </div>

                    <div className="flex items-center gap-2 text-apple-text-secondary text-sm">
                        <BedDouble className="w-4 h-4 shrink-0" />
                        <span>{property.rooms} Rooms</span>
                    </div>
                </div>

                <AnimatePresence>
                    {showContact && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-4 mt-4 border-t border-gray-100 flex flex-col gap-4">
                                {property.contacts && property.contacts.length > 0 ? (
                                    property.contacts.map((contact, idx) => (
                                        <div key={idx} className={`${idx > 0 ? 'pt-4 border-t border-gray-50' : ''}`}>
                                            <div className="flex items-center gap-3 text-apple-text mb-2">
                                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                                    <User className="w-4 h-4 text-apple-blue" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-apple-text-secondary font-medium">Contact Person {property.contacts.length > 1 ? `#${idx + 1}` : ''}</p>
                                                    <p className="font-semibold text-sm">{contact.name}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 text-apple-text">
                                                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                                                    <Phone className="w-4 h-4 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-apple-text-secondary font-medium">Phone Number</p>
                                                    <a href={`tel:${contact.phone}`} className="font-semibold text-sm hover:text-apple-blue transition-colors">
                                                        {contact.phone}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-center text-gray-500 py-2">No contact information available</p>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};
