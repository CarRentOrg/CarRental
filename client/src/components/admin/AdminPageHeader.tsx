import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Breadcrumb {
    label: string;
    href?: string;
}

interface AdminPageHeaderProps {
    title: string;
    description?: string;
    breadcrumbs?: Breadcrumb[];
    actions?: React.ReactNode;
}

export default function AdminPageHeader({
    title,
    description,
    breadcrumbs,
    actions
}: AdminPageHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div className="space-y-2">
                {breadcrumbs && (
                    <nav className="flex items-center space-x-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        {breadcrumbs.map((crumb, i) => (
                            <div key={i} className="flex items-center space-x-2">
                                {i > 0 && <ChevronRight className="h-3 w-3" />}
                                {crumb.href ? (
                                    <Link href={crumb.href} className="hover:text-blue-600 transition-colors">
                                        {crumb.label}
                                    </Link>
                                ) : (
                                    <span className="text-gray-600">{crumb.label}</span>
                                )}
                            </div>
                        ))}
                    </nav>
                )}
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">{title}</h1>
                {description && <p className="text-gray-500 font-medium">{description}</p>}
            </div>
            {actions && (
                <div className="flex items-center gap-3">
                    {actions}
                </div>
            )}
        </div>
    );
}
