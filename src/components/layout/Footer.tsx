import Link from 'next/link';
import { Car, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center space-x-2 text-white">
                            <Car className="h-8 w-8 text-blue-500" />
                            <span className="text-xl font-bold tracking-tight">
                                Car<span className="text-blue-500">Rent</span>
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed">
                            Experience the freedom of the road with our premium car rental services. Affordable, reliable, and always ready for your next adventure.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="#" className="hover:text-blue-500 transition-colors">
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="hover:text-blue-500 transition-colors">
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="hover:text-blue-500 transition-colors">
                                <Instagram className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h3>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="/cars" className="hover:text-white transition-colors">Our Fleet</Link></li>
                            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing Plans</Link></li>
                            <li><Link href="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-white">Support</h3>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="/contact" className="hover:text-white transition-colors">Help Center</Link></li>
                            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/booking" className="hover:text-white transition-colors">Booking Guide</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-white">Contact Info</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-center space-x-3">
                                <MapPin className="h-5 w-5 text-blue-500" />
                                <span>123 Rental Blvd, City Center</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone className="h-5 w-5 text-blue-500" />
                                <span>+1 (234) 567-890</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 text-blue-500" />
                                <span>support@carrent.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-gray-800 pt-8 text-center text-xs">
                    <p>&copy; {new Date().getFullYear()} CarRent. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
