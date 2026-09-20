import React from 'react';

interface AddBannerModalProps {
    isOpen: boolean;
    onClose: () => void;
    bannerForm: any;
    onSubmit: (e: React.FormEvent) => void;
}

export default function AddBannerModal({
    isOpen,
    onClose,
    bannerForm,
    onSubmit
}: AddBannerModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 w-full max-w-md shadow-xl text-gray-900 dark:text-white">
                <h2 className="text-xl font-bold mb-4">নতুন ব্যানার ছবি যোগ করুন</h2>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">ব্যানার ছবি</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => bannerForm.setData('image', e.target.files ? e.target.files[0] : null)}
                            required
                            className="w-full px-3 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700 text-sm"
                        />
                        {bannerForm.errors?.image && (
                            <p className="text-red-500 text-xs mt-1">{bannerForm.errors.image}</p>
                        )}
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
                            disabled={bannerForm.processing}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 cursor-pointer"
                        >
                            {bannerForm.processing ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
