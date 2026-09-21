import { Link, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import EditProductModal from '@/components/myProduct/EditProductModal';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    stock?: number;
    image?: string;
    image_2?: string;
    image_3?: string;
    sizes?: string;
}

interface ProductCardProps {
    product: Product;
    auth?: { user: any };
    isAdmin?: boolean;
}

const resolveProductImageUrl = (image?: string) => {
    if (!image) return 'https://via.placeholder.com/600x600?text=No+Image';
    if (image.startsWith('http') || image.startsWith('/')) return image;
    if (image.startsWith('storage/')) return `/${image}`;
    return `/storage/${image}`;
};

export default function ProductCard({ product, auth, isAdmin = true }: ProductCardProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const checkIsAdmin = isAdmin || Boolean(auth?.user && auth.user.role === 'admin');

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDeleteProduct = () => {
        setIsMenuOpen(false);
        if (window.confirm(`আপনি কি নিশ্চিত যে "${product.name}" প্রোডাক্টটি ডিলিট করতে চান?`)) {
            router.delete(`/admin/product/${product.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    alert('প্রোডাক্ট সফলভাবে ডিলিট করা হয়েছে!');
                },
                onError: (errors) => {
                    console.error('Delete error:', errors);
                    alert('প্রোডাক্ট ডিলিট করতে ব্যর্থ হয়েছে।');
                }
            });
        }
    };

    return (
        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-xs flex flex-col justify-between relative group">

            {/* ৩-ডট (3-dots) মেনু এডমিনদের জন্য */}
            {checkIsAdmin && (
                <div className="absolute top-2 right-2 z-20" ref={menuRef}>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsMenuOpen(!isMenuOpen);
                        }}
                        className="p-1.5 bg-white/90 dark:bg-neutral-900/90 hover:bg-white dark:hover:bg-neutral-800 text-gray-700 dark:text-gray-200 rounded-full shadow-md backdrop-blur-xs transition cursor-pointer border border-gray-200/60 dark:border-neutral-700"
                        title="Options"
                    >
                        <MoreVertical className="w-4 h-4" />
                    </button>

                    {isMenuOpen && (
                        <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-gray-100 dark:border-neutral-700 py-1 z-30 text-xs font-semibold">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    setIsEditModalOpen(true);
                                }}
                                className="w-full text-left px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-neutral-700 flex items-center gap-2 transition cursor-pointer"
                            >
                                <Edit className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                <span>এডিট (Edit)</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteProduct}
                                className="w-full text-left px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2 transition cursor-pointer"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>ডিলিট (Delete)</span>
                            </button>
                        </div>
                    )}
                </div>
            )}

            <div>
                <Link href={`/products/${product.id}`} className="block group overflow-hidden rounded-t-xl">
                    <img
                        src={resolveProductImageUrl(product.image)}
                        alt={product.name}
                        className="w-full h-52 object-cover rounded-t-xl group-hover:scale-105 transition duration-300"
                        onError={(event) => {
                            event.currentTarget.src = 'https://via.placeholder.com/600x600?text=No+Image';
                        }}
                    />
                </Link>

                <div className="p-3">
                    <Link href={`/products/${product.id}`} className="block">
                        <h3 className="font-bold text-base text-gray-900 dark:text-white hover:text-green-600 transition line-clamp-1">
                            {product.name}
                        </h3>
                    </Link>

                    <p className="text-emerald-600 dark:text-emerald-400 font-bold text-base mt-1">৳ {product.price}</p>
                </div>
            </div>

            {/* এডমিন এডিট মোডাল */}
           {isEditModalOpen && (
                <EditProductModal
                    product={product}
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                />
           )}
        </div>
    );
}
