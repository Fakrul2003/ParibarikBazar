import React from 'react';
import { Head, Link } from '@inertiajs/react';
import ProductCard from '@/components/myProduct/ProductCard';
import Navbar from '@/components/myProduct/Navbar';

export default function CategoryShow({ categoryName, products, auth }: { categoryName: string, products: any[], auth: any }) {
    return (
        <>
            <Head title={`${categoryName} Products`} />
            <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-neutral-950 dark:text-white">
                <Navbar auth={auth} />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold bg-red-600 text-white px-4 py-1.5 rounded-lg">
                            {categoryName}
                        </h1>
                        <Link href="/" className="text-sm font-semibold text-green-500 hover:underline">
                            ← হোম পেজে ফিরে যান
                        </Link>
                    </div>

                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {products.map((product: any) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-10">এই ক্যাটাগরিতে কোনো প্রোডাক্ট পাওয়া যায়নি।</p>
                    )}
                </main>
            </div>
        </>
    );
}
