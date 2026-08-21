import { Head, Link, usePage, useForm, router } from '@inertiajs/react';
import { login, register } from '@/routes';
import { useState, useRef, useEffect } from 'react';
import ProductCard from '@/components/myProduct/ProductCard';

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    image: string;
}

interface PageProps {
    auth?: { user: any };
    products: Product[];
    [key: string]: any;
}

export default function Welcome() {
    const { auth, products } = usePage<PageProps>().props;
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // const isAdmin = auth?.user?.role === 'admin';
    const isAdmin = true;

    // নতুন প্রোডাক্ট অ্যাড করার ফর্ম (অ্যাডমিনের জন্য)
    const { data, setData, post, processing, reset } = useForm({
        name: '',
        category: '',
        price: '',
        stock: '',
        image: null as File | null,
    });

    const handleAddProduct = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/product/store', {
            preserveScroll: true,
            onSuccess: () => {
                alert('প্রোডাক্ট সফলভাবে যোগ করা হয়েছে');
                setIsAddModalOpen(false);
                reset();
            }
        });
    };

    // সার্চ হ্যান্ডেল করার ফাংশন
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.get('/', { search: searchQuery }, { preserveState: true });
        }
    };

    // ক্যাটাগরি অনুযায়ী প্রোডাক্টগুলো আলাদা করা
    const groupedProducts = products.reduce((acc: { [key: string]: Product[] }, product) => {
        const cat = product.category || 'General';
        if (!acc[cat]) {
            acc[cat] = [];
        }
        acc[cat].push(product);
        return acc;
    }, {});

    // বাইরে ক্লিক করলে ড্রপডাউন বন্ধ হয়ে যাবে
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            <Head title="Welcome - E-commerce" />

            <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-neutral-950 dark:text-white">
                {/* হেডার */}
                <header className="bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 shadow-sm relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

                        {/* লোগো */}
                        <span className="text-2xl font-bold text-green-600">MoveOn</span>

                        {/* বাম পাশের লাল বক্স: সার্চ বার */}
                        <div className="flex-1 max-w-xl mx-8">
                            <form onSubmit={handleSearch} className="relative w-full">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search for products, brands and more..."
                                    className="w-full pl-4 pr-10 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-green-500 text-sm text-white placeholder-neutral-400"
                                />
                                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                </button>
                            </form>
                        </div>

                        {/* ডান পাশের সেকশন */}
                        <nav className="flex items-center gap-3">
                            {auth?.user ? (
                                <div className="flex items-center gap-3">

                                    {/* ডান পাশের লাল বক্স: ইউজার প্রোফাইল ও ড্রপডাউন */}
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

                                        {/* ড্রপডাউন মেনু */}
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

                                                <div className="py-1">
                                                    <Link
                                                        href="/settings/profile"
                                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition"
                                                    >
                                                        Settings
                                                    </Link>
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

                                    {/* ড্যাশবোর্ড বাটন */}
                                    <Link href="/dashboard" className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition">
                                        Dashboard
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-3">
                                    <Link href={login()} className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-green-500 transition">
                                        Sign In
                                    </Link>
                                    <Link href={register()} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition">
                                        Register
                                    </Link>
                                </div>
                            )}
                        </nav>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* ব্যানার */}
                    <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-emerald-700 to-green-600 rounded-2xl p-8 text-white shadow-md mb-8">
                        <div>
                            <span className="bg-green-800 text-xs uppercase px-3 py-1 rounded-full font-semibold">মনসুন অফার</span>
                            <h1 className="text-4xl md:text-5xl font-extrabold mt-3">৮০% পর্যন্ত মূল্য ছাড়!</h1>
                        </div>

                        <div className="mt-4 md:mt-0">
                            {isAdmin ? (
                                <button
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg transition cursor-pointer"
                                >
                                    + Add Product
                                </button>
                            ) : (
                                <button
                                    onClick={() => alert('সব প্রোডাক্ট নিচে দেখানো হচ্ছে')}
                                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg transition cursor-pointer"
                                >
                                    See All
                                </button>
                            )}
                        </div>
                    </div>

                    {/* ক্যাটাগরি ভিত্তিক প্রোডাক্ট লিস্ট */}
                    {Object.keys(groupedProducts).length > 0 ? (
                        Object.keys(groupedProducts).map((categoryName) => (
                            <div key={categoryName} className="mb-10">
                                <div className="inline-block bg-red-600 text-white px-4 py-1.5 rounded-lg font-bold text-lg mb-4 shadow">
                                    {categoryName}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {groupedProducts[categoryName].map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-10">কোনো প্রোডাক্ট পাওয়া যায়নি।</p>
                    )}
                </main>
            </div>

            {/* অ্যাডমিনের জন্য প্রোডাক্ট অ্যাড করার মডাল */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 w-full max-w-md shadow-xl text-gray-900 dark:text-white">
                        <h2 className="text-xl font-bold mb-4">নতুন প্রোডাক্ট যোগ করুন</h2>

                        <form onSubmit={handleAddProduct} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">প্রোডাক্টের নাম</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">ক্যাটাগরি (Category)</label>
                                <input
                                    type="text"
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    required
                                    placeholder="যেমন: Electronics, Groceries"
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">দাম (Price)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">স্টক (Stock)</label>
                                <input
                                    type="number"
                                    value={data.stock}
                                    onChange={(e) => setData('stock', e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">ছবি (Image)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('image', e.target.files ? e.target.files[0] : null)}
                                    required
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
                                />
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(file => false)}
                                    className="px-4 py-2 bg-gray-300 dark:bg-neutral-700 rounded-lg text-sm cursor-pointer"
                                >
                                    বাতিল
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 cursor-pointer"
                                >
                                    {processing ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
