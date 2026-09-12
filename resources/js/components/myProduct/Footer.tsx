import React from 'react';
import { Link } from '@inertiajs/react';
import { FaFacebookF, FaInstagram, FaTwitter, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-neutral-800 pt-12 pb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Top Section: Links & Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">

                    {/* Column 1: Logo & Company Bio */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="flex items-center space-x-2">
                            {/* লোগো আইকন বা টেক্সট */}
                            <span className="text-2xl font-black text-orange-600 tracking-wider">Fakhrul Fashon<span className="text-green-600">Mart</span></span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                            Fakhrul FashonMart is an e-commerce platform dedicated to providing safe and reliable food and essentials to every home.
                        </p>
                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                            <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-orange-500 shrink-0" /> Rampura, Dhaka, Bangladesh</p>
                            <p className="flex items-center gap-2"><FaPhoneAlt className="text-orange-500 shrink-0" /> +8801987668401</p>
                            <p className="flex items-center gap-2"><FaEnvelope className="text-orange-500 shrink-0" /> ifakrul@gmail.com</p>
                        </div>

                        {/* Social Icons */}
                        <div className="flex space-x-3 pt-2">
                            <a href="#" className="w-9 h-9 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-orange-600 hover:text-white transition-colors">
                                <FaFacebookF size={14} />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-orange-600 hover:text-white transition-colors">
                                <FaTwitter size={14} />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-orange-600 hover:text-white transition-colors">
                                <FaInstagram size={14} />
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Information */}
                    <div>
                        <h3 className="text-gray-900 dark:text-white font-bold text-base mb-4">Information</h3>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link href="#" className="hover:text-orange-600 transition-colors">About us</Link></li>
                            <li><Link href="#" className="hover:text-orange-600 transition-colors">Contact us</Link></li>
                            <li><Link href="#" className="hover:text-orange-600 transition-colors">Company Information</Link></li>
                            <li><Link href="#" className="hover:text-orange-600 transition-colors">Stories</Link></li>
                            <li><Link href="#" className="hover:text-orange-600 transition-colors">Terms & Conditions</Link></li>
                            <li><Link href="#" className="hover:text-orange-600 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-orange-600 transition-colors">Careers</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Shop By */}
                    <div>
                        <h3 className="text-gray-900 dark:text-white font-bold text-base mb-4">Shop By</h3>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link href="#" className="hover:text-orange-600 transition-colors">Oil & Ghee</Link></li>
                            <li><Link href="#" className="hover:text-orange-600 transition-colors">Honey</Link></li>
                            <li><Link href="#" className="hover:text-orange-600 transition-colors">Dates</Link></li>
                            <li><Link href="#" className="hover:text-orange-600 transition-colors">Spices</Link></li>
                            <li><Link href="#" className="hover:text-orange-600 transition-colors">Nuts & Seeds</Link></li>
                            <li><Link href="#" className="hover:text-orange-600 transition-colors">Beverage</Link></li>
                            <li><Link href="#" className="hover:text-orange-600 transition-colors">Functional Foods</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Support */}
                    <div>
                        <h3 className="text-gray-900 dark:text-white font-bold text-base mb-4">Support</h3>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link href="#" className="hover:text-orange-600 transition-colors">Support Center</Link></li>
                            <li><Link href="#" className="hover:text-orange-600 transition-colors">How to Order</Link></li>
                            <li><Link href="#" className="hover:text-orange-600 transition-colors">Order Tracking</Link></li>
                            <li><Link href="#" className="hover:text-orange-600 transition-colors">Payment</Link></li>
                            <li><Link href="#" className="hover:text-orange-600 transition-colors">Shipping</Link></li>
                            <li><Link href="#" className="hover:text-orange-600 transition-colors">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Column 5: Consumer Policy */}
                    <div>
                        <h3 className="text-gray-900 dark:text-white font-bold text-base mb-4">Consumer Policy</h3>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link href="#" className="hover:text-orange-600 transition-colors">Happy Return</Link></li>
                            <li><Link href="#" className="hover:text-orange-600 transition-colors">Refund Policy</Link></li>
                            <li><Link href="#" className="hover:text-orange-600 transition-colors">Exchange</Link></li>
                            <li><Link href="#" className="hover:text-orange-600 transition-colors">Cancellation</Link></li>
                            <li><Link href="#" className="hover:text-orange-600 transition-colors">Pre-Order</Link></li>
                            <li><Link href="#" className="hover:text-orange-600 transition-colors">Extra Discount</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Middle Section: Download App */}
                <div className="py-6 border-t border-gray-100 dark:border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Download App on Mobile :</p>
                        <div className="flex items-center gap-3">
                            {/* Google Play Button */}
                            <a href="#" className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors">
                                <span className="text-xs">GET IT ON</span>
                                <span className="text-sm font-bold">Google Play</span>
                            </a>
                            {/* App Store Button */}
                            <a href="#" className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors">
                                <span className="text-xs">Download on the</span>
                                <span className="text-sm font-bold">App Store</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Copyright & Payment Gateways */}
                <div className="pt-6 border-t border-gray-200 dark:border-neutral-800 flex flex-col lg:flex-row items-center justify-between gap-4 text-sm text-gray-500">
                    <p>© 2026 MoveOn. All rights reserved.</p>

                    {/* Pay With / Payment Badges */}
                    <div className="flex items-center flex-wrap gap-2 justify-end">
                        <span className="text-xs font-semibold mr-2">Pay With</span>
                        <div className="bg-white p-1 border rounded flex items-center gap-1 shadow-sm">
                            <span className="text-[10px] font-bold px-1 bg-blue-600 text-white rounded">VISA</span>
                            <span className="text-[10px] font-bold px-1 bg-red-600 text-white rounded">Mastercard</span>
                            <span className="text-[10px] font-bold px-1 bg-sky-500 text-white rounded">BKASH</span>
                            <span className="text-[10px] font-bold px-1 bg-rose-600 text-white rounded">NAGAD</span>
                            <span className="text-[10px] font-bold px-1 bg-purple-600 text-white rounded">SSLCOMMERZ</span>
                        </div>
                    </div>
                </div>

            </div>
        </footer>
    );
}
