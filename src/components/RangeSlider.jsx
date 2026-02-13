import { useState, useEffect, useRef } from 'react';

const RangeSlider = ({ min, max, onChange }) => {
    const [minVal, setMinVal] = useState(min);
    const [maxVal, setMaxVal] = useState(max);
    const minValRef = useRef(min);
    const maxValRef = useRef(max);
    const range = useRef(null);

    // Convert to percentage
    const getPercent = (value) => Math.round(((value - min) / (max - min)) * 100);

    // Set width of the range to decrease from the left side
    useEffect(() => {
        const minPercent = getPercent(minVal);
        const maxPercent = getPercent(maxValRef.current);

        if (range.current) {
            range.current.style.left = `${minPercent}%`;
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [minVal, min, max]);

    // Set width of the range to decrease from the right side
    useEffect(() => {
        const minPercent = getPercent(minValRef.current);
        const maxPercent = getPercent(maxVal);

        if (range.current) {
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [maxVal, min, max]);

    return (
        <div className="relative w-full max-w-[200px] h-auto flex flex-col items-center justify-center py-4">
            <input
                type="range"
                min={min}
                max={max}
                value={minVal}
                onChange={(event) => {
                    const value = Math.min(Number(event.target.value), maxVal - 1);
                    setMinVal(value);
                    minValRef.current = value;
                    onChange(value, maxVal);
                }}
                className="thumb thumb--left pointer-events-none absolute h-0 w-full outline-none z-[3]"
                style={{ zIndex: minVal > max - 100 && "5" }}
            />
            <input
                type="range"
                min={min}
                max={max}
                value={maxVal}
                onChange={(event) => {
                    const value = Math.max(Number(event.target.value), minVal + 1);
                    setMaxVal(value);
                    maxValRef.current = value;
                    onChange(minVal, value);
                }}
                className="thumb thumb--right pointer-events-none absolute h-0 w-full outline-none z-[4]"
            />

            <div className="relative w-full">
                <div className="absolute h-1.5 w-full rounded-full bg-gray-200 z-[1]" />
                <div
                    ref={range}
                    className="absolute h-1.5 rounded-full bg-apple-blue z-[2]"
                />
                <div className="absolute top-4 left-0 text-xs text-gray-500 font-medium">
                    {minVal}
                </div>
                <div className="absolute top-4 right-0 text-xs text-gray-500 font-medium">
                    {maxVal}
                </div>
                <div className="absolute -top-5 w-full text-center text-xs text-apple-text font-semibold">
                    Rooms
                </div>
            </div>
            <div className="flex items-center justify-between w-full mt-8 gap-3">
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Min</span>
                    <input
                        type="number"
                        min={min}
                        max={maxVal - 1}
                        value={minVal}
                        onChange={(e) => {
                            const value = Math.max(Number(e.target.value), min);
                            // Allow typing but clamp for safety on blur or submit if needed
                            // For now, instant update with limit
                            const clamped = Math.min(value, maxVal - 1);
                            setMinVal(clamped);
                            minValRef.current = clamped;
                            onChange(clamped, maxVal);
                        }}
                        className="w-20 pl-8 pr-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-apple-blue transition-colors text-center"
                    />
                </div>
                <div className="w-2 h-0.5 bg-gray-200 rounded-full"></div>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Max</span>
                    <input
                        type="number"
                        min={minVal + 1}
                        max={max}
                        value={maxVal}
                        onChange={(e) => {
                            const value = Math.min(Number(e.target.value), max);
                            const clamped = Math.max(value, minVal + 1);
                            setMaxVal(clamped);
                            maxValRef.current = clamped;
                            onChange(minVal, clamped);
                        }}
                        className="w-20 pl-8 pr-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-apple-blue transition-colors text-center"
                    />
                </div>
            </div>
        </div>
    );
};

export default RangeSlider;
