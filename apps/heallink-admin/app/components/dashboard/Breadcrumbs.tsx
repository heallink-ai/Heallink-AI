"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

type BreadcrumbSegment = {
  name: string;
  href: string;
  current: boolean;
};

export default function Breadcrumbs() {
  const pathname = usePathname();

  // Generate breadcrumbs based on the current path
  const generateBreadcrumbs = (): BreadcrumbSegment[] => {
    // Skip if we're at the dashboard root
    if (pathname === "/dashboard") {
      return [{ name: "Dashboard", href: "/dashboard", current: true }];
    }

    // Split the pathname into segments
    const segments = pathname.split("/").filter((segment) => segment !== "");

    // Create breadcrumb items
    const breadcrumbs: BreadcrumbSegment[] = [];

    // Always add Dashboard as the first item
    breadcrumbs.push({
      name: "Dashboard",
      href: "/dashboard",
      current: pathname === "/dashboard",
    });

    // Build up the breadcrumb trail
    let path = "";
    segments.forEach((segment, index) => {
      // Skip the first "dashboard" segment since we've already added it
      if (index === 0 && segment === "dashboard") return;

      path += `/${segment}`;
      const fullPath = index === 0 ? path : `/dashboard${path}`;

      // Format the segment name (capitalize first letter, replace hyphens)
      const name = segment
        .replace(/-/g, " ")
        .replace(/^\w/, (c) => c.toUpperCase());

      breadcrumbs.push({
        name,
        href: fullPath,
        current:
          index === segments.length - 1 ||
          (index === segments.length - 2 &&
            segments[segments.length - 1] === ""),
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav className="px-4 py-3 flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 text-sm text-[color:var(--muted-foreground)]">
        <li className="flex items-center">
          <Link
            href="/dashboard"
            className="flex items-center hover:text-[color:var(--foreground)] transition-colors"
          >
            <Home size={14} />
          </Link>
        </li>

        {breadcrumbs.map((breadcrumb) => (
          <li key={breadcrumb.href} className="flex items-center">
            <ChevronRight size={14} className="mx-1" />
            <Link
              href={breadcrumb.href}
              className={`${
                breadcrumb.current
                  ? "font-medium text-[color:var(--foreground)]"
                  : "hover:text-[color:var(--foreground)] transition-colors"
              }`}
              aria-current={breadcrumb.current ? "page" : undefined}
            >
              {breadcrumb.name}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
