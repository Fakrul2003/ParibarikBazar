import React, { useState, useRef, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';

interface NavbarProps {
    auth?: {
        user?: {
            name: string;
            email: string;
        };
    };
}

export default function Navbar({ auth }: NavbarProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isMoreOpen, setIsMoreOpen] = useState(false); // More ড্রপডাউনের জন্য স্টেট

    const dropdownRef = useRef<HTMLDivElement>(null);
    const moreDropdownRef = useRef<HTMLDivElement>(null); // More ড্রপডাউন রেফারেন্স

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        router.get('/', { search: query }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.get('/', { search: searchQuery }, { preserveState: true });
        }
    };

    // বাইরে ক্লিক করলে ড্রপডাউন বন্ধ করার হ্যান্ডলার
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
            if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target as Node)) {
                setIsMoreOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 shadow-sm relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">Fakhrul<span className="text-red-700">Mart</span></span>

                <div className="flex-1 max-w-xl mx-8">
                    <form onSubmit={handleSearch} className="relative w-full">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search for products, brands and more..."
                            className="w-full pl-4 pr-10 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-green-500 text-sm text-white placeholder-neutral-400"
                        />
                        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </button>
                    </form>
                </div>

                <nav className="flex items-center gap-3">
                    {auth?.user ? (
                        <div className="flex items-center gap-3">
                            {/* ইউজার প্রোপাইল ড্রপডাউন */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="flex items-center gap-3 focus:outline-none cursor-pointer bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-xl border border-neutral-700 transition"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-green-600 text-white flex items-center justify-center font-bold text-xs uppercase">
                                        {auth.user.name ? auth.user.name.charAt(0) : 'U'}
                                    </div>
                                    <div className="text-left hidden sm:block">
                                        <p className="text-xs font-semibold text-white leading-tight">{auth.user.name}</p>
                                        <p className="text-[10px] text-neutral-400 leading-tight">{auth.user.email}</p>
                                    </div>
                                    <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </button>

                                {isOpen && (
                                    <div className="absolute right-0 mt-2 w-64 bg-neutral-900 text-white rounded-xl shadow-2xl border border-neutral-800 py-2 z-50">
                                        <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-800">
                                            <div className="w-10 h-10 rounded-lg bg-neutral-800 text-white flex items-center justify-center font-bold text-sm uppercase">
                                                {auth.user.name ? auth.user.name.charAt(0) : 'U'}
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-sm font-semibold truncate">{auth.user.name}</p>
                                                <p className="text-xs text-neutral-400 truncate">{auth.user.email}</p>
                                            </div>
                                        </div>

                                        <div className="border-t border-neutral-800 pt-1">
                                            <Link
                                                href="/logout"
                                                method="post"
                                                as="button"
                                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-neutral-800 hover:text-red-300 transition text-left cursor-pointer"
                                            >
                                                Log out
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Link href="/dashboard" className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition">
                                Dashboard
                            </Link>

                            {/* নতুন More ড্রপডাউন মেনু (৩ ডট বা আইকন সহ) */}
                            <div className="relative" ref={moreDropdownRef}>
                                <button
                                    onClick={() => setIsMoreOpen(!isMoreOpen)}
                                    className="flex flex-col items-center justify-center px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl text-orange-500 transition cursor-pointer"
                                    title="More Options"
                                >
                                    {/* ৩ লাইন / ড্রপডাউন আইকন */}
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h10M4 18h7"></path>
                                    </svg>
                                    <span className="text-[10px] font-bold leading-tight">More</span>
                                </button>

                                {isMoreOpen && (
                                    <div className="absolute right-0 mt-2 w-52 bg-neutral-900 text-white rounded-xl shadow-2xl border border-neutral-800 py-2 z-50">
                                        <Link href="/about" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-neutral-800 transition">
                                            <span>📋</span> About Us
                                        </Link>
                                        <Link href="/wishlists" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-neutral-800 transition">
                                            <span>❤️</span> Wishlists
                                        </Link>
                                        <Link href="/faqs" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-neutral-800 transition">
                                            <span>❓</span> Faqs
                                        </Link>
                                        <a href="tel:+8801987668401" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-neutral-800 transition">
                                            <span>📞</span> Call Us
                                        </a>
                                        <a href="https://wa.me/+8801987668401" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-neutral-800 transition">
                                            <span>💬</span> WhatsApp
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-green-500 transition">
                                Sign In
                            </Link>
                            <Link href="/register" className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition">
                                Register
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}
