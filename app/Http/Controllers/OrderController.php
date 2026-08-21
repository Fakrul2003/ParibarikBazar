<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    // হোমপেজে প্রোডাক্ট লিস্ট দেখানোর জন্য
    public function index()
    {
        return Inertia::render('welcome', [
            'products' => Product::all(),
            'auth' => [
                'user' => Auth::user(),
            ]
        ]);
    }
    // অ্যাডমিন নতুন প্রোডাক্ট যুক্ত করার জন্য
    public function storeProduct(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
        $imagePath = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $imagePath = '/storage/' . $path;
        }
        Product::create([
            'name' => $request->name,
            'category' => $request->category,
            'price' => $request->price,
            'stock' => $request->stock,
            'image' => $imagePath,
        ]);

        return redirect()->back()->with('success', 'ok');
    }


    // ইউজার অর্ডার করলে তা সেভ করার জন্য
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'phone' => 'required|string|max:20',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::find($request->product_id);

        $order = Order::create([
            'user_id' => Auth::id(),
            'product_id' => $request->product_id,
            'name' => $request->name,
            'address' => $request->address,
            'phone' => $request->phone,
            'quantity' => $request->quantity,
            'total_price' => $product->price * $request->quantity,
            'status' => 'Pending',
        ]);

        return redirect()->back()->with('success', 'অর্ডার সফলভাবে সম্পন্ন হয়েছে!');
    }

    // ড্যাশবোর্ডে ডেটা দেখানোর জন্য (ইউজার ও অ্যাডমিন উভয় ড্যাশবোর্ডের ডেটা)
    public function dashboard()
    {
        $user = Auth::user();

        if ($user->role === 'admin') {
            // অ্যাডমিন সব ইউজারের অর্ডার দেখতে পাবে
            $orders = Order::with(['user', 'product'])->latest()->get();
        } else {
            // সাধারণ ইউজার শুধু নিজের অর্ডার দেখতে পাবে
            $orders = Order::with('product')->where('user_id', $user->id)->latest()->get();
        }

        return Inertia::render('dashboard', [
            'orders' => $orders
        ]);
    }

    // ডেলিভারি ম্যান অর্ডার নিয়ে বের হলে স্ট্যাটাস আপডেট
    public function updateStatus(Request $request, Order $order)
    {
        $order->update(['status' => 'Out for Delivery']);

        return redirect()->back();
    }
}
