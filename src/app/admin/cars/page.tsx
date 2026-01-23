import Link from 'next/link';
import { Plus, Search, Edit2, Trash2, MoreHorizontal, Filter } from 'lucide-react';
import Image from 'next/image';

const CARS = [
    { id: '1', name: 'Model 3', brand: 'Tesla', type: 'Luxury', price: '$95', status: 'Available', img: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80' },
    { id: '2', name: '911 Carrera', brand: 'Porsche', type: 'Sports', price: '$250', status: 'On Rent', img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80' },
    { id: '3', name: 'Range Rover', brand: 'Land Rover', type: 'SUV', price: '$180', status: 'Maintenance', img: 'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?auto=format&fit=crop&q=80' },
];

export default function AdminCarsPage() {
    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Car Fleet</h1>
                    <p className="text-gray-500 font-medium">Manage your vehicles and their availability.</p>
                </div>
                <Link
                    href="/admin/cars/new"
                    className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:-translate-y-0.5"
                >
                    <Plus className="h-5 w-5" />
                    <span>Add New Vehicle</span>
                </Link>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by brand or model..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-sm font-medium"
                        />
                    </div>
                    <div className="flex items-center space-x-3 w-full md:w-auto">
                        <button className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-gray-100 bg-white text-sm font-bold text-gray-600 hover:bg-gray-50">
                            <Filter className="h-4 w-4" />
                            <span>Type: All</span>
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-gray-100 bg-white text-sm font-bold text-gray-600 hover:bg-gray-50">
                            <Filter className="h-4 w-4" />
                            <span>Status: All</span>
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-xs font-black uppercase tracking-widest text-gray-400">
                                <th className="px-8 py-5">Vehicle</th>
                                <th className="px-8 py-5">Category</th>
                                <th className="px-8 py-5">Price/Day</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 border-t">
                            {CARS.map((car, i) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center space-x-4">
                                            <div className="relative h-14 w-20 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                                                <Image src={car.img} alt={car.name} fill className="object-cover" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900 leading-tight">{car.brand} {car.name}</p>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter mt-1">ID: #C-{car.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-sm font-bold text-gray-700">{car.type}</td>
                                    <td className="px-8 py-5 text-sm font-black text-blue-600">{car.price}</td>
                                    <td className="px-8 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${car.status === 'Available' ? 'bg-emerald-100 text-emerald-700' :
                                                car.status === 'On Rent' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-orange-100 text-orange-700'
                                            }`}>
                                            {car.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center space-x-2">
                                            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
