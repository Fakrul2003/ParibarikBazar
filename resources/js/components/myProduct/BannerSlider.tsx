import React, { useState, useEffect } from 'react';

interface Banner {
    id: number;
    image: string;
}

interface BannerSliderProps {
    banners: Banner[];
    isAdmin: boolean;
    onOpenBannerModal: () => void;
}

const resolveBannerImageUrl = (image?: string) => {
    if (!image) return 'https://placehold.co/1200x400/1f2937/ffffff?text=No+Banner';
    if (image.startsWith('http') || image.startsWith('/')) return image;
    if (image.startsWith('storage/')) return `/${image}`;
    return `/storage/${image}`;
};

export default function BannerSlider({ banners, isAdmin, onOpenBannerModal }: BannerSliderProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    // অটো স্লাইড ইফেক্ট (প্রতি ৩ সেকেন্ড পর পর ছবি পরিবর্তন হবে)
    useEffect(() => {
        if (banners.length === 0) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
        }, 3000);
        return () => clearInterval(interval);
    }, [banners.length]);

    return (
        <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-md mb-6 bg-neutral-800 flex items-center justify-center group">
            {banners.length > 0 ? (
                <>
                    <img
                        src={resolveBannerImageUrl(banners[currentSlide]?.image)}
                        alt="Banner"
                        className="w-full h-full object-cover transition-all duration-500"
                        onError={(event) => {
                            event.currentTarget.src = 'https://placehold.co/1200x400/e5e7eb/6b7280?text=No+Banner';
                        }}
                    />

                    {/* বাম দিকের অ্যারো বাটন */}
                    <button
                        onClick={() => setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1))}
                        className="absolute left-4 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full cursor-pointer transition opacity-75 group-hover:opacity-100"
                    >
                        &#10094;
                    </button>

                    {/* ডান দিকের অ্যারো বাটন */}
                    <button
                        onClick={() => setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1))}
                        className="absolute right-4 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full cursor-pointer transition opacity-75 group-hover:opacity-100"
                    >
                        &#10095;
                    </button>

                    {/* নিচের গোল গোল ডট ইন্ডিকেটর */}
                    <div className="absolute bottom-4 flex gap-2">
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-3 h-3 rounded-full transition cursor-pointer ${
                                    currentSlide === index ? 'bg-white scale-125' : 'bg-white/50'
                                }`}
                            />
                        ))}
                    </div>
                </>
            ) : (
                <div className="text-gray-400 text-center flex flex-col items-center gap-2">
                    <p>কোনো ব্যানার ছবি নেই</p>
                </div>
            )}
        </div>
    );
}
