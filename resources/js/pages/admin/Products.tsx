import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Package, Plus, Image as ImageIcon, Search, Tag, DollarSign, Layers } from 'lucide-react';

interface ProductItem {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    sizes?: string;
    image?: string;
    image_2?: string;
    image_3?: string;
}

interface Props {
    products: ProductItem[];
}

export default function Products({ products = [] }: Props) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        category: '',
        price: '',
        stock: '',
        sizes: '',
        image: null as File | null,
        image_2: null as File | null,
        image_3: null as File | null,
    });

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/product/store', {
            onSuccess: () => {
                setIsAddModalOpen(false);
                reset();
                alert('Product added successfully!');
            }
        });
    };

    const getImageUrl = (img?: string) => {
        if (!img) return null;
        if (img.startsWith('http') || img.startsWith('/storage/')) {
            return img;
        }
        return `/storage/${img}`;
    };

    return (
        <AdminLayout title="Products Inventory">
            <Head title="Products Inventory - Admin Portal" />

            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Products Inventory</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage catalog, pricing, sizes, and stock availability.</p>
                </div>

                <button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-600/20 transition cursor-pointer"
                >
                    <Plus className="w-4 h-4" /> Add New Product
                </button>
            </div>

            {/* Search Filter */}
            <div className="mb-6 relative max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Filter products by name or category..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-xs"
                />
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200/80 dark:border-neutral-800 overflow-hidden shadow-xs flex flex-col justify-between">
                        <div>
                            <div className="relative h-48 bg-gray-100 dark:bg-neutral-800">
                                {product.image ? (
                                    <img
                                        src={getImageUrl(product.image)!}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <ImageIcon className="w-8 h-8 opacity-40" />
                                    </div>
                                )}
                                <span className="absolute top-3 right-3 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold text-gray-800 dark:text-gray-200 border border-gray-200/50">
                                    Stock: {product.stock}
                                </span>
                            </div>

                            <div className="p-4">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                                    {product.category}
                                </span>
                                <h3 className="font-bold text-base text-gray-900 dark:text-white mt-1.5 line-clamp-1">{product.name}</h3>
                                {product.sizes && (
                                    <p className="text-xs text-gray-500 mt-1">Sizes: {product.sizes}</p>
                                )}
                            </div>
                        </div>

                        <div className="p-4 pt-0 border-t border-gray-100 dark:border-neutral-800/80 mt-2 flex items-center justify-between">
                            <span className="text-lg font-bold text-gray-900 dark:text-white">৳ {product.price}</span>
                            <span className="text-xs text-emerald-600 font-semibold">Active</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Product Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl text-gray-900 dark:text-white my-8">
                        <div className="flex items-center justify-between mb-4 border-b pb-3 border-gray-100 dark:border-neutral-800">
                            <h2 className="text-lg font-bold">Add New Product</h2>
                            <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold mb-1">Product Name</label>
                                <input
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Nike Air Max Shoes"
                                    className="w-full px-3.5 py-2 bg-gray-50 dark:bg-neutral-800 border rounded-xl text-sm"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold mb-1">Category</label>
                                    <input
                                        type="text"
                                        required
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                        placeholder="Shoes / Clothes"
                                        className="w-full px-3.5 py-2 bg-gray-50 dark:bg-neutral-800 border rounded-xl text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold mb-1">Price (BDT)</label>
                                    <input
                                        type="number"
                                        required
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        placeholder="1250"
                                        className="w-full px-3.5 py-2 bg-gray-50 dark:bg-neutral-800 border rounded-xl text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold mb-1">Stock Quantity</label>
                                    <input
                                        type="number"
                                        required
                                        value={data.stock}
                                        onChange={(e) => setData('stock', e.target.value)}
                                        placeholder="50"
                                        className="w-full px-3.5 py-2 bg-gray-50 dark:bg-neutral-800 border rounded-xl text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold mb-1">Sizes (Comma Separated)</label>
                                    <input
                                        type="text"
                                        value={data.sizes}
                                        onChange={(e) => setData('sizes', e.target.value)}
                                        placeholder="39, 40, 41, 42"
                                        className="w-full px-3.5 py-2 bg-gray-50 dark:bg-neutral-800 border rounded-xl text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold mb-1">Primary Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('image', e.target.files ? e.target.files[0] : null)}
                                    className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 bg-gray-100 dark:bg-neutral-800 rounded-xl text-xs font-semibold cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 cursor-pointer"
                                >
                                    {processing ? 'Saving...' : 'Save Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
