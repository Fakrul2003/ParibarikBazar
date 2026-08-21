import { useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    image?: string;
}

export default function ProductCard({ product }: { product: Product }) {
    const [isOpen, setIsOpen] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        product_id: product.id,
        name: '',
        address: '',
        phone: '',
        quantity: 1,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/order/store', {
            onSuccess: () =>{
                alert('অর্ডার সফল হয়েছে!')
                 setIsOpen(false);
                 reset();
            } ,
        });
    };

    return (
      <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <div>
              <img
    src={product.image ? `${product.image}` : 'https://via.placeholder.com/150'}
    alt={product.name}
    className="w-full h-40 object-cover rounded-lg mb-3"
/>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                    {product.category}
                </span>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mt-1">{product.name}</h3>
                <p className="text-green-600 font-bold mt-1">৳ {product.price}</p>
            </div>

            <button
                onClick={() => setIsOpen(true)}
                className="mt-4 w-full py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition cursor-pointer"
            >
                Buy Now
            </button>

            {/* অর্ডার ফর্ম মডাল */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 w-full max-w-md shadow-xl text-gray-900 dark:text-white">
                        <h2 className="text-xl font-bold mb-4">অর্ডার কনফার্ম করুন: {product.name}</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">আপনার নাম</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
                                    placeholder="পূর্ণ নাম লিখুন"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">ঠিকানা</label>
                                <textarea
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
                                    placeholder="আপনার ডেলিভারি ঠিকানা"
                                />
                            </div>

                          <div>
                                <label className="block text-sm font-medium mb-1">মোবাইল নম্বর (Phone)</label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    required
                                    placeholder="আপনার মোবাইল নম্বর দিন"
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
                                />
                            </div>

                            
                            <div>
                                <label className="block text-sm font-medium mb-1">পরিমাণ (Quantity)</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={data.quantity}
                                    onChange={(e) => setData('quantity', Number(e.target.value))}
                                    required
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
                                />
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-2 bg-gray-300 dark:bg-neutral-700 rounded-lg text-sm cursor-pointer"
                                >
                                    বাতিল
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 cursor-pointer"
                                >
                                    {processing ? 'অর্ডার হচ্ছে...' : 'কনফার্ম অর্ডার'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
