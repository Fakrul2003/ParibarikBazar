import { Head, Link, usePage, useForm, router } from '@inertiajs/react';
import React, { useState, useRef, useEffect } from 'react';
import ProductCard from '@/components/myProduct/ProductCard';
import Navbar from '@/components/myProduct/Navbar';
import BannerSlider from '@/components/myProduct/BannerSlider';
import Footer from '@/components/myProduct/Footer';
import AddProductModal from '@/components/myProduct/AddProductModal';
import AddBannerModal from '@/components/myProduct/AddBannerModal';

// ইন্টারফেসগুলো আগের মতোই থাকবে...
interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    image: string;
    image_2?: string;
    image_3?: string;
}

interface Banner {
    id: number;
    image: string;
}

interface PageProps {
    auth?: { user: any };
    products: Product[];
    banners?: Banner[];
    [key: string]: any;
}

export default function Welcome() {
    const { auth, products, banners = [] } = usePage<PageProps>().props;
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const modalRef = useRef<HTMLDivElement>(null);

    const isAdmin = true;
    // const isAdmin = auth?.user && auth.user.role === 'admin';

    const { data, setData, post, processing, reset } = useForm({
        name: '',
        category: '',
        price: '',
        stock: '',
        image: null as File | null,
        image_2: null as File | null,
        image_3: null as File | null,
    });

    const bannerForm = useForm({
        image: null as File | null,
    });

    const handleAddProduct = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/product/store', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                alert('প্রোডাক্ট সফলভাবে যোগ করা হয়েছে');
                setIsAddModalOpen(false);
                reset();
            },
            onError: (errors) => {
                console.error("Errors:", errors);
                alert('প্রোডাক্ট যোগ করতে সমস্যা হয়েছে। কনসোল চেক করুন।');
            }
        });
    };

    const handleAddBanner = (e: React.FormEvent) => {
        e.preventDefault();
        bannerForm.post('/admin/banner/store', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                alert('Banner created successfully');
                setIsBannerModalOpen(false);
                bannerForm.reset();
            },
            onError: (errors) => {
                console.error("Errors", errors);
                alert('ব্যানার যোগ করতে সমস্যা হয়েছে');
            }
        });
    };

    const groupedProducts = (products || []).reduce((acc: { [key: string]: Product[] }, product) => {
        const cat = product.category || 'General';
        if (!acc[cat]) {
            acc[cat] = [];
        }
        acc[cat].push(product);
        return acc;
    }, {});

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && modalRef.current === event.target){
                 setIsAddModalOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            <Head title="Welcome - E-commerce" />

            <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 dark:text-white">
               <Navbar auth={auth} />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <BannerSlider banners={banners} isAdmin={isAdmin} onOpenBannerModal={() => setIsBannerModalOpen(true)} />

                    <div className="mr-1.5 flex justify-end items-end gap-3 mb-4">
                        {isAdmin && (
                            <>
                                <button
                                    onClick={() => setIsBannerModalOpen(true)}
                                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition cursor-pointer"
                                >
                                    + Add Banner
                                </button>
                                <button
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg transition cursor-pointer"
                                >
                                    + Add Product
                                </button>
                            </>
                        )}
                    </div>

                    {Object.keys(groupedProducts).length > 0 ? (
                        Object.keys(groupedProducts).map((categoryName) => {
                            const productsInCategory = groupedProducts[categoryName];
                            const displayedProducts = productsInCategory.slice(0, 2);

                            return (
                                <div key={categoryName} className="mb-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="inline-block bg-red-600 text-white px-4 py-1.5 rounded-lg font-bold text-lg shadow">
                                            {categoryName}
                                        </div>

                                        {productsInCategory.length > 2 && (
                                            <Link
                                                href={`/category/${categoryName}`}
                                                className="text-sm font-semibold text-green-500 hover:underline cursor-pointer"
                                            >
                                                See All
                                            </Link>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {displayedProducts.map((product) => (
                                            <ProductCard key={product.id} product={product} auth={auth} isAdmin={isAdmin} />
                                        ))}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-gray-500 text-center py-10">কোনো প্রোডাক্ট পাওয়া যায়নি।</p>
                    )}
                </main>
            </div>

            {/* নতুন ব্যানার মোডাল কম্পোনেন্ট */}
            <AddBannerModal
                isOpen={isBannerModalOpen}
                onClose={() => setIsBannerModalOpen(false)}
                bannerForm={bannerForm}
                onSubmit={handleAddBanner}
            />

            {/* নতুন প্রোডাক্ট মোডাল কম্পোনেন্ট */}
            <AddProductModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                data={data}
                setData={setData}
                onSubmit={handleAddProduct}
                processing={processing}
                modalRef={modalRef}
            />

            <Footer />
        </>
    );
}
