<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Order;
use App\Models\Banner;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class OrderController extends Controller
{
    // হোমপেজ ও সার্চ হ্যান্ডেল করার জন্য মূল মেথড
    public function index(Request $request)
    {
        $products = $this->filterProducts($request);
        $banners = Banner::latest()->get();

        return Inertia::render('welcome', [
            'products' => $products,
            'banners' => $banners,
            'auth' => [
                'user' => Auth::user(),
            ]
        ]);
    }

    // আলাদা একটি প্রাইভেট ফাংশন যেখানে সার্চের লজিক থাকবে
    private function filterProducts(Request $request)
    {
        $query = Product::query();

        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('category', 'like', "%{$searchTerm}%");
        }

        return $query->get();
    }

    // অ্যাডমিন নতুন প্রোডাক্ট যুক্ত করার জন্য
    public function storeProduct(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'sizes' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'image_2' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'image_3' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $imagePath = '/storage/' . $path;
        }

        $imagePath2 = null;
        if ($request->hasFile('image_2')) {
            $path2 = $request->file('image_2')->store('products', 'public');
            $imagePath2 = '/storage/' . $path2;
        }

        $imagePath3 = null;
        if ($request->hasFile('image_3')) {
            $path3 = $request->file('image_3')->store('products', 'public');
            $imagePath3 = '/storage/' . $path3;
        }

        Product::create([
            'name' => $request->name,
            'category' => $request->category,
            'price' => $request->price,
            'stock' => $request->stock,
            'sizes' => $request->sizes,
            'image' => $imagePath,
            'image_2' => $imagePath2,
            'image_3' => $imagePath3,
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
            'sizes_data' => 'nullable|string',
            'size_data' => 'nullable|string',
            'size' => 'nullable|string',
            'total_price' => 'nullable|numeric',
        ]);

        $product = Product::find($request->product_id);

        $sizesData = $request->sizes_data ?? $request->size_data;
        $totalPrice = $request->filled('total_price') && (float)$request->total_price > 0
            ? (float)$request->total_price
            : ($product ? $product->price * $request->quantity : 0);

        Order::create([
            'user_id' => Auth::id(),
            'product_id' => $request->product_id,
            'name' => $request->name,
            'address' => $request->address,
            'phone' => $request->phone,
            'quantity' => $request->quantity,
            'size' => $request->size ?? (is_string($sizesData) && !str_contains($sizesData, '{') ? $sizesData : null),
            'size_data' => $sizesData,
            'total_price' => $totalPrice,
            'status' => 'Pending',
        ]);

        return redirect()->back()->with('success', 'অর্ডার সফলভাবে সম্পন্ন হয়েছে!');
    }

    // প্রোডাক্টের বিস্তারিত পেজ দেখানোর জন্য
    public function show(Product $product)
    {
        return Inertia::render('productDetails', [
            'product' => $product,
            'auth' => [
                'user' => Auth::user(),
            ]
        ]);
    }

    // ড্যাশবোর্ডে ডেটা দেখানোর জন্য
    public function dashboard()
    {
        $user = Auth::user();

        if ($user && $user->role === 'admin') {
            $orders = Order::with(['user', 'product'])->latest()->get();
            return Inertia::render('admin/Orders', [
                'orders' => $orders
            ]);
        }

        $orders = Order::with('product')->where('user_id', $user ? $user->id : 0)->latest()->get();
        $messages = ($user && Schema::hasTable('messages'))
            ? Message::with('sender')->where('user_id', $user->id)->orderBy('created_at', 'asc')->get()
            : [];

        return Inertia::render('dashboard', [
            'orders' => $orders,
            'messages' => $messages,
        ]);
    }

    public function adminDashboard()
    {
        $orders = Order::with(['user', 'product'])->latest()->get();
        $products = Product::all();
        $totalSales = $orders->sum('total_price');

        return Inertia::render('admin/DashboardOverview', [
            'orders' => $orders,
            'productsCount' => $products->count(),
            'totalSales' => $totalSales,
        ]);
    }

    public function adminOrders()
    {
        $orders = Order::with(['user', 'product'])->latest()->get();

        return Inertia::render('admin/Orders', [
            'orders' => $orders
        ]);
    }

    public function adminInvoices()
    {
        $orders = Order::with(['user', 'product'])->latest()->get();

        return Inertia::render('admin/Invoices', [
            'orders' => $orders
        ]);
    }

    public function adminMessages(Request $request)
    {
        if (!Schema::hasTable('messages')) {
            return Inertia::render('admin/Messages', [
                'customers' => [],
                'activeUserId' => null,
                'messages' => [],
            ]);
        }

        $allMessages = Message::with(['sender', 'user'])->orderBy('created_at', 'asc')->get();
        $threads = $allMessages->groupBy('user_id');

        $customers = User::whereIn('id', $threads->keys())->get()->map(function ($customer) use ($threads) {
            $userMsgs = $threads->get($customer->id);
            $lastMsg = $userMsgs ? $userMsgs->last() : null;

            $unreadCount = $userMsgs ? $userMsgs->where('is_read', false)->filter(function($msg) {
                return $msg->sender_id !== Auth::id();
            })->count() : 0;

            return [
                'id' => $customer->id,
                'name' => $customer->name,
                'email' => $customer->email,
                'avatar' => strtoupper(substr($customer->name, 0, 1)),
                'lastMessage' => $lastMsg ? ($lastMsg->image ? '[Image Attachment]' : $lastMsg->message) : '',
                'time' => $lastMsg ? $lastMsg->created_at->diffForHumans() : '',
                'unread' => $unreadCount > 0,
            ];
        });

        $activeUserId = $request->query('user_id') ?? ($customers->first()['id'] ?? null);
        $activeMessages = [];

        if ($activeUserId) {
            $activeMessages = Message::with('sender')
                ->where('user_id', $activeUserId)
                ->orderBy('created_at', 'asc')
                ->get();

            Message::where('user_id', $activeUserId)
                ->where('sender_id', '!=', Auth::id())
                ->where('is_read', false)
                ->update(['is_read' => true]);
        }

        return Inertia::render('admin/Messages', [
            'customers' => $customers->values(),
            'activeUserId' => $activeUserId ? (int)$activeUserId : null,
            'messages' => $activeMessages,
        ]);
    }

    public function storeMessage(Request $request)
    {
        $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'message' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        if (!$request->message && !$request->hasFile('image')) {
            return redirect()->back()->withErrors(['message' => 'Message or image is required']);
        }

        $authUser = Auth::user();
        if (!$authUser) {
            return redirect()->back()->withErrors(['auth' => 'Unauthorized']);
        }

        $threadUserId = $request->user_id;
        if ($authUser->role !== 'admin' || !$threadUserId) {
            $threadUserId = $authUser->id;
        }

        $imagePath = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('messages', 'public');
            $imagePath = '/storage/' . $path;
        }

        Message::create([
            'user_id' => $threadUserId,
            'sender_id' => $authUser->id,
            'message' => $request->message,
            'image' => $imagePath,
            'is_read' => false,
        ]);

        return redirect()->back()->with('success', 'Message sent successfully');
    }

    public function acceptOrder(Order $order)
    {
        $order->update(['status' => 'Delivered']);
        return redirect()->back()->with('success', 'Order status updated to Delivered');
    }

    public function rejectOrder(Order $order)
    {
        $order->update(['status' => 'Rejected']);
        return redirect()->back()->with('success', 'Order rejected');
    }

    public function updateStatus(Request $request, Order $order)
    {
        $order->update(['status' => 'Out for Delivery']);

        return redirect()->back();
    }

    public function showByCategory($category)
    {
        $products = Product::where('category', $category)->get();

        return Inertia::render('Category/Show', [
            'categoryName' => $category,
            'products' => $products
        ]);
    }

    public function updateProduct(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'sizes' => 'nullable|string',
        ]);

        $data = [
            'name' => $request->name,
            'category' => $request->category,
            'price' => $request->price,
            'stock' => $request->stock,
            'sizes' => $request->sizes,
        ];

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $data['image'] = '/storage/' . $path;
        }

        if ($request->hasFile('image_2')) {
            $path2 = $request->file('image_2')->store('products', 'public');
            $data['image_2'] = '/storage/' . $path2;
        }

        if ($request->hasFile('image_3')) {
            $path3 = $request->file('image_3')->store('products', 'public');
            $data['image_3'] = '/storage/' . $path3;
        }

        $product->update($data);

        return redirect()->back()->with('success', 'Product updated successfully');
    }

    public function destroyProduct(Product $product)
    {
        $product->delete();
        return redirect()->back()->with('success', 'Product deleted successfully');
    }

    public function destroyOrder(Order $order)
    {
        $order->delete();
        return redirect()->back()->with('success', 'Order deleted successfully');
    }
}
