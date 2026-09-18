import React from 'react';
import { useForm } from '@inertiajs/react';
import { parseProductSizes } from '@/components/myProduct/EditProductModal';

export interface SelectedVariantItem {
    color: string;
    colorImg?: string;
    size: string;
    quantity: number;
    price: number;
}

interface Product {
    id: number;
    name: string;
    price: number;
    sizes?: string;
    image?: string;
}

interface OrderModalProps {
    product: Product;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    auth?: { user: any };
    initialQuantity?: number;
    selectedVariants?: SelectedVariantItem[];
}

const EMPTY_VARIANTS: SelectedVariantItem[] = [];

export default function OrderModal({
    product,
    isOpen,
    setIsOpen,
    auth,
    initialQuantity = 1,
    selectedVariants = EMPTY_VARIANTS
}: OrderModalProps) {
    const sizesList = parseProductSizes(product.sizes);

    const hasMultiVariants = selectedVariants && selectedVariants.length > 0;

    const totalQty = hasMultiVariants
        ? selectedVariants.reduce((sum, item) => sum + item.quantity, 0)
        : initialQuantity;

    const totalPrice = hasMultiVariants
        ? selectedVariants.reduce((sum, item) => sum + item.quantity * item.price, 0)
        : product.price * initialQuantity;

    const sizesDataPayload = hasMultiVariants
        ? JSON.stringify({ variants: selectedVariants })
        : '';

    const { data, setData, post, processing, reset } = useForm({
        product_id: product.id,
        name: auth?.user ? auth.user.name : '',
        address: '',
        phone: '',
        sizes_data: sizesDataPayload,
        size_data: sizesDataPayload,
        total_price: totalPrice,
        quantity: totalQty,
    });

    // Update form state if props change
    React.useEffect(() => {
        const calculatedQty = hasMultiVariants
            ? selectedVariants.reduce((sum, item) => sum + item.quantity, 0)
            : initialQuantity;
        const calculatedTotal = hasMultiVariants
            ? selectedVariants.reduce((sum, item) => sum + item.quantity * item.price, 0)
            : product.price * initialQuantity;
        const jsonPayload = hasMultiVariants ? JSON.stringify({ variants: selectedVariants }) : '';

        setData((prev) => {
            if (
                prev.product_id === product.id &&
                prev.quantity === calculatedQty &&
                prev.total_price === calculatedTotal &&
                prev.sizes_data === jsonPayload
            ) {
                return prev;
            }
            return {
                ...prev,
                product_id: product.id,
                quantity: calculatedQty,
                total_price: calculatedTotal,
                sizes_data: jsonPayload,
                size_data: jsonPayload,
            };
        });
    }, [selectedVariants, initialQuantity, product.id, product.price]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (hasMultiVariants && totalQty === 0) {
            alert('দয়া করে অন্তত একটি প্রোডাক্ট ভ্যারিয়েন্ট ও পরিমাণ নির্বাচন করুন!');
            return;
        }

        post('/order/store', {
            onSuccess: () => {
                alert('অর্ডার সফলভাবে সম্পন্ন হয়েছে!');
                setIsOpen(false);
                reset();
            },
        });
    };

    return (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl text-white my-8">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
                    <h2 className="text-lg font-bold text-white">অর্ডার কনফার্ম করুন: {product.name}</h2>
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="text-neutral-400 hover:text-white transition cursor-pointer text-sm"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* গ্রাহকের তথ্য */}
                    <div>
                        <label className="block text-xs font-semibold mb-1 text-neutral-300">আপনার নাম</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            className="w-full px-3.5 py-2.5 border rounded-xl bg-neutral-800 border-neutral-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                            placeholder="আপনার পূর্ণ নাম লিখুন"
                        />
                    </div>

                    {/* সিলেক্ট করা কালার ও সাইজ ভ্যারিয়েন্ট সামারি */}
                    {hasMultiVariants ? (
                        <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 space-y-2.5">
                            <div className="flex justify-between items-center text-xs font-bold text-emerald-400 border-b border-neutral-800 pb-2">
                                <span>সিলেক্ট করা কালার ও সাইজসমূহ ({selectedVariants.length} টি ভ্যারিয়েন্ট)</span>
                                <span>মোট: {totalQty} টি</span>
                            </div>

                            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                                {selectedVariants.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between bg-neutral-900 p-2.5 rounded-lg border border-neutral-800 text-xs"
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            {item.colorImg && (
                                                <img
                                                    src={item.colorImg}
                                                    alt={item.color}
                                                    className="w-9 h-9 object-cover rounded-md border border-neutral-700 shrink-0"
                                                />
                                            )}
                                            <div className="min-w-0">
                                                <p className="font-semibold text-white truncate">
                                                    কালার: <span className="text-emerald-400">{item.color}</span>
                                                </p>
                                                <p className="text-[11px] text-neutral-400">
                                                    সাইজ: <span className="text-white font-medium">{item.size}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right shrink-0">
                                            <span className="font-bold text-emerald-400 block font-mono">
                                                ৳ {item.price * item.quantity}
                                            </span>
                                            <span className="text-[10px] text-neutral-400">
                                                ({item.quantity} × ৳{item.price})
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t border-neutral-800 text-sm font-bold">
                                <span className="text-neutral-300">মোট দেয় টাকা (Total):</span>
                                <span className="text-emerald-400 text-base font-mono">৳ {totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-neutral-800 p-3 rounded-xl border border-neutral-700 flex justify-between items-center text-sm font-bold">
                            <span className="text-neutral-300">পরিমাণ: {data.quantity} টি</span>
                            <span className="text-emerald-400 font-mono">৳ {data.total_price.toFixed(2)}</span>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold mb-1 text-neutral-300">ডেলিভারি ঠিকানা</label>
                        <textarea
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            required
                            rows={2}
                            className="w-full px-3.5 py-2.5 border rounded-xl bg-neutral-800 border-neutral-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                            placeholder="আপনার সম্পূর্ণ ঠিকানা দিন"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold mb-1 text-neutral-300">মোবাইল নম্বর (Phone)</label>
                        <input
                            type="text"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            required
                            className="w-full px-3.5 py-2.5 border rounded-xl bg-neutral-800 border-neutral-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                            placeholder="আপনার ১১ ডিজিটের মোবাইল নম্বর দিন"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-xs font-semibold cursor-pointer text-neutral-300"
                        >
                            বাতিল
                        </button>
                        <button
                            type="submit"
                            disabled={processing || (hasMultiVariants && totalQty === 0)}
                            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-md"
                        >
                            {processing ? 'অর্ডার হচ্ছে...' : 'অর্ডার কনফার্ম করুন'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

