import Link from 'next/link';
import { Car, Instagram, Phone, MessageCircle } from 'lucide-react';

export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 bg-transparent backdrop-blur-md">
            <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-12">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="flex items-center justify-center p-2 rounded-lg bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-colors">
                        <Car className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">
                        Luxerra
                    </span>
                </Link>

                {/* Centered Navigation */}
                <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                    {['Cars', 'Rental Terms', 'News'].map((item) => (
                        <Link
                            key={item}
                            href={`/${item.toLowerCase().replace(' ', '-')}`}
                            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                        >
                            {item}
                        </Link>
                    ))}
                </nav>

                {/* Right Side Actions */}
                <div className="flex items-center gap-6">
                    <div className="hidden lg:flex items-center gap-4 text-gray-300">
                        <a href="#" className="hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>
                        <a href="#" className="hover:text-white transition-colors"><MessageCircle className="h-5 w-5" /></a>
                        <a href="#" className="hover:text-white transition-colors"><Phone className="h-5 w-5" /></a>
                    </div>

                    <Link
                        href="/cars"
                        className="hidden sm:inline-flex items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-105 active:scale-95"
                    >
                        Book Now
                    </Link>
                </div>
            </div>
        </header>
    );
}
