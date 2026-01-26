import Link from 'next/link';
import { Car, Search, Menu, User } from 'lucide-react';

export default function Header() {
    return (
        <header className="sticky top-0 left-0 right-0 z-50 w-full transition-all duration-300 bg-transparent backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center space-x-2">
                    <Car className="h-8 w-8 text-blue-600" />
                    <span className="text-xl font-bold tracking-tight text-gray-900">
                        Car<span className="text-blue-600">Rent</span>
                    </span>
                </Link>

                <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
                    <Link href="/" className="transition-colors hover:text-blue-600">Home</Link>
                    <Link href="/cars" className="transition-colors hover:text-blue-600">Browse Cars</Link>
                    <Link href="/about" className="transition-colors hover:text-blue-600">About Us</Link>
                    <Link href="/contact" className="transition-colors hover:text-blue-600">Contact</Link>
                </nav>

                <div className="flex items-center space-x-4">
                    <button className="p-2 text-gray-600 hover:text-blue-600 md:hidden">
                        <Search className="h-5 w-5" />
                    </button>
                    <Link
                        href="/admin"
                        className="hidden items-center space-x-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-200 md:flex"
                    >
                        <User className="h-4 w-4" />
                        <span>Admin</span>
                    </Link>
                    <button className="p-2 text-gray-600 hover:text-blue-600 md:hidden">
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </header>
    );
}
