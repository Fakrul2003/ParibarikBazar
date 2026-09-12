import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '@/components/myProduct/Navbar';
import OrderModal from '@/components/myProduct/OrderModal'; // আলাদা করা অর্ডার মডাল ইমপোর্ট করা হলো

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    image: string;
    image_2?: string;
    image_3?: string;
    sizes?: string; // যদি সাইজ ফিল্ড থাকে
}

interface Props {
    product: Product;
    auth: { user: any };
}

export default function ProductDetails({ product, auth }: Props) {
    const [quantity, setQuantity] = useState(1);
    const [isOpen, setIsOpen] = useState(false);

    // ইমেজ পাথ ঠিক করার জন্য একটি হেল্পার ফাংশন
    const getImageUrl = (img?: string) => {
        if (!img) return '';
        if (img.startsWith('http') || img.startsWith('/storage/')) {
            return img;
        }
        return `/storage/${img}`;
    };

    // ৩টি আলাদা ইমেজ অ্যারে
    const images = [
        getImageUrl(product.image),
        getImageUrl(product.image_2),
        getImageUrl(product.image_3)
    ].filter((img): img is string => Boolean(img));

    const [selectedImage, setSelectedImage] = useState(images[0]);

    // WhatsApp এবং Call নাম্বারের স্টেট
    const [showWhatsApp, setShowWhatsApp] = useState(false);
    const [showCall, setShowCall] = useState(false);
    const adminPhoneNumber = "+8801987668401";

    const handleQuantityChange = (type: 'inc' | 'dec') => {
        if (type === 'inc' && quantity < product.stock) {
            setQuantity(quantity + 1);
        } else if (type === 'dec' && quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    useEffect(() => {
        console.log("========== PRODUCT DEBUG START ==========");
        console.log("Full Product Data:", product);
        console.log("Product Sizes:", product.sizes);
        console.log("========== PRODUCT DEBUG END ===========");
    }, [product]);

    return (
       <div>
         <Head title={product.name} />

         <Navbar auth={auth}/>
          <div className="">
              <Link
                  href="/"
                  className="inline-block px-4 py-2 mt-2 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-lg text-sm font-medium hover:opacity-90 transition"
              >
                  Home page
              </Link>
          </div>
         <div className="mt-10 bg-neutral-950 text-white p- flex items-center justify-center">

            <div className="max-w-6xl w-full bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                    {/* বাম পাশ: ৩টি আলাদা থাম্বনেইল ইমেজ গ্যালারি */}
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-3">
                            {images.map((img, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setSelectedImage(img)}
                                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 cursor-pointer ${selectedImage === img ? 'border-green-500' : 'border-neutral-700'}`}
                                >
                                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>

                        {/* মূল বড় ইমেজ */}
                        <div className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-center p-4">
                            <img src={selectedImage} alt={product.name} className="max-h-[400px] object-contain" />
                        </div>
                    </div>

                    {/* ডান পাশ: প্রোডাক্টের তথ্য ও বাটন */}
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-4">{product.name}</h1>

                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-2xl font-bold text-green-400">৳{product.price}</span>
                            <span className="text-neutral-500 line-through">৳{product.price + 100}</span>
                            <span className="bg-green-900/40 text-green-400 text-xs px-2 py-1 rounded font-semibold">Save 14%</span>
                        </div>

                        {/* কোয়ান্টিটি কাউন্টার */}
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-sm text-neutral-400">Quantity:</span>
                            <div className="flex items-center border border-neutral-700 rounded-lg bg-neutral-800">
                                <button
                                    type="button"
                                    onClick={() => handleQuantityChange('dec')}
                                    className="px-3 py-1 text-neutral-300 hover:bg-neutral-700 rounded-l-lg cursor-pointer"
                                >
                                    -
                                </button>
                                <span className="px-4 py-1 text-white font-medium">{quantity}</span>
                                <button
                                    type="button"
                                    onClick={() => handleQuantityChange('inc')}
                                    className="px-3 py-1 text-neutral-300 hover:bg-neutral-700 rounded-r-lg cursor-pointer"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* অ্যাকশন বাটনসমূহ */}
                        <div className="space-y-3 mb-6">
                            <button type="button" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition cursor-pointer">
                                🛒 ADD TO CART
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsOpen(true)}
                                className="w-full bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 text-white font-semibold py-3 rounded-xl transition cursor-pointer"
                            >
                                BUY NOW
                            </button>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => setShowWhatsApp(!showWhatsApp)}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-xl text-sm transition cursor-pointer"
                                    >
                                        💬 Order On WhatsApp
                                    </button>
                                    {showWhatsApp && (
                                        <div className="mt-2 p-2 bg-neutral-800 text-green-400 text-center rounded-lg text-sm font-bold border border-green-600">
                                            {adminPhoneNumber}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <button
                                        type="button"
                                        onClick={() => setShowCall(!showCall)}
                                        className="w-full bg-blue-900 hover:bg-blue-800 text-white font-medium py-2.5 px-4 rounded-xl text-sm transition cursor-pointer"
                                    >
                                        📞 Call For Order
                                    </button>
                                    {showCall && (
                                        <div className="mt-2 p-2 bg-neutral-800 text-blue-400 text-center rounded-lg text-sm font-bold border border-blue-600">
                                            {adminPhoneNumber}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-neutral-800 pt-4 text-sm text-neutral-400">
                            Category: <span className="text-white font-medium">{product.category}</span>
                        </div>
                    </div>

                </div>
            </div>

            {/* আলাদা করা অর্ডার মডাল এখানে ব্যবহার করা হলো (ডিজাইন অপরিবর্তিত রেখে) */}
            <OrderModal
                product={product}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                auth={auth}
                initialQuantity={quantity}
            />
        </div>
       </div>
    );
}
