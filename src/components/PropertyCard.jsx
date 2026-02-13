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
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 text-apple-text mb-1">
                                                        <User className="w-3.5 h-3.5 text-apple-blue shrink-0" />
                                                        <span className="text-xs text-apple-text-secondary font-medium uppercase tracking-wide">
                                                            Person {property.contacts.length > 1 ? idx + 1 : ''}
                                                        </span>
                                                    </div>
                                                    <p className="font-semibold text-sm text-apple-dark truncate pl-5.5">
                                                        {contact.name || "N/A"}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-2 pl-5.5 text-apple-text-secondary">
                                                        <Phone className="w-3 h-3" />
                                                        <span className="text-sm font-medium">{contact.phone || "N/A"}</span>
                                                    </div>
                                                </div>

                                                <a
                                                    href={`tel:${contact.phone}`}
                                                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 active:scale-95 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md shadow-green-500/20 shrink-0"
                                                >
                                                    <Phone className="w-4 h-4 fill-current" />
                                                    <span>Call Now</span>
                                                </a>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-4 text-center">
                                        <p className="text-sm text-gray-400">No contact information available</p>
                                    </div>
                                )}

                                {/* Email Display */}
                                {property.email && (
                                    <div className="pt-4 border-t border-gray-50">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 text-apple-text mb-1">
                                                    <span className="text-xs text-apple-text-secondary font-medium uppercase tracking-wide">
                                                        Email Address
                                                    </span>
                                                </div>
                                                <a href={`mailto:${property.email}`} className="font-semibold text-sm text-apple-blue hover:underline truncate block">
                                                    {property.email}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};
