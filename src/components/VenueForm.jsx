import { useState } from 'react';
import RangeSlider from './RangeSlider';

const VenueForm = () => {
    const [formData, setFormData] = useState({
        venueName: '',
        city: '',
        location: '',
        person: '',
        personContact: '',
        person2: '',
        personContact2: '',
        email: '',
        email2: '',
        rooms: 0
    });

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRoomsChange = (min, max) => {
        // RangeSlider returns min (0) and max (value). We use max as the single value.
        setFormData(prev => ({
            ...prev,
            rooms: max
        }));
    };

    const validateForm = () => {
        if (!formData.venueName) return 'Venue Name is required';
        if (!formData.city) return 'City is required';
        if (!formData.person) return 'Contact Person is required';
        if (!formData.email) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Invalid email format';
        if (formData.email2 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email2)) return 'Invalid secondary email format';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const error = validateForm();
        if (error) {
            setStatus({ type: 'error', message: error });
            return;
        }

        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            // Use text/plain to avoid CORS preflight options request which GAS doesn't handle
            const response = await fetch(import.meta.env.VITE_GOOGLE_SCRIPT_URL, {
                method: "POST",
                body: JSON.stringify(formData),
                mode: "no-cors", // Essential for GAS if not properly handling CORS headers
                headers: {
                    "Content-Type": "text/plain;charset=utf-8",
                },
            });

            // With no-cors, we can't check response.ok or response.json()
            // We assume success if no network error occurred
            setStatus({ type: 'success', message: 'Venue submitted successfully!' });

            // Reset form
            setFormData({
                venueName: '',
                city: '',
                location: '',
                person: '',
                personContact: '',
                person2: '',
                personContact2: '',
                email: '',
                email2: '',
                rooms: 0
            });

        } catch (err) {
            console.error(err);
            setStatus({ type: 'error', message: 'Failed to submit. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-gray-100 my-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Venue</h2>

            {status.message && (
                <div className={`p-4 mb-6 rounded-xl text-sm font-medium ${status.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                    }`}>
                    {status.message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Venue Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Venue Name *</label>
                        <input
                            type="text"
                            name="venueName"
                            value={formData.venueName}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-apple-blue/50 rounded-xl outline-none transition-all placeholder:text-gray-400"
                            placeholder="e.g. Grand Plaza Hotel"
                        />
                    </div>

                    {/* City */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">City *</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-apple-blue/50 rounded-xl outline-none transition-all placeholder:text-gray-400"
                            placeholder="e.g. New York"
                        />
                    </div>

                    {/* Location */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Location / Address</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-apple-blue/50 rounded-xl outline-none transition-all placeholder:text-gray-400"
                            placeholder="Full address"
                        />
                    </div>

                    {/* Contact Person 1 */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Contact Person *</label>
                        <input
                            type="text"
                            name="person"
                            value={formData.person}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-apple-blue/50 rounded-xl outline-none transition-all placeholder:text-gray-400"
                            placeholder="Name"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Contact Number</label>
                        <input
                            type="text"
                            name="personContact"
                            value={formData.personContact}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-apple-blue/50 rounded-xl outline-none transition-all placeholder:text-gray-400"
                            placeholder="+1 234 567 890"
                        />
                    </div>

                    {/* Contact Person 2 */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Secondary Contact Person</label>
                        <input
                            type="text"
                            name="person2"
                            value={formData.person2}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-apple-blue/50 rounded-xl outline-none transition-all placeholder:text-gray-400"
                            placeholder="Name (Optional)"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Secondary Contact Number</label>
                        <input
                            type="text"
                            name="personContact2"
                            value={formData.personContact2}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-apple-blue/50 rounded-xl outline-none transition-all placeholder:text-gray-400"
                            placeholder="Optional"
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email Address *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-apple-blue/50 rounded-xl outline-none transition-all placeholder:text-gray-400"
                            placeholder="contact@venue.com"
                        />
                    </div>

                    {/* Email 2 */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Secondary Email Address</label>
                        <input
                            type="email"
                            name="email2"
                            value={formData.email2}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-apple-blue/50 rounded-xl outline-none transition-all placeholder:text-gray-400"
                            placeholder="Optional"
                        />
                    </div>

                    {/* Rooms Slider */}
                    <div className="space-y-4 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">No of Rooms: {formData.rooms}</label>
                        <div className="px-2">
                            <RangeSlider
                                min={0}
                                max={600}
                                onChange={handleRoomsChange}
                            // We can't easily control the internal state of RangeSlider fully from here
                            // because it maintains its own 'currentMax' state.
                            // But it's close enough for this MVP.
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            'Submit Venue'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VenueForm;
