import { useState, useEffect, useRef } from 'react';



const RangeSlider = ({ min, max, onChange }) => {
    // We only control the upper slider (max value). Min is fixed at `min` (0).
    // Wait, if it's "Enter no of rooms", and default is 0-600, maybe we should start at max?
    // User said "slider automatically updates from 0 to that entered value".
    // If I start at 600, the bar is full. If I start at 0, the bar is empty.
    // The previous code passed `min` and `max` as initial state from props, but FilterBar passes 0 and 600. 
    // Let's assume we want to reflect the CURRENT `maxRooms` if passed, but here we only receive generic min/max for bounds.
    // Actually, FilterBar passes `onChange` but doesn't pass the *current* state back into the component? 
    // Use `useEffect` or checking props if I want it controlled. 
    // Looking at previous FilterBar code: `onChange={(min, max) => onRoomsChange(min, max)}`. 
    // It doesn't pass the current values down as props (controlled component standard). 
    // It only passes limits `min={0} max={600}`. 
    // So `RangeSlider` is uncontrolled regarding the parent's state, but initializes with its bounds.
    // I will initialize `currentMax` to `max` (600) so the filter includes all rooms by default? 
    // OR should it start at 0? "Types a single number... slider updates from 0 to entered".
    // Usually "Max Rooms" filter starts at Infinity (or Max). I'll stick to `max` (600) as initial state so it looks "open".

    // Correction: User said "slider automatically updates from 0 to that entered value". 
    // If I type 50, range is 0-50.

    const [currentMax, setCurrentMax] = useState(max);
    const range = useRef(null);

    // Convert to percentage
    const getPercent = (val) => Math.round(((val - min) / (max - min)) * 100);

    // Sync slider track width
    useEffect(() => {
        const maxPercent = getPercent(currentMax);
        if (range.current) {
            range.current.style.width = `${maxPercent}%`;
        }
    }, [currentMax, min, max]);

    // Handle change (syncs internal state and calls prop)
    const handleChange = (newMax) => {
        setCurrentMax(newMax);
        onChange(min, newMax); // Min is fixed at prop `min` (0)
    };

    return (
        <div className="flex flex-col w-full">
            <div className="relative w-full h-12 flex items-center justify-center">
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={currentMax}
                    onChange={(event) => {
                        const val = Math.min(Math.max(Number(event.target.value), min), max);
                        handleChange(val);
                    }}
                    className="thumb pointer-events-none absolute h-0 w-full outline-none z-[4]"
                />

                <div className="relative w-full">
                    <div className="absolute h-1.5 w-full rounded-full bg-gray-100 z-[1]" />
                    <div
                        ref={range}
                        className="absolute h-1.5 rounded-full bg-apple-blue shadow-sm z-[2] transition-all duration-100 ease-out"
                        style={{ width: '100%' }} // Initial render before effect
                    />
                </div>
            </div>

            <div className="mt-2">
                <input
                    type="number"
                    placeholder="Enter no of rooms"
                    value={currentMax === 0 ? '' : currentMax}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val === '') {
                            handleChange(0);
                            return;
                        }
                        const numVal = Number(val);
                        // Clamp value between min and max
                        const clamped = Math.min(Math.max(numVal, min), max);
                        handleChange(clamped);
                    }}
                    className="w-full px-4 py-2.5 bg-gray-50 hover:bg-gray-100 focus:bg-white border border-transparent focus:border-apple-blue/50 rounded-xl text-sm font-medium text-apple-text outline-none transition-all placeholder:text-gray-400 text-center"
                />
            </div>

            <div className="flex justify-between items-center mt-2 px-1">
                <span className="text-xs font-medium text-gray-400">{min}</span>
                <span className="text-xs font-medium text-gray-400">{max}</span>
            </div>

            <style jsx>{`
                .thumb::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    -webkit-tap-highlight-color: transparent;
                }

                .thumb {
                    pointer-events: none;
                    position: absolute;
                    height: 0;
                    width: 100%;
                    outline: none;
                }

                /* For Chrome browsers */
                .thumb::-webkit-slider-thumb {
                    background-color: white;
                    border: 1.5px solid #2563eb; /* apple-blue */
                    border-radius: 50%;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    cursor: pointer;
                    height: 20px;
                    width: 20px;
                    margin-top: 4px; /* Adjust based on track height */
                    pointer-events: all;
                    position: relative;
                    transition: transform 0.1s ease, box-shadow 0.1s ease;
                }

                .thumb::-webkit-slider-thumb:hover {
                    transform: scale(1.1);
                    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
                }

                .thumb::-webkit-slider-thumb:active {
                    transform: scale(0.95);
                    cursor: grabbing;
                }

                /* For Firefox browsers */
                .thumb::-moz-range-thumb {
                    background-color: white;
                    border: 1.5px solid #2563eb;
                    border-radius: 50%;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    cursor: pointer;
                    height: 20px;
                    width: 20px;
                    pointer-events: all;
                    position: relative;
                    transition: transform 0.1s ease, box-shadow 0.1s ease;
                }

                .thumb::-moz-range-thumb:hover {
                    transform: scale(1.1);
                    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
                }
            `}</style>
        </div>
    );
};

export default RangeSlider;
