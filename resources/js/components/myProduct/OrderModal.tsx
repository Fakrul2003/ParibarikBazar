import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

interface Product {
    id: number;
    name: string;
    price: number;
    sizes?: string;
}

interface OrderModalProps {
    product: Product;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    auth?: { user: any };
    initialQuantity?: number;
}

export default function OrderModal({ product, isOpen, setIsOpen, auth, initialQuantity = 1 }: OrderModalProps) {
    // প্রতিটি সাইজের জন্য আলাদা পরিমাণ ট্র্যাক করতে স্টেট ব্যবহার করা হলো (যেমন: { '39': 1, '40': 2 })
    const [sizeQuantities, setSizeQuantities] = useState<{ [key: string]: number }>({});

    const sizesList = product.sizes ? product.sizes.split(',').map((s) => s.trim()).filter(Boolean) : [];

    const { data, setData, post, processing, reset } = useForm({
        product_id: product.id,
        name: auth?.user ? auth.user.name : '',
        address: '',
        phone: '',
        sizes_data: '', // JSON ফরম্যাটে সাইজ ও পরিমাণের তথ্য যাবে
        size_data: '',
        total_price: product.price * initialQuantity,
        quantity: initialQuantity,
    });

    if (!isOpen) return null;

    // পরিমাণ বাড়ানোর ফাংশন
    const handleIncrement = (size: string) => {
        const currentQty = sizeQuantities[size] || 0;
        const updated = { ...sizeQuantities, [size]: currentQty + 1 };
        setSizeQuantities(updated);
        updateTotals(updated);
    };

    // পরিমাণ কমানোর ফাংশন
    const handleDecrement = (size: string) => {
        const currentQty = sizeQuantities[size] || 0;
        if (currentQty > 0) {
            const updated = { ...sizeQuantities, [size]: currentQty - 1 };
            if (updated[size] === 0) delete updated[size];
            setSizeQuantities(updated);
            updateTotals(updated);
        }
    };

    // মোট পরিমাণ এবং মোট দাম হিসাব করার ফাংশন
    const updateTotals = (updatedSizes: { [key: string]: number }) => {
        let totalQty = 0;
        Object.values(updatedSizes).forEach((qty) => {
            totalQty += qty;
        });

        const jsonString = Object.keys(updatedSizes).length > 0 ? JSON.stringify(updatedSizes) : '';
        const totalPrice = (totalQty > 0 ? totalQty : initialQuantity) * product.price;

        setData((prev) => ({
            ...prev,
            quantity: totalQty > 0 ? totalQty : initialQuantity,
            total_price: totalPrice,
            sizes_data: jsonString,
            size_data: jsonString,
        }));
    };

    const calculateSubtotal = () => {
        let totalQty = 0;
        Object.values(sizeQuantities).forEach((qty) => {
            totalQty += qty;
        });
        if (totalQty === 0 && sizesList.length === 0) {
            return product.price * initialQuantity;
        }
        return totalQty * product.price;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (sizesList.length > 0 && Object.keys(sizeQuantities).length === 0) {
            alert('দয়া করে অন্তত একটি সাইজ এবং পরিমাণ নির্বাচন করুন!');
            return;
        }

        post('/order/store', {
            onSuccess: () => {
                alert('অর্ডার সফলভাবে সম্পন্ন হয়েছে!');
                setIsOpen(false);
                reset();
                setSizeQuantities({});
            },
        });
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 w-full max-w-lg shadow-xl text-white my-8">
                <h2 className="text-xl font-bold mb-4">অর্ডার কনফার্ম করুন: {product.name}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-neutral-300">আপনার নাম</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-lg bg-neutral-800 border-neutral-700 text-white"
                            placeholder="পূর্ণ নাম লিখুন"
                        />
                    </div>

                    {/* সাইজ এবং প্লাস-মাইনাস কাউন্টার সেকশন */}
                    {sizesList.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium mb-2 text-neutral-300">সাইজ ও পরিমাণ নির্বাচন করুন</label>
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                {sizesList.map((size, index) => {
                                    const qty = sizeQuantities[size] || 0;
                                    return (
                                        <div key={index} className="flex items-center justify-between bg-neutral-800 p-2 rounded-lg border border-neutral-700">
                                            <span className="font-semibold bg-neutral-700 px-3 py-1 rounded">সাইজ: {size}</span>
                                            <span className="text-sm text-green-400">৳ {product.price * qty}</span>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => handleDecrement(size)}
                                                    className="w-8 h-8 bg-neutral-700 hover:bg-neutral-600 rounded-full flex items-center justify-center text-lg font-bold"
                                                >
                                                    -
                                                </button>
                                                <span className="w-6 text-center font-bold">{qty}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleIncrement(size)}
                                                    className="w-8 h-8 bg-green-600 hover:bg-green-500 rounded-full flex items-center justify-center text-lg font-bold"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* সাবটোটাল সেকশন */}
                            <div className="flex justify-between items-center bg-neutral-800/80 p-3 rounded-lg mt-3 border border-neutral-700">
                                <span className="font-bold text-neutral-300">Subtotal</span>
                                <span className="font-bold text-green-400 text-lg">BDT {calculateSubtotal().toFixed(2)}</span>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-1 text-neutral-300">ঠিকানা</label>
                        <textarea
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-lg bg-neutral-800 border-neutral-700 text-white"
                            placeholder="আপনার ডেলিভারি ঠিকানা"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-neutral-300">মোবাইল নম্বর (Phone)</label>
                        <input
                            type="text"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-lg bg-neutral-800 border-neutral-700 text-white"
                            placeholder="আপনার মোবাইল নম্বর দিন"
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm cursor-pointer"
                        >
                            বাতিল
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium cursor-pointer"
                        >
                            {processing ? 'অর্ডার হচ্ছে...' : 'কনফার্ম অর্ডার'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
