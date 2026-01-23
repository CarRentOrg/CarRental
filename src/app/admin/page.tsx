import {
    Users, Car, CalendarCheck, DollarSign,
    TrendingUp, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

const STATS = [
    { label: 'Total Revenue', value: '$24,560', change: '+12.5%', isUp: true, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Bookings', value: '142', change: '+8.2%', isUp: true, icon: CalendarCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Fleet', value: '48', change: '-2.1%', isUp: false, icon: Car, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'New Customers', value: '31', change: '+18.4%', isUp: true, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
];

const RECENT_BOOKINGS = [
    { id: '#BK-8821', customer: 'John Doe', car: 'Tesla Model 3', status: 'Confirmed', amount: '$346.50', date: 'Oct 24, 2023' },
    { id: '#BK-8820', customer: 'Jane Smith', car: 'Porsche 911', status: 'Pending', amount: '$750.00', date: 'Oct 23, 2023' },
    { id: '#BK-8819', customer: 'Mike Johnson', car: 'Range Rover', status: 'Cancelled', amount: '$540.00', date: 'Oct 23, 2023' },
    { id: '#BK-8818', customer: 'Sarah Brown', car: 'Toyota Camry', status: 'Confirmed', amount: '$165.00', date: 'Oct 22, 2023' },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-10 pb-12">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h1>
                <p className="text-gray-500 font-medium">Welcome back, Admin! Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {STATS.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                        <div className="flex justify-between items-start">
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <div className={`flex items-center space-x-1 text-sm font-bold ${stat.isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                                <span>{stat.change}</span>
                                {stat.isUp ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                            <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Bookings Table */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
                        <button className="text-sm font-bold text-blue-600 hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 text-xs font-black uppercase tracking-widest text-gray-400">
                                    <th className="px-8 py-5">Order ID</th>
                                    <th className="px-8 py-5">Customer</th>
                                    <th className="px-8 py-5">Car</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {RECENT_BOOKINGS.map((booking, i) => (
                                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-5 text-sm font-bold text-blue-600">{booking.id}</td>
                                        <td className="px-8 py-5 text-sm font-bold text-gray-900">{booking.customer}</td>
                                        <td className="px-8 py-5 text-sm text-gray-500 font-medium">{booking.car}</td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${booking.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' :
                                                    booking.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                                                        'bg-red-100 text-red-700'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-sm font-black text-gray-900">{booking.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Fleet Distribution / Quick Analytics */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 space-y-8">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900">Fleet Status</h2>
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-bold">
                                <span className="text-gray-500">Available</span>
                                <span className="text-gray-900">32 Cars</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '65%' }} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-bold">
                                <span className="text-gray-500">On Rent</span>
                                <span className="text-gray-900">12 Cars</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: '25%' }} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-bold">
                                <span className="text-gray-500">Maintenance</span>
                                <span className="text-gray-900">4 Cars</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-500 rounded-full" style={{ width: '10%' }} />
                            </div>
                        </div>
                    </div>
                    <div className="pt-6 border-t border-dashed">
                        <button className="w-full py-4 rounded-2xl bg-gray-900 text-white font-bold text-sm transition-all hover:bg-gray-800">
                            Generate Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
