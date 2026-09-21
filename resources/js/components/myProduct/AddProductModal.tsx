import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';

interface Offer {
    min: string;
    max: string;
    discount: string;
}

interface SizeRow {
    size: string;
    stock: string;
}

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
    const [sizeRows, setSizeRows] = useState<SizeRow[]>([]);
    const [sizeInput, setSizeInput] = useState('');
    const [stockInput, setStockInput] = useState('');
    const [offers, setOffers] = useState<Offer[]>([
        { min: '1', max: '19', discount: '0' },
        { min: '20', max: '99', discount: '8' },
        { min: '100', max: '', discount: '15' },
    ]);

    useEffect(() => {
        setData('offers', JSON.stringify(offers));
    }, [offers]);

    const syncSizes = (rows: SizeRow[]) => setData('sizes', JSON.stringify(rows));

    const addSize = () => {
        const size = sizeInput.trim();
        if (!size || sizeRows.some((row) => row.size.toLowerCase() === size.toLowerCase())) return;
        const rows = [...sizeRows, { size, stock: stockInput || '0' }];
        setSizeRows(rows);
        syncSizes(rows);
        setSizeInput('');
        setStockInput('');
    };

    const removeSize = (index: number) => {
        const rows = sizeRows.filter((_, rowIndex) => rowIndex !== index);
        setSizeRows(rows);
        syncSizes(rows);
    };

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

                    <div className="rounded-lg border border-gray-200 dark:border-neutral-700 p-3 space-y-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">সাইজ ও স্টক</label>
                            <div className="grid grid-cols-[1fr_90px_auto] gap-2">
                                <input value={sizeInput} onChange={(e) => setSizeInput(e.target.value)} placeholder="যেমন 39 বা XL" className="px-3 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700" />
                                <input type="number" min="0" value={stockInput} onChange={(e) => setStockInput(e.target.value)} placeholder="স্টক" className="px-3 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700" />
                                <button type="button" onClick={addSize} className="px-3 rounded-lg bg-emerald-600 text-white"><Plus className="w-4 h-4" /></button>
                            </div>
                        </div>
                        {sizeRows.map((row, index) => (
                            <div key={row.size} className="flex items-center justify-between rounded bg-gray-50 dark:bg-neutral-800 px-3 py-2 text-sm">
                                <span>সাইজ: <strong>{row.size}</strong> | স্টক: <strong>{row.stock}</strong></span>
                                <button type="button" onClick={() => removeSize(index)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-lg border border-gray-200 dark:border-neutral-700 p-3 space-y-2">
                        <label className="block text-sm font-medium">Bulk offer (ঐচ্ছিক)</label>
                        {offers.map((offer, index) => (
                            <div key={index} className="grid grid-cols-[1fr_1fr_90px_auto] gap-2 items-center">
                                <input type="number" min="1" value={offer.min} placeholder="শুরু" onChange={(e) => setOffers((rows) => rows.map((row, i) => i === index ? { ...row, min: e.target.value } : row))} className="px-2 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700" />
                                <input type="number" min="1" value={offer.max} placeholder="শেষ (ঐচ্ছিক)" onChange={(e) => setOffers((rows) => rows.map((row, i) => i === index ? { ...row, max: e.target.value } : row))} className="px-2 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700" />
                                <input type="number" min="0" max="100" value={offer.discount} placeholder="ছাড় %" onChange={(e) => setOffers((rows) => rows.map((row, i) => i === index ? { ...row, discount: e.target.value } : row))} className="px-2 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700" />
                                <button type="button" onClick={() => setOffers((rows) => rows.filter((_, i) => i !== index))} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        ))}
                        <button type="button" onClick={() => setOffers((rows) => [...rows, { min: '', max: '', discount: '' }])} className="text-xs text-emerald-600 font-semibold">+ Offer যোগ করুন</button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1"><Upload className="inline w-4 h-4 mr-1" />ছবি আপলোড করুন (যত ইচ্ছা)</label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                                const files = e.target.files ? Array.from(e.target.files) : [];
                                setData('image', files[0] ?? null);
                                setData('image_2', files[1] ?? null);
                                setData('image_3', files[2] ?? null);
                                setData('images', files.slice(3));
                            }}
                            required
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
