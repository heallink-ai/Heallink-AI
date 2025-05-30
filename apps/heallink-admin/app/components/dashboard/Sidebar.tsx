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
  Stethoscope,
  Pill,
  CreditCard,
  Globe,
  Shield,
  Database,
  Video,
  Zap,
  AlertTriangle,
  TrendingUp,
  UserCog,
  Settings,
  Sparkles,
  HeartHandshake,
  MapPin,
  Clock,
  Brain,
  FileHeart,
  Wifi,
  Lock,
  Eye,
} from "lucide-react";

type MenuItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
  current?: boolean;
  submenu?: MenuItem[];
  badge?: string | number;
  badgeColor?: string;
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
    "Healthcare Management": true,
    "System Operations": false,
  });

  const navigation: MenuItem[] = [
    {
      name: "Dashboard Home",
      href: "/dashboard",
      icon: <LayoutDashboard size={18} />,
      current: pathname === "/dashboard",
    },
    {
      name: "Healthcare Management",
      href: "/dashboard/healthcare",
      icon: <Stethoscope size={18} />,
      current: pathname.startsWith("/dashboard/healthcare"),
      submenu: [
        {
          name: "Medical Records",
          href: "/dashboard/healthcare/records",
          icon: <FileHeart size={16} />,
          current: pathname === "/dashboard/healthcare/records",
          badge: "HIPAA",
          badgeColor: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
        },
        {
          name: "Prescriptions",
          href: "/dashboard/healthcare/prescriptions",
          icon: <Pill size={16} />,
          current: pathname === "/dashboard/healthcare/prescriptions",
          badge: "12",
          badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
        },
        {
          name: "Emergency Access",
          href: "/dashboard/healthcare/emergency",
          icon: <AlertTriangle size={16} />,
          current: pathname === "/dashboard/healthcare/emergency",
        },
        {
          name: "Health Analytics",
          href: "/dashboard/healthcare/analytics",
          icon: <Brain size={16} />,
          current: pathname === "/dashboard/healthcare/analytics",
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
          name: "All Patients",
          href: "/dashboard/users",
          icon: <Users size={16} />,
          current: pathname === "/dashboard/users",
          badge: "2.4k",
          badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
        },
        {
          name: "Add New Patient",
          href: "/dashboard/users/add",
          icon: <UserPlus size={16} />,
          current: pathname === "/dashboard/users/add",
        },
        {
          name: "Patient Groups",
          href: "/dashboard/users/groups",
          icon: <Users size={16} />,
          current: pathname === "/dashboard/users/groups",
        },
        {
          name: "Insurance Management",
          href: "/dashboard/users/insurance",
          icon: <Shield size={16} />,
          current: pathname === "/dashboard/users/insurance",
        },
      ],
    },
    {
      name: "Provider Network",
      href: "/dashboard/providers",
      icon: <Building2 size={18} />,
      current: pathname.startsWith("/dashboard/providers"),
      submenu: [
        {
          name: "Provider Directory",
          href: "/dashboard/providers",
          icon: <Building2 size={16} />,
          current: pathname === "/dashboard/providers",
          badge: "850",
          badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
        },
        {
          name: "Hospitals",
          href: "/dashboard/providers/hospitals",
          icon: <Hospital size={16} />,
          current: pathname === "/dashboard/providers/hospitals",
          badge: "45",
          badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
        },
        {
          name: "Clinics & Practices",
          href: "/dashboard/providers/clinics",
          icon: <Stethoscope size={16} />,
          current: pathname === "/dashboard/providers/clinics",
          badge: "320",
          badgeColor: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
        },
        {
          name: "Pharmacies",
          href: "/dashboard/providers/pharmacies",
          icon: <Pill size={16} />,
          current: pathname === "/dashboard/providers/pharmacies",
          badge: "485",
          badgeColor: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
        },
        {
          name: "Onboarding",
          href: "/dashboard/providers/onboarding",
          icon: <UserPlus size={16} />,
          current: pathname === "/dashboard/providers/onboarding",
        },
        {
          name: "Geographic Coverage",
          href: "/dashboard/providers/coverage",
          icon: <MapPin size={16} />,
          current: pathname === "/dashboard/providers/coverage",
        },
      ],
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
          icon: <UserCog size={16} />,
          current: pathname === "/dashboard/admins",
          badge: "12",
          badgeColor: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400",
        },
        {
          name: "Invite Admin",
          href: "/dashboard/admins/invite",
          icon: <UserPlus size={16} />,
          current: pathname === "/dashboard/admins/invite",
        },
        {
          name: "Permissions",
          href: "/dashboard/admins/permissions",
          icon: <Lock size={16} />,
          current: pathname === "/dashboard/admins/permissions",
        },
      ],
    },
    {
      name: "Appointments & Care",
      href: "/dashboard/appointments",
      icon: <CalendarCheck size={18} />,
      current: pathname.startsWith("/dashboard/appointments"),
      submenu: [
        {
          name: "Live Appointments",
          href: "/dashboard/appointments",
          icon: <CalendarCheck size={16} />,
          current: pathname === "/dashboard/appointments",
          badge: "24",
          badgeColor: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
        },
        {
          name: "Telehealth Sessions",
          href: "/dashboard/appointments/telehealth",
          icon: <Video size={16} />,
          current: pathname === "/dashboard/appointments/telehealth",
          badge: "8",
          badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
        },
        {
          name: "Bulk Reschedule",
          href: "/dashboard/appointments/bulk",
          icon: <CalendarClock size={16} />,
          current: pathname === "/dashboard/appointments/bulk",
        },
        {
          name: "Wait Times",
          href: "/dashboard/appointments/wait-times",
          icon: <Clock size={16} />,
          current: pathname === "/dashboard/appointments/wait-times",
        },
      ],
    },
    {
      name: "Pharmacy Network",
      href: "/dashboard/pharmacy",
      icon: <Pill size={18} />,
      current: pathname.startsWith("/dashboard/pharmacy"),
      submenu: [
        {
          name: "Partner Network",
          href: "/dashboard/pharmacy",
          icon: <Pill size={16} />,
          current: pathname === "/dashboard/pharmacy",
          badge: "485",
          badgeColor: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
        },
        {
          name: "Prescription Orders",
          href: "/dashboard/pharmacy/orders",
          icon: <ShoppingBasket size={16} />,
          current: pathname === "/dashboard/pharmacy/orders",
          badge: "156",
          badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
        },
        {
          name: "Price Monitoring",
          href: "/dashboard/pharmacy/pricing",
          icon: <TrendingUp size={16} />,
          current: pathname === "/dashboard/pharmacy/pricing",
        },
        {
          name: "Stock Alerts",
          href: "/dashboard/pharmacy/stock",
          icon: <AlertTriangle size={16} />,
          current: pathname === "/dashboard/pharmacy/stock",
          badge: "3",
          badgeColor: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
        },
        {
          name: "Delivery Tracking",
          href: "/dashboard/pharmacy/delivery",
          icon: <Truck size={16} />,
          current: pathname === "/dashboard/pharmacy/delivery",
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
          badge: "89",
          badgeColor: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400",
        },
        {
          name: "Payment Processing",
          href: "/dashboard/billing/payments",
          icon: <CreditCard size={16} />,
          current: pathname === "/dashboard/billing/payments",
        },
        {
          name: "Insurance Claims",
          href: "/dashboard/billing/insurance",
          icon: <Shield size={16} />,
          current: pathname === "/dashboard/billing/insurance",
        },
        {
          name: "Refunds & Disputes",
          href: "/dashboard/billing/refunds",
          icon: <ArrowLeftRight size={16} />,
          current: pathname === "/dashboard/billing/refunds",
        },
        {
          name: "Revenue Analytics",
          href: "/dashboard/billing/analytics",
          icon: <TrendingUp size={16} />,
          current: pathname === "/dashboard/billing/analytics",
        },
      ],
    },
    {
      name: "System Operations",
      href: "/dashboard/system",
      icon: <Activity size={18} />,
      current: pathname.startsWith("/dashboard/system"),
      submenu: [
        {
          name: "Live Health Monitor",
          href: "/dashboard/system/health",
          icon: <Activity size={16} />,
          current: pathname === "/dashboard/system/health",
          badge: "●",
          badgeColor: "bg-green-500 text-white animate-pulse",
        },
        {
          name: "API Management",
          href: "/dashboard/system/api",
          icon: <Webhook size={16} />,
          current: pathname === "/dashboard/system/api",
        },
        {
          name: "Database Status",
          href: "/dashboard/system/database",
          icon: <Database size={16} />,
          current: pathname === "/dashboard/system/database",
        },
        {
          name: "CDN & Performance",
          href: "/dashboard/system/performance",
          icon: <Zap size={16} />,
          current: pathname === "/dashboard/system/performance",
        },
        {
          name: "Security Center",
          href: "/dashboard/system/security",
          icon: <Lock size={16} />,
          current: pathname === "/dashboard/system/security",
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
          name: "Executive Dashboard",
          href: "/dashboard/analytics",
          icon: <BarChart4 size={16} />,
          current: pathname === "/dashboard/analytics",
        },
        {
          name: "Patient Flow",
          href: "/dashboard/analytics/patient-flow",
          icon: <TrendingUp size={16} />,
          current: pathname === "/dashboard/analytics/patient-flow",
        },
        {
          name: "Provider Performance",
          href: "/dashboard/analytics/providers",
          icon: <BarChartBig size={16} />,
          current: pathname === "/dashboard/analytics/providers",
        },
        {
          name: "Revenue Reports",
          href: "/dashboard/analytics/revenue",
          icon: <Receipt size={16} />,
          current: pathname === "/dashboard/analytics/revenue",
        },
        {
          name: "Custom Reports",
          href: "/dashboard/analytics/custom",
          icon: <FileText size={16} />,
          current: pathname === "/dashboard/analytics/custom",
        },
      ],
    },
    {
      name: "Communications",
      href: "/dashboard/communications",
      icon: <Bell size={18} />,
      current: pathname.startsWith("/dashboard/communications"),
      submenu: [
        {
          name: "System Alerts",
          href: "/dashboard/communications",
          icon: <Bell size={16} />,
          current: pathname === "/dashboard/communications",
          badge: "3",
          badgeColor: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
        },
        {
          name: "Patient Notifications",
          href: "/dashboard/communications/notifications",
          icon: <Megaphone size={16} />,
          current: pathname === "/dashboard/communications/notifications",
        },
        {
          name: "Email Campaigns",
          href: "/dashboard/communications/email",
          icon: <Globe size={16} />,
          current: pathname === "/dashboard/communications/email",
        },
        {
          name: "SMS Gateway",
          href: "/dashboard/communications/sms",
          icon: <Wifi size={16} />,
          current: pathname === "/dashboard/communications/sms",
        },
      ],
    },
    {
      name: "Compliance & Audit",
      href: "/dashboard/compliance",
      icon: <FileText size={18} />,
      current: pathname.startsWith("/dashboard/compliance"),
      submenu: [
        {
          name: "HIPAA Compliance",
          href: "/dashboard/compliance/hipaa",
          icon: <ShieldCheck size={16} />,
          current: pathname === "/dashboard/compliance/hipaa",
          badge: "CRITICAL",
          badgeColor: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
        },
        {
          name: "Audit Logs",
          href: "/dashboard/compliance/audit",
          icon: <Eye size={16} />,
          current: pathname === "/dashboard/compliance/audit",
        },
        {
          name: "Data Export",
          href: "/dashboard/compliance/export",
          icon: <Download size={16} />,
          current: pathname === "/dashboard/compliance/export",
        },
        {
          name: "Privacy Controls",
          href: "/dashboard/compliance/privacy",
          icon: <Lock size={16} />,
          current: pathname === "/dashboard/compliance/privacy",
        },
      ],
    },
    {
      name: "Integrations",
      href: "/dashboard/integrations",
      icon: <Webhook size={18} />,
      current: pathname.startsWith("/dashboard/integrations"),
      submenu: [
        {
          name: "API Keys",
          href: "/dashboard/integrations/api-keys",
          icon: <KeyRound size={16} />,
          current: pathname === "/dashboard/integrations/api-keys",
        },
        {
          name: "Third-party Apps",
          href: "/dashboard/integrations/apps",
          icon: <Globe size={16} />,
          current: pathname === "/dashboard/integrations/apps",
        },
        {
          name: "Webhooks",
          href: "/dashboard/integrations/webhooks",
          icon: <Webhook size={16} />,
          current: pathname === "/dashboard/integrations/webhooks",
        },
        {
          name: "AI Services",
          href: "/dashboard/integrations/ai",
          icon: <Brain size={16} />,
          current: pathname === "/dashboard/integrations/ai",
          badge: "NEW",
          badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
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
          name: "General Settings",
          href: "/dashboard/settings",
          icon: <Settings size={16} />,
          current: pathname === "/dashboard/settings",
        },
        {
          name: "Feature Flags",
          href: "/dashboard/settings/features",
          icon: <Sparkles size={16} />,
          current: pathname === "/dashboard/settings/features",
        },
        {
          name: "System Health",
          href: "/dashboard/settings/health",
          icon: <HeartHandshake size={16} />,
          current: pathname === "/dashboard/settings/health",
        },
        {
          name: "Backup & Recovery",
          href: "/dashboard/settings/backup",
          icon: <Database size={16} />,
          current: pathname === "/dashboard/settings/backup",
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

  const renderBadge = (badge?: string | number, badgeColor?: string) => {
    if (!badge) return null;
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badgeColor || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
        {badge}
      </span>
    );
  };

  return (
    <nav
      className={`flex flex-col bg-gradient-to-b from-[color:var(--sidebar)] to-[color:var(--sidebar)]/95 border-r border-[color:var(--border)]/50 h-full transition-all duration-300 ${
        collapsed ? "w-[64px]" : "w-[260px]"
      } backdrop-blur-sm overflow-hidden`}
    >
      <div className="flex flex-col h-full min-w-0">
        {/* Sidebar Header */}
        <div className={`border-b border-[color:var(--border)]/30 transition-all duration-300 ${collapsed ? "p-3" : "p-4"}`}>
          <div className="flex items-center gap-3">
            <div className="relative group flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                H
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-lg" />
            </div>
            <div className={`transition-all duration-300 overflow-hidden ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
              <h1 className="font-bold text-base bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent whitespace-nowrap">
                Heallink
              </h1>
              <p className="text-xs text-[color:var(--muted-foreground)] font-medium whitespace-nowrap">
                Healthcare Admin
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar content */}
        <div className="flex-1 px-2 py-3 overflow-y-auto overflow-x-hidden custom-scrollbar min-w-0">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isSubmenuOpen = openSubmenus[item.name];
              const hasSubmenu = item.submenu && item.submenu.length > 0;

              return (
                <li key={item.name}>
                  {hasSubmenu ? (
                    <div>
                      <button
                        className={`group w-full flex items-center justify-between rounded-lg transition-all duration-200 ${
                          collapsed 
                            ? "px-0 py-2.5 justify-center" 
                            : "px-2.5 py-2.5"
                        } ${
                          item.current
                            ? collapsed
                              ? "bg-gradient-to-r from-[color:var(--primary)]/30 to-[color:var(--primary)]/20 text-[color:var(--primary)] shadow-lg"
                              : "bg-gradient-to-r from-[color:var(--primary)]/20 to-[color:var(--primary)]/10 text-[color:var(--primary)] shadow-md"
                            : "hover:bg-[color:var(--accent)]/50 text-[color:var(--foreground)]"
                        }`}
                        onClick={() => toggleSubmenu(item.name)}
                      >
                        <div className={`flex items-center min-w-0 ${
                          collapsed ? "justify-center" : "gap-2.5 flex-1"
                        }`}>
                          <div className={`transition-all duration-200 flex-shrink-0 ${
                            collapsed 
                              ? "p-2 rounded-lg" 
                              : "p-1.5 rounded-lg"
                          } ${
                            item.current 
                              ? collapsed
                                ? "bg-[color:var(--primary)]/25 text-[color:var(--primary)] shadow-md"
                                : "bg-[color:var(--primary)]/20 text-[color:var(--primary)]"
                              : "text-[color:var(--muted-foreground)] group-hover:text-[color:var(--foreground)] group-hover:bg-[color:var(--accent)]"
                          }`}>
                            {item.icon}
                          </div>
                          <div className={`transition-all duration-300 overflow-hidden ${
                            collapsed ? "w-0 opacity-0" : "flex-1 opacity-100"
                          }`}>
                            <span className="text-sm font-medium truncate block">
                              {item.name}
                            </span>
                          </div>
                        </div>
                        <div className={`flex items-center gap-1.5 flex-shrink-0 transition-all duration-300 ${
                          collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
                        }`}>
                          {item.badge && renderBadge(item.badge, item.badgeColor)}
                          <div className={`transition-transform duration-200 ${
                            isSubmenuOpen ? "rotate-180" : ""
                          }`}>
                            {isSubmenuOpen ? (
                              <ChevronDown size={12} className="text-[color:var(--muted-foreground)]" />
                            ) : (
                              <ChevronRight size={12} className="text-[color:var(--muted-foreground)]" />
                            )}
                          </div>
                        </div>
                      </button>

                      <div className={`overflow-hidden transition-all duration-300 ${
                        !collapsed && isSubmenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}>
                        <ul className="mt-1 ml-3 space-y-0.5 border-l-2 border-[color:var(--border)]/30 pl-3">
                          {item.submenu?.map((subItem) => (
                            <li key={subItem.name}>
                              <Link
                                href={subItem.href}
                                className={`group flex items-center gap-2 px-2 py-2 rounded-md transition-all duration-200 ${
                                  subItem.current
                                    ? "bg-gradient-to-r from-[color:var(--primary)]/15 to-[color:var(--primary)]/5 text-[color:var(--primary)] shadow-sm"
                                    : "hover:bg-[color:var(--accent)]/30 text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]"
                                }`}
                              >
                                <div className={`p-1 rounded-md transition-all duration-200 flex-shrink-0 ${
                                  subItem.current 
                                    ? "bg-[color:var(--primary)]/20 text-[color:var(--primary)]" 
                                    : "text-[color:var(--muted-foreground)] group-hover:text-[color:var(--foreground)] group-hover:bg-[color:var(--accent)]"
                                }`}>
                                  {subItem.icon}
                                </div>
                                <span className="text-xs font-medium flex-1 truncate">
                                  {subItem.name}
                                </span>
                                {subItem.badge && (
                                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${subItem.badgeColor || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
                                    {subItem.badge}
                                  </span>
                                )}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`group flex items-center rounded-lg transition-all duration-200 ${
                        collapsed 
                          ? "px-0 py-2.5 justify-center" 
                          : "px-2.5 py-2.5 justify-between"
                      } ${
                        item.current
                          ? collapsed
                            ? "bg-gradient-to-r from-[color:var(--primary)]/30 to-[color:var(--primary)]/20 text-[color:var(--primary)] shadow-lg"
                            : "bg-gradient-to-r from-[color:var(--primary)]/20 to-[color:var(--primary)]/10 text-[color:var(--primary)] shadow-md"
                          : "hover:bg-[color:var(--accent)]/50 text-[color:var(--foreground)]"
                      }`}
                    >
                      <div className={`flex items-center min-w-0 ${
                        collapsed ? "justify-center" : "gap-2.5 flex-1"
                      }`}>
                        <div className={`transition-all duration-200 flex-shrink-0 ${
                          collapsed 
                            ? "p-2 rounded-lg" 
                            : "p-1.5 rounded-lg"
                        } ${
                          item.current 
                            ? collapsed
                              ? "bg-[color:var(--primary)]/25 text-[color:var(--primary)] shadow-md"
                              : "bg-[color:var(--primary)]/20 text-[color:var(--primary)]"
                            : "text-[color:var(--muted-foreground)] group-hover:text-[color:var(--foreground)] group-hover:bg-[color:var(--accent)]"
                        }`}>
                          {item.icon}
                        </div>
                        <div className={`transition-all duration-300 overflow-hidden ${
                          collapsed ? "w-0 opacity-0" : "flex-1 opacity-100"
                        }`}>
                          <span className="text-sm font-medium truncate">
                            {item.name}
                          </span>
                        </div>
                      </div>
                      <div className={`flex-shrink-0 transition-all duration-300 ${
                        collapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
                      }`}>
                        {item.badge && renderBadge(item.badge, item.badgeColor)}
                      </div>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Collapse button at the bottom */}
        <div className="p-3 border-t border-[color:var(--border)]/30">
          <button
            onClick={toggleSidebar}
            className="group flex items-center justify-center w-full p-2.5 rounded-lg hover:bg-[color:var(--accent)]/50 transition-all duration-200"
          >
            <ChevronLeft 
              size={16} 
              className={`text-[color:var(--muted-foreground)] group-hover:text-[color:var(--foreground)] transition-transform duration-300 ${
                collapsed ? "rotate-180" : ""
              }`} 
            />
            <span className={`text-sm font-medium text-[color:var(--muted-foreground)] group-hover:text-[color:var(--foreground)] transition-all duration-300 overflow-hidden ${
              collapsed ? "w-0 ml-0 opacity-0" : "w-auto ml-2 opacity-100"
            }`}>
              Collapse
            </span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground) / 0.3);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.5);
        }
      `}</style>
    </nav>
  );
}