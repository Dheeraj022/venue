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
        <div className="relative w-full max-w-[200px] h-12 flex items-center justify-center">
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
        </div>
    );
};

export default RangeSlider;
