import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { X, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

export interface ProductItem {
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

interface EditProductModalProps {
    product: ProductItem | null;
    isOpen: boolean;
    onClose: () => void;
}

export interface ParsedSize {
    size: string;
    isOutOfStock: boolean;
}

export function parseProductSizes(sizesStr?: string): ParsedSize[] {
    if (!sizesStr || !sizesStr.trim()) return [];
    try {
        const parsed = JSON.parse(sizesStr);
        if (Array.isArray(parsed)) {
            return parsed.map((item) => {
                if (typeof item === 'string') {
                    const isOut = item.toLowerCase().includes('out of stock') || item.includes('স্টক শেষ');
                    const cleanName = item.replace(/\s*\((?:Out of [Ss]tock|স্টক শেষ)\)/gi, '').trim();
                    return { size: cleanName, isOutOfStock: isOut };
                }
                return {
                    size: item.size || item.name || '',
                    isOutOfStock: Boolean(item.isOutOfStock || item.outOfStock || item.stock === 0),
                };
            }).filter(s => Boolean(s.size));
        } else if (typeof parsed === 'object' && parsed !== null) {
            return Object.entries(parsed).map(([key, val]: [string, any]) => {
                if (typeof val === 'boolean') {
                    return { size: key, isOutOfStock: val };
                }
                if (typeof val === 'object' && val !== null) {
                    return { size: key, isOutOfStock: Boolean(val.isOutOfStock || val.outOfStock || val.stock === 0) };
                }
                return { size: key, isOutOfStock: Number(val) === 0 };
            });
        }
    } catch {
        return sizesStr.split(',').map((s) => {
            const trimS = s.trim();
            const isOut = trimS.toLowerCase().includes('out of stock') || trimS.includes('স্টক শেষ');
            const cleanName = trimS.replace(/\s*\((?:Out of [Ss]tock|স্টক শেষ)\)/gi, '').trim();
            return { size: cleanName, isOutOfStock: isOut };
        }).filter(s => Boolean(s.size));
    }
    return [];
}

export default function EditProductModal({ product, isOpen, onClose }: EditProductModalProps) {
    if (!isOpen || !product) return null;

    const [sizeList, setSizeList] = useState<ParsedSize[]>([]);
    const [newSizeInput, setNewSizeInput] = useState('');

    const { data, setData, post, processing, reset } = useForm({
        name: product.name || '',
        category: product.category || '',
        price: product.price || 0,
        stock: product.stock || 0,
        sizes: product.sizes || '',
        image: null as File | null,
        image_2: null as File | null,
        image_3: null as File | null,
    });

    useEffect(() => {
        if (product && isOpen) {
            const parsed = parseProductSizes(product.sizes);
            setSizeList(parsed);
            setData({
                name: product.name || '',
                category: product.category || '',
                price: product.price || 0,
                stock: product.stock || 0,
                sizes: product.sizes || '',
                image: null,
                image_2: null,
                image_3: null,
            });
        }
    }, [product?.id, product?.sizes, product?.name, product?.price, product?.stock, isOpen]);

    const handleAddSize = () => {
        if (!newSizeInput.trim()) return;
        const exists = sizeList.some(s => s.size.toLowerCase() === newSizeInput.trim().toLowerCase());
        if (!exists) {
            const updated = [...sizeList, { size: newSizeInput.trim(), isOutOfStock: false }];
            setSizeList(updated);
            updateSizesData(updated);
        }
        setNewSizeInput('');
    };

    const handleToggleStock = (index: number) => {
        const updated = [...sizeList];
        updated[index].isOutOfStock = !updated[index].isOutOfStock;
        setSizeList(updated);
        updateSizesData(updated);
    };

    const handleRemoveSize = (index: number) => {
        const updated = sizeList.filter((_, idx) => idx !== index);
        setSizeList(updated);
        updateSizesData(updated);
    };

    const updateSizesData = (sizes: ParsedSize[]) => {
        const jsonString = sizes.length > 0 ? JSON.stringify(sizes) : '';
        setData('sizes', jsonString);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        post(`/admin/product/${product.id}/update`, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                alert('প্রোডাক্ট সফলভাবে আপডেট করা হয়েছে!');
                onClose();
            },
            onError: (errors) => {
                console.error('Update product error:', errors);
                alert('প্রোডাক্ট আপডেট করতে সমস্যা হয়েছে।');
            }
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl text-gray-900 dark:text-white my-8 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4 border-b pb-3 border-gray-100 dark:border-neutral-800">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">প্রোডাক্ট এডিট করুন</h2>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold mb-1">প্রোডাক্টের নাম</label>
                        <input
                            type="text"
                            required
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full px-3.5 py-2 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold mb-1">ক্যাটাগরি</label>
                            <input
                                type="text"
                                required
                                value={data.category}
                                onChange={(e) => setData('category', e.target.value)}
                                className="w-full px-3.5 py-2 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold mb-1">দাম (BDT)</label>
                            <input
                                type="number"
                                required
                                step="0.01"
                                value={data.price}
                                onChange={(e) => setData('price', Number(e.target.value))}
                                className="w-full px-3.5 py-2 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold mb-1">মোট স্টক (Total Stock)</label>
                        <input
                            type="number"
                            required
                            value={data.stock}
                            onChange={(e) => setData('stock', Number(e.target.value))}
                            className="w-full px-3.5 py-2 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-sm"
                        />
                    </div>

                    {/* সাইজ ও স্টক স্ট্যাটাস ম্যানেজমেন্ট সেকশন */}
                    <div className="bg-gray-50 dark:bg-neutral-800/60 p-4 rounded-xl border border-gray-200/80 dark:border-neutral-700">
                        <label className="block text-xs font-bold mb-2 text-emerald-600 dark:text-emerald-400">
                            সাইজ ও স্টক স্ট্যাটাস (Size Availability Management)
                        </label>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-3">
                            এখানে যে সাইজের স্টক শেষ (Out of stock) করে দিবেন, ইউজার অর্ডার করার সময় সেই সাইজের কোয়ান্টিটি বাড়াইতে পারবে না।
                        </p>

                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={newSizeInput}
                                onChange={(e) => setNewSizeInput(e.target.value)}
                                placeholder="নতুন সাইজ দিন (যেমন: 39, 40, XL)"
                                className="flex-1 px-3 py-1.5 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg text-xs"
                            />
                            <button
                                type="button"
                                onClick={handleAddSize}
                                className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-1 cursor-pointer"
                            >
                                <Plus className="w-3.5 h-3.5" /> যুক্ত করুন
                            </button>
                        </div>

                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {sizeList.length > 0 ? (
                                sizeList.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-white dark:bg-neutral-800 p-2 rounded-lg border border-gray-200/60 dark:border-neutral-700 text-xs">
                                        <span className="font-bold text-gray-800 dark:text-gray-200">
                                            সাইজ: {item.size}
                                        </span>

                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleToggleStock(idx)}
                                                className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition flex items-center gap-1 cursor-pointer ${
                                                    item.isOutOfStock
                                                        ? 'bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300 border border-red-300'
                                                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300'
                                                }`}
                                            >
                                                {item.isOutOfStock ? (
                                                    <>
                                                        <AlertCircle className="w-3 h-3 text-red-500" /> স্টক শেষ (Out of Stock)
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle2 className="w-3 h-3 text-emerald-500" /> স্টকে আছে (In Stock)
                                                    </>
                                                )}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSize(idx)}
                                                className="p-1 text-gray-400 hover:text-red-500 transition cursor-pointer"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-[11px] text-gray-400 text-center py-2">কোনো নির্দিষ্ট সাইজ নেই।</p>
                            )}
                        </div>
                    </div>

                    {/* ছবিসমূহ */}
                    <div className="space-y-2">
                        <div>
                            <label className="block text-xs font-bold mb-1">প্রধান ছবি (Image 1)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('image', e.target.files ? e.target.files[0] : null)}
                                className="w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold mb-1">দ্বিতীয় ছবি (Image 2)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('image_2', e.target.files ? e.target.files[0] : null)}
                                className="w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold mb-1">তৃতীয় ছবি (Image 3)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('image_3', e.target.files ? e.target.files[0] : null)}
                                className="w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-neutral-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-100 dark:bg-neutral-800 rounded-xl text-xs font-semibold cursor-pointer"
                        >
                            বাতিল
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 cursor-pointer"
                        >
                            {processing ? 'আপডেট হচ্ছে...' : 'আপডেট সেভ করুন'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
