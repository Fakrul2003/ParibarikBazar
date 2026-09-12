import React from 'react';

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
    setData: (field: string, value: any) => void;
    onSubmit: (e: React.FormEvent) => void;
    processing: boolean;
    modalRef: React.RefObject<HTMLDivElement | null>;
}

export default function AddProductModal({
    isOpen,
    onClose,
    data,
    setData,
    onSubmit,
    processing,
    modalRef
}: AddProductModalProps) {
    if (!isOpen) return null;

    return (
        <div ref={modalRef} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 w-full max-w-md shadow-xl text-gray-900 dark:text-white max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">নতুন প্রোডাক্ট যোগ করুন</h2>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">প্রোডাক্টের নাম</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">ক্যাটাগরি (Category)</label>
                        <input
                            type="text"
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                            required
                            placeholder="যেমন: Electronics, Groceries"
                            className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">দাম (Price)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">স্টক (Stock)</label>
                        <input
                            type="number"
                            value={data.stock}
                            onChange={(e) => setData('stock', e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
                        />
                    </div>

                     <div>
    <label className="block text-sm font-medium mb-1">সাইজ (Sizes - ঐচ্ছিক)</label>
    <input
        type="text"
        value={data.sizes}
        onChange={(e) => setData('sizes', e.target.value)}
        placeholder="যেমন: 39, 40, 41 বা S, M, L"
        className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
    />
</div>

                    <div>
                        <label className="block text-sm font-medium mb-1">প্রধান ছবি (Image 1)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('image', e.target.files ? e.target.files[0] : null)}
                            required
                            className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">দ্বিতীয় ছবি (Image 2)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('image_2', e.target.files ? e.target.files[0] : null)}
                            className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">তৃতীয় ছবি (Image 3)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('image_3', e.target.files ? e.target.files[0] : null)}
                            className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 dark:bg-neutral-700 rounded-lg text-sm cursor-pointer"
                        >
                            বাতিল
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition ${
                                processing ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 cursor-pointer'
                            }`}
                        >
                            {processing ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
