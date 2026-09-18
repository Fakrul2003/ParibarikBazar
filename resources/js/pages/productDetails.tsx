import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '@/components/myProduct/Navbar';
import OrderModal, { SelectedVariantItem } from '@/components/myProduct/OrderModal';
import { parseProductSizes } from '@/components/myProduct/EditProductModal';
import {
    ShieldCheck,
    Star,
    Truck,
    Flame,
    Maximize2,
    ChevronLeft,
    ChevronRight,
    ShoppingBag,
    ShoppingCart,
    PhoneCall,
    MessageCircle,
    CheckCircle2
} from 'lucide-react';

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    image: string;
    image_2?: string;
    image_3?: string;
    sizes?: string;
}

interface Props {
    product: Product;
    auth: { user: any };
}

interface ColorOption {
    id: string;
    name: string;
    image: string;
}

export default function ProductDetails({ product, auth }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [showWhatsApp, setShowWhatsApp] = useState(false);
    const [showCall, setShowCall] = useState(false);
    const adminPhoneNumber = "+8801987668401";

    const getImageUrl = (img?: string) => {
        if (!img) return '';
        if (img.startsWith('http') || img.startsWith('/storage/')) {
            return img;
        }
        return `/storage/${img}`;
    };

    // Color options built from product images
    const colorOptions: ColorOption[] = useMemo(() => {
        const list: ColorOption[] = [];
        if (product.image) {
            list.push({ id: 'color-1', name: 'Color Option 1', image: getImageUrl(product.image) });
        }
        if (product.image_2) {
            list.push({ id: 'color-2', name: 'Color Option 2', image: getImageUrl(product.image_2) });
        }
        if (product.image_3) {
            list.push({ id: 'color-3', name: 'Color Option 3', image: getImageUrl(product.image_3) });
        }
        if (list.length === 0) {
            list.push({ id: 'color-default', name: 'Standard Color', image: '/placeholder.jpg' });
        }
        return list;
    }, [product]);

    const [selectedColor, setSelectedColor] = useState<ColorOption>(colorOptions[0]);
    const [selectedImage, setSelectedImage] = useState<string>(colorOptions[0].image);

    useEffect(() => {
        if (colorOptions.length > 0) {
            if (!selectedColor || selectedColor.id !== colorOptions[0].id) {
                setSelectedColor(colorOptions[0]);
                setSelectedImage(colorOptions[0].image);
            }
        }
    }, [colorOptions]);

    const sizesList = useMemo(() => {
        const parsed = parseProductSizes(product.sizes);
        if (parsed.length > 0) return parsed;
        // Default sizes if none configured
        return [
            { size: '44', isOutOfStock: false },
            { size: '44.5', isOutOfStock: false },
            { size: '45', isOutOfStock: false },
            { size: '46', isOutOfStock: false }
        ];
    }, [product.sizes]);

    // Matrix state storing quantities: { [colorId_size]: quantity }
    const [variantQuantities, setVariantQuantities] = useState<{ [key: string]: number }>({});

    const getVariantKey = (colorId: string, size: string) => `${colorId}_${size}`;

    const handleQuantityChange = (colorId: string, size: string, delta: number) => {
        const key = getVariantKey(colorId, size);
        const currentQty = variantQuantities[key] || 0;
        const newQty = Math.max(0, currentQty + delta);

        const updated = { ...variantQuantities };
        if (newQty === 0) {
            delete updated[key];
        } else {
            updated[key] = newQty;
        }
        setVariantQuantities(updated);
    };

    const handleQuantityInput = (colorId: string, size: string, value: string) => {
        const num = parseInt(value, 10);
        const key = getVariantKey(colorId, size);
        const updated = { ...variantQuantities };

        if (isNaN(num) || num <= 0) {
            delete updated[key];
        } else {
            updated[key] = num;
        }
        setVariantQuantities(updated);
    };

    // Calculate total quantity across all colors and sizes
    const totalSelectedQty = useMemo(() => {
        return Object.values(variantQuantities).reduce((sum, q) => sum + q, 0);
    }, [variantQuantities]);

    // Calculate count per color
    const getColorSelectedQty = (colorId: string) => {
        let count = 0;
        Object.entries(variantQuantities).forEach(([key, qty]) => {
            if (key.startsWith(`${colorId}_`)) {
                count += qty;
            }
        });
        return count;
    };

    // Bulk tier pricing logic
    const unitPrice = useMemo(() => {
        const basePrice = Number(product.price || 0);
        if (totalSelectedQty >= 100) return basePrice * 0.85; // 15% off for 100+ pcs
        if (totalSelectedQty >= 20) return basePrice * 0.92;  // 8% off for 20-99 pcs
        return basePrice;
    }, [product.price, totalSelectedQty]);

    const totalCalculatedPrice = useMemo(() => {
        return totalSelectedQty * unitPrice;
    }, [totalSelectedQty, unitPrice]);

    // Convert matrix state into structured selected variants list for OrderModal
    const selectedVariantsList: SelectedVariantItem[] = useMemo(() => {
        const list: SelectedVariantItem[] = [];
        Object.entries(variantQuantities).forEach(([key, qty]) => {
            if (qty > 0) {
                const [colorId, size] = key.split('_');
                const colorObj = colorOptions.find(c => c.id === colorId) || selectedColor;
                list.push({
                    color: colorObj.name,
                    colorImg: colorObj.image,
                    size,
                    quantity: qty,
                    price: unitPrice
                });
            }
        });
        return list;
    }, [variantQuantities, colorOptions, selectedColor, unitPrice]);

    const handleBuyNow = () => {
        if (totalSelectedQty === 0) {
            alert('দয়া করে অন্তত একটি কালার ও সাইজের পরিমাণ নির্বাচন করুন!');
            return;
        }
        setIsOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 text-gray-900 dark:text-white transition-colors duration-200">
            <Head title={`${product.name} - Paribarik Bazaar`} />
            <Navbar auth={auth} />

            {/* Top Navigation & Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-2">
                <div className="flex items-center justify-between">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl text-xs font-semibold hover:bg-gray-100 dark:hover:bg-neutral-800 transition shadow-xs"
                    >
                        <ChevronLeft className="w-4 h-4 text-gray-500" /> Back to Products
                    </Link>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        Category: <strong className="text-emerald-600 dark:text-emerald-400">{product.category}</strong>
                    </span>
                </div>
            </div>

            {/* Main Product Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                {/* Header Title Bar with Badges (Matching Screenshot Top Bar) */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-4 border border-gray-200/80 dark:border-neutral-800 mb-6 shadow-xs">
                    <h1 className="text-lg md:text-xl font-extrabold text-gray-900 dark:text-white mb-3 leading-snug">
                        {product.name}
                    </h1>

                    <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold">
                        <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full border border-blue-200/60 dark:border-blue-800">
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Guaranteed Quality
                        </span>
                        <span className="inline-flex items-center gap-1 bg-emerald-800 text-white dark:bg-emerald-950/80 dark:text-emerald-300 px-3 py-1 rounded-full">
                            <Flame className="w-3.5 h-3.5 text-amber-400" /> 2000+ sold
                        </span>
                        <span className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full border border-amber-200/60 dark:border-amber-800">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> 4.5 Stars
                        </span>
                        <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800">
                            <Truck className="w-3.5 h-3.5 text-emerald-600" /> Free Shipping Available
                        </span>
                    </div>
                </div>

                {/* Grid Layout: Left Gallery | Right Wholesale Matrix */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* LEFT COLUMN: Gallery & Main Image Preview (4 Columns) */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="bg-white dark:bg-neutral-900 border border-gray-200/80 dark:border-neutral-800 rounded-2xl p-4 relative shadow-xs group">
                            <div className="relative w-full aspect-square bg-gray-50 dark:bg-neutral-950 rounded-xl overflow-hidden flex items-center justify-center border border-gray-100 dark:border-neutral-850">
                                <img
                                    src={selectedImage}
                                    alt={product.name}
                                    className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                                />
                                <button
                                    type="button"
                                    onClick={() => window.open(selectedImage, '_blank')}
                                    className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-neutral-800/90 text-gray-700 dark:text-gray-200 rounded-full shadow-md hover:scale-110 transition cursor-pointer"
                                    title="View full image"
                                >
                                    <Maximize2 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Thumbnail strip */}
                            <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
                                {colorOptions.map((opt) => (
                                    <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedColor(opt);
                                            setSelectedImage(opt.image);
                                        }}
                                        className={`w-16 h-16 rounded-xl border-2 overflow-hidden shrink-0 transition cursor-pointer relative ${
                                            selectedColor.id === opt.id
                                                ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                                                : 'border-gray-200 dark:border-neutral-800 hover:border-gray-400'
                                        }`}
                                    >
                                        <img src={opt.image} alt={opt.name} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>

                            {/* Promotional Wholesale Banner */}
                            <div className="mt-4 p-3 bg-emerald-900 text-white rounded-xl text-center text-xs font-bold tracking-wide shadow-xs flex items-center justify-center gap-2">
                                <span>⚡ পাইকারি ও খুচরা অর্ডার করুন সরাসরি কারখানা রেটে!</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Colors Grid & Size Matrix (7 Columns) */}
                    <div className="lg:col-span-7 space-y-5">
                        <div className="bg-white dark:bg-neutral-900 border border-gray-200/80 dark:border-neutral-800 rounded-2xl p-5 shadow-xs space-y-6">

                            {/* SECTION 1: Colors Selection Grid */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-extrabold text-sm text-gray-900 dark:text-white uppercase tracking-wider">
                                        Colors ({colorOptions.length} available)
                                    </h3>
                                    {totalSelectedQty > 0 && (
                                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                            {totalSelectedQty} items selected overall
                                        </span>
                                    )}
                                </div>

                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                    {colorOptions.map((opt) => {
                                        const qtySelected = getColorSelectedQty(opt.id);
                                        const isSelected = selectedColor.id === opt.id;
                                        return (
                                            <div
                                                key={opt.id}
                                                onClick={() => {
                                                    setSelectedColor(opt);
                                                    setSelectedImage(opt.image);
                                                }}
                                                className={`relative rounded-xl border-2 p-1.5 transition cursor-pointer flex flex-col items-center bg-gray-50/50 dark:bg-neutral-850 ${
                                                    isSelected
                                                        ? 'border-emerald-500 ring-2 ring-emerald-500/20 dark:border-emerald-500'
                                                        : 'border-gray-200 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700'
                                                }`}
                                            >
                                                {/* Selected Quantity Badge on top-right of Color Card */}
                                                {qtySelected > 0 && (
                                                    <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md border-2 border-white dark:border-neutral-900 animate-bounce">
                                                        {qtySelected}
                                                    </span>
                                                )}

                                                <div className="w-full aspect-square bg-white dark:bg-neutral-900 rounded-lg overflow-hidden border border-gray-100 dark:border-neutral-800 mb-1.5">
                                                    <img src={opt.image} alt={opt.name} className="w-full h-full object-contain p-1" />
                                                </div>
                                                <span className="text-[11px] font-bold text-center truncate w-full text-gray-800 dark:text-gray-200">
                                                    {opt.name}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* SECTION 2: Bulk Pricing Tiers Box (Alibaba/Wholesale Style) */}
                            <div className="bg-gray-50 dark:bg-neutral-850 p-4 rounded-xl border border-gray-200/80 dark:border-neutral-800">
                                <span className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                    Bulk Tier Pricing (পাইকারি মূল্য তালিকা)
                                </span>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className={`p-2.5 rounded-lg border transition ${
                                        totalSelectedQty < 20
                                            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold'
                                            : 'bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 text-gray-600 dark:text-gray-400'
                                    }`}>
                                        <p className="text-[11px]">1 - 19 pcs</p>
                                        <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                                            ৳{product.price}
                                        </p>
                                    </div>
                                    <div className={`p-2.5 rounded-lg border transition ${
                                        totalSelectedQty >= 20 && totalSelectedQty < 100
                                            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold'
                                            : 'bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 text-gray-600 dark:text-gray-400'
                                    }`}>
                                        <p className="text-[11px]">20 - 99 pcs (8% OFF)</p>
                                        <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                                            ৳{(product.price * 0.92).toFixed(0)}
                                        </p>
                                    </div>
                                    <div className={`p-2.5 rounded-lg border transition ${
                                        totalSelectedQty >= 100
                                            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold'
                                            : 'bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 text-gray-600 dark:text-gray-400'
                                    }`}>
                                        <p className="text-[11px]">100+ pcs (15% OFF)</p>
                                        <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                                            ৳{(product.price * 0.85).toFixed(0)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 3: Size & Quantity Matrix Table */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Size Matrix for <span className="text-emerald-600 dark:text-emerald-400">{selectedColor.name}</span>
                                    </h4>
                                    <span className="text-[11px] text-gray-400">
                                        Select size quantities below
                                    </span>
                                </div>

                                <div className="border border-gray-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                                    <table className="w-full text-left border-collapse text-xs">
                                        <thead>
                                            <tr className="bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-300 uppercase font-bold border-b border-gray-200 dark:border-neutral-700">
                                                <th className="p-3">SIZE</th>
                                                <th className="p-3">PRICE</th>
                                                <th className="p-3 text-right">QUANTITY</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                                            {sizesList.map((item, idx) => {
                                                const vKey = getVariantKey(selectedColor.id, item.size);
                                                const qty = variantQuantities[vKey] || 0;
                                                const isOut = item.isOutOfStock;

                                                return (
                                                    <tr key={idx} className={`hover:bg-gray-50/80 dark:hover:bg-neutral-800/50 ${isOut ? 'opacity-60 bg-gray-50/40 dark:bg-neutral-900/40' : ''}`}>
                                                        <td className="p-3 font-semibold">
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                                    {item.size}
                                                                </span>
                                                                <span className={`text-[10px] font-medium ${isOut ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                                                    {isOut ? 'Out of stock' : '99+ in stock'}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="p-3 font-bold text-gray-900 dark:text-white font-mono text-sm">
                                                            ৳{unitPrice.toFixed(0)}
                                                        </td>
                                                        <td className="p-3 text-right">
                                                            <div className="inline-flex items-center border border-gray-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 overflow-hidden shadow-xs">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleQuantityChange(selectedColor.id, item.size, -1)}
                                                                    disabled={qty === 0 || isOut}
                                                                    className="px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 disabled:opacity-40 transition cursor-pointer font-bold text-sm"
                                                                >
                                                                    -
                                                                </button>
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    disabled={isOut}
                                                                    value={qty === 0 ? '' : qty}
                                                                    placeholder="0"
                                                                    onChange={(e) => handleQuantityInput(selectedColor.id, item.size, e.target.value)}
                                                                    className="w-12 text-center font-bold text-sm bg-transparent border-0 focus:ring-0 p-0 text-gray-900 dark:text-white"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleQuantityChange(selectedColor.id, item.size, 1)}
                                                                    disabled={isOut}
                                                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 transition cursor-pointer font-bold text-sm"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* SECTION 4: Selected Summary & Action Bar (Matching Bottom Right Box) */}
                            <div className="bg-emerald-50/60 dark:bg-emerald-950/30 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                                            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-lg">{totalSelectedQty} pcs</span> selected
                                        </p>
                                        <p className="text-xs text-gray-500">Unit Price: ৳{unitPrice.toFixed(0)} / pc</p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 uppercase font-bold">Total Price</p>
                                        <p className="text-xl md:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                                            ৳ {totalCalculatedPrice.toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                {/* Order Action Buttons */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={handleBuyNow}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 px-6 rounded-xl transition cursor-pointer shadow-lg flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                                    >
                                        <ShoppingBag className="w-4 h-4" /> BUY NOW (এখনই অর্ডারে যান)
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleBuyNow}
                                        className="w-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-800 dark:hover:bg-neutral-700 border border-neutral-700 font-bold py-3.5 px-6 rounded-xl transition cursor-pointer shadow-md flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                                    >
                                        <ShoppingCart className="w-4 h-4" /> ADD TO CART
                                    </button>
                                </div>

                                {/* Quick Contact Section */}
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => setShowWhatsApp(!showWhatsApp)}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-3 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                                        >
                                            <MessageCircle className="w-4 h-4" /> Order On WhatsApp
                                        </button>
                                        {showWhatsApp && (
                                            <div className="mt-2 p-2 bg-neutral-900 text-green-400 text-center rounded-lg text-xs font-bold border border-green-600">
                                                {adminPhoneNumber}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => setShowCall(!showCall)}
                                            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2.5 px-3 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                                        >
                                            <PhoneCall className="w-4 h-4" /> Call For Order
                                        </button>
                                        {showCall && (
                                            <div className="mt-2 p-2 bg-neutral-900 text-blue-400 text-center rounded-lg text-xs font-bold border border-blue-600">
                                                {adminPhoneNumber}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            {/* Order Confirmation Modal */}
            <OrderModal
                product={product}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                auth={auth}
                initialQuantity={totalSelectedQty || 1}
                selectedVariants={selectedVariantsList}
            />
        </div>
    );
}

