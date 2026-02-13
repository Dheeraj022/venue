import { motion } from 'framer-motion';

export const Hero = () => {
    return (
        <section className="relative w-full h-[60vh] flex flex-col items-center justify-center bg-gradient-to-b from-apple-gray to-white text-center px-4 overflow-hidden">
            {/* Subtle background element */}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl z-0" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 max-w-4xl"
            >
                <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-apple-dark mb-4">
                    Find Your Perfect Property
                </h1>
                <p className="text-xl md:text-2xl text-apple-text-secondary font-medium tracking-wide max-w-2xl mx-auto">
                    Live updated listings powered by real-time data.
                </p>
            </motion.div>
        </section>
    );
};
