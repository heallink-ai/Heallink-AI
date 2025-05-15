"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Building2,
  CalendarCheck,
  CalendarClock,
  ShoppingBasket,
  Truck,
  Receipt,
  ArrowLeftRight,
  BarChart4,
  BarChartBig,
  Bell,
  Megaphone,
  Webhook,
  KeyRound,
  FileText,
  Download,
  Cog,
  ShieldCheck,
  Activity,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Hospital,
} from "lucide-react";

type MenuItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
  current?: boolean;
  submenu?: MenuItem[];
};

export default function Sidebar({
  collapsed,
  toggleSidebar,
}: {
  collapsed: boolean;
  toggleSidebar: () => void;
}) {
  const pathname = usePathname();
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({
    "Providers Management": true,
  });

  const navigation: MenuItem[] = [
    {
      name: "Dashboard Home",
      href: "/dashboard",
      icon: <LayoutDashboard size={18} />,
      current: pathname === "/dashboard",
    },
    {
      name: "Admin Management",
      href: "/dashboard/admins",
      icon: <ShieldCheck size={18} />,
      current:
        pathname === "/dashboard/admins" ||
        pathname.startsWith("/dashboard/admins/"),
      submenu: [
        {
          name: "Admin List",
          href: "/dashboard/admins",
          icon: <Users size={16} />,
          current: pathname === "/dashboard/admins",
        },
        {
          name: "Invite Admin",
          href: "/dashboard/admins/invite",
          icon: <UserPlus size={16} />,
          current: pathname === "/dashboard/admins/invite",
        },
      ],
    },
    {
      name: "User Management",
      href: "/dashboard/users",
      icon: <Users size={18} />,
      current:
        pathname === "/dashboard/users" ||
        pathname.startsWith("/dashboard/users/"),
      submenu: [
        {
          name: "All Users",
          href: "/dashboard/users",
          icon: <Users size={16} />,
          current: pathname === "/dashboard/users",
        },
        {
          name: "Add New User",
          href: "/dashboard/users/add",
          icon: <UserPlus size={16} />,
          current: pathname === "/dashboard/users/add",
        },
        {
          name: "User Groups",
          href: "/dashboard/users/groups",
          icon: <Users size={16} />,
          current: pathname === "/dashboard/users/groups",
        },
      ],
    },
    {
      name: "Providers Management",
      href: "/dashboard/providers",
      icon: <Building2 size={18} />,
      current: pathname.startsWith("/dashboard/providers"),
      submenu: [
        {
          name: "Provider Directory",
          href: "/dashboard/providers",
          icon: <Building2 size={16} />,
          current: pathname === "/dashboard/providers",
        },
        {
          name: "Hospitals",
          href: "/dashboard/providers/hospitals",
          icon: <Hospital size={16} />,
          current: pathname === "/dashboard/providers/hospitals",
        },
        {
          name: "Clinics",
          href: "/dashboard/providers/clinics",
          icon: <Building2 size={16} />,
          current: pathname === "/dashboard/providers/clinics",
        },
        {
          name: "Pharmacies",
          href: "/dashboard/providers/pharmacies",
          icon: <Building2 size={16} />,
          current: pathname === "/dashboard/providers/pharmacies",
        },
        {
          name: "Onboarding Wizard",
          href: "/dashboard/providers/onboarding",
          icon: <UserPlus size={16} />,
          current: pathname === "/dashboard/providers/onboarding",
        },
      ],
    },
    {
      name: "Appointments & Bookings",
      href: "/dashboard/appointments",
      icon: <CalendarCheck size={18} />,
      current: pathname.startsWith("/dashboard/appointments"),
      submenu: [
        {
          name: "Upcoming",
          href: "/dashboard/appointments",
          icon: <CalendarCheck size={16} />,
          current: pathname === "/dashboard/appointments",
        },
        {
          name: "Bulk Reschedule",
          href: "/dashboard/appointments/bulk",
          icon: <CalendarClock size={16} />,
          current: pathname === "/dashboard/appointments/bulk",
        },
      ],
    },
    {
      name: "Orders & Fulfillment",
      href: "/dashboard/orders",
      icon: <ShoppingBasket size={18} />,
      current: pathname.startsWith("/dashboard/orders"),
      submenu: [
        {
          name: "Prescription Orders",
          href: "/dashboard/orders",
          icon: <ShoppingBasket size={16} />,
          current: pathname === "/dashboard/orders",
        },
        {
          name: "Delivery & Pickup",
          href: "/dashboard/orders/delivery",
          icon: <Truck size={16} />,
          current: pathname === "/dashboard/orders/delivery",
        },
      ],
    },
    {
      name: "Billing & Payments",
      href: "/dashboard/billing",
      icon: <Receipt size={18} />,
      current: pathname.startsWith("/dashboard/billing"),
      submenu: [
        {
          name: "Invoices",
          href: "/dashboard/billing",
          icon: <Receipt size={16} />,
          current: pathname === "/dashboard/billing",
        },
        {
          name: "Refunds & Disputes",
          href: "/dashboard/billing/refunds",
          icon: <ArrowLeftRight size={16} />,
          current: pathname === "/dashboard/billing/refunds",
        },
      ],
    },
    {
      name: "Analytics & Reports",
      href: "/dashboard/analytics",
      icon: <BarChart4 size={18} />,
      current: pathname.startsWith("/dashboard/analytics"),
      submenu: [
        {
          name: "KPI Dashboards",
          href: "/dashboard/analytics",
          icon: <BarChart4 size={16} />,
          current: pathname === "/dashboard/analytics",
        },
        {
          name: "Custom Report Builder",
          href: "/dashboard/analytics/reports",
          icon: <BarChartBig size={16} />,
          current: pathname === "/dashboard/analytics/reports",
        },
      ],
    },
    {
      name: "Notifications",
      href: "/dashboard/notifications",
      icon: <Bell size={18} />,
      current: pathname.startsWith("/dashboard/notifications"),
      submenu: [
        {
          name: "System Alerts",
          href: "/dashboard/notifications",
          icon: <Bell size={16} />,
          current: pathname === "/dashboard/notifications",
        },
        {
          name: "Send Announcement",
          href: "/dashboard/notifications/announce",
          icon: <Megaphone size={16} />,
          current: pathname === "/dashboard/notifications/announce",
        },
      ],
    },
    {
      name: "Integrations & API",
      href: "/dashboard/integrations",
      icon: <Webhook size={18} />,
      current: pathname.startsWith("/dashboard/integrations"),
      submenu: [
        {
          name: "API Keys",
          href: "/dashboard/integrations",
          icon: <KeyRound size={16} />,
          current: pathname === "/dashboard/integrations",
        },
        {
          name: "Webhooks",
          href: "/dashboard/integrations/webhooks",
          icon: <Webhook size={16} />,
          current: pathname === "/dashboard/integrations/webhooks",
        },
      ],
    },
    {
      name: "Audit Logs",
      href: "/dashboard/audit",
      icon: <FileText size={18} />,
      current: pathname.startsWith("/dashboard/audit"),
      submenu: [
        {
          name: "Live Log Stream",
          href: "/dashboard/audit",
          icon: <Activity size={16} />,
          current: pathname === "/dashboard/audit",
        },
        {
          name: "Export Logs",
          href: "/dashboard/audit/export",
          icon: <Download size={16} />,
          current: pathname === "/dashboard/audit/export",
        },
      ],
    },
    {
      name: "Settings & Config",
      href: "/dashboard/settings",
      icon: <Cog size={18} />,
      current: pathname.startsWith("/dashboard/settings"),
      submenu: [
        {
          name: "Feature Flags",
          href: "/dashboard/settings",
          icon: <Cog size={16} />,
          current: pathname === "/dashboard/settings",
        },
        {
          name: "Roles & Permissions",
          href: "/dashboard/settings/roles",
          icon: <ShieldCheck size={16} />,
          current: pathname === "/dashboard/settings/roles",
        },
        {
          name: "Health Checks & SLAs",
          href: "/dashboard/settings/health",
          icon: <Activity size={16} />,
          current: pathname === "/dashboard/settings/health",
        },
      ],
    },
  ];

  const toggleSubmenu = (name: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <nav
      className={`flex flex-col bg-[color:var(--sidebar)] text-[color:var(--sidebar-foreground)] border-r border-[color:var(--border)] h-full transition-all duration-300 neumorph-flat ${
        collapsed ? "w-[64px]" : "w-[240px]"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar content */}
        <div className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isSubmenuOpen = openSubmenus[item.name];

              return (
                <li key={item.name}>
                  {item.submenu ? (
                    <div>
                      <button
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                          item.current
                            ? "admin-sidebar-link-active"
                            : "admin-sidebar-link"
                        }`}
                        onClick={() => toggleSubmenu(item.name)}
                      >
                        <div className="flex items-center gap-3">
                          {item.icon}
                          {!collapsed && (
                            <span className="text-sm whitespace-nowrap">
                              {item.name}
                            </span>
                          )}
                        </div>
                        {!collapsed && (
                          <>
                            {isSubmenuOpen ? (
                              <ChevronDown size={14} />
                            ) : (
                              <ChevronRight size={14} />
                            )}
                          </>
                        )}
                      </button>

                      {!collapsed && isSubmenuOpen && (
                        <ul className="pl-4 mt-1 space-y-1">
                          {item.submenu.map((subItem) => (
                            <li key={subItem.name}>
                              <Link
                                href={subItem.href}
                                className={`flex items-center gap-3 px-3 py-1.5 rounded-lg transition-colors ${
                                  subItem.current
                                    ? "admin-sidebar-link-active"
                                    : "admin-sidebar-link"
                                }`}
                              >
                                {subItem.icon}
                                <span className="text-sm">{subItem.name}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        item.current
                          ? "admin-sidebar-link-active"
                          : "admin-sidebar-link"
                      }`}
                    >
                      {item.icon}
                      {!collapsed && (
                        <span className="text-sm">{item.name}</span>
                      )}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Collapse button at the bottom */}
        <div className="p-4 border-t border-[color:var(--border)]">
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center w-full p-2 rounded-lg hover:bg-[color:var(--navbar-item-hover)] transition-colors"
          >
            {collapsed ? (
              <ChevronRight size={16} />
            ) : (
              <>
                <ChevronLeft size={16} />
                <span className="ml-2 text-xs">Collapse</span>
              </>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
