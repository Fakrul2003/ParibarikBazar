import { Link } from '@inertiajs/react';
import { useState } from 'react';
import OrderModal from '@/components/myProduct/OrderModal'; // মডাল ইমপোর্ট করা হলো

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    image?: string;
    sizes?: string;
}

export default function ProductCard({ product, auth }: { product: Product; auth?: { user: any } }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white  border-2  rounded-md  shadow-sm flex flex-col justify-between">
            <div>
                <Link href={`/product/${product.id}`} className="block group">
                    <img
                        src={product.image ? `${product.image}` : 'https://via.placeholder.com/150'}
                        alt={product.name}
                        className="w-full h-52 object-cover rounded-t-sm group-hover:opacity-95 transition"
                    />
                </Link>

             <div className='px-2 pb-2'>
                   <Link href={`/product/${product.id}`} className="block">
                    <h3 className="font-bold text-lg text-gray-900   hover:text-green-600 transition">
                        {product.name}
                    </h3>
                </Link>

                <p className="text-yellow-900 font-bold mt-1">৳ {product.price}</p>

             <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="mt-4 w-full py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition cursor-pointer"
            >
                Buy Now
            </button>
             </div>

            </div>


            {/* আলাদা করা অর্ডার মডাল এখানে কল করা হলো */}
            <OrderModal
                product={product}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                auth={auth}
                initialQuantity={1}
            />
        </div>
    );
}
