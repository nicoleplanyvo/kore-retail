import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  href?: string; // if undefined = current page (not clickable)
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-1.5 text-xs text-gray-500 font-body">
        <li>
          <Link to="/app" className="hover:text-gray-700 transition-colors flex items-center" aria-label="Startseite">
            <Home size={13} />
          </Link>
        </li>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5" {...(isLast && !item.href ? { 'aria-current': 'page' as const } : {})}>
              <ChevronRight size={12} className="text-gray-300" aria-hidden="true" />
              {item.href ? (
                <Link to={item.href} className="hover:text-gray-700 transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-700 font-medium">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
