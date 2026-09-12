<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    /**
     * নতুন ব্যানার সংরক্ষণ করার মেথড
     */
    public function store(Request $request)
    {
        // ভ্যালিডেশন
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        if ($request->hasFile('image')) {
            // 'banners' ফোল্ডারে ইমেজটি স্টোরেজে সেভ করা হচ্ছে
            $path = $request->file('image')->store('banners', 'public');


            Banner::create([
                'image' => $path,
            ]);

            return redirect()->back()->with('success', 'ব্যানার সফলভাবে আপলোড করা হয়েছে!');
        }

        return redirect()->back()->withErrors(['image' => 'ইমেজ আপলোড করতে সমস্যা হয়েছে।']);
    }
}
