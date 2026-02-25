"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

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
  actions,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        {breadcrumbs && (
          <nav className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-widest">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && (
                  <ChevronRight className="h-3 w-3 text-gray-300" />
                )}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gray-900">{crumb.label}</span>
                )}
              </div>
            ))}
          </nav>
        )}
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 mb-2">
          {title}
        </h1>
        {description && (
          <p className="text-gray-500 font-medium text-sm md:text-base max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex flex-wrap items-center gap-3">{actions}</div>
      )}
    </div>
  );
}
