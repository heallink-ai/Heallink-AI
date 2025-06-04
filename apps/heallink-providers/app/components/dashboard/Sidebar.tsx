"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Calendar, 
  FileText, 
  Settings,
  LogOut,
  X,
  Stethoscope
} from "lucide-react";
import { signOut } from "next-auth/react";

interface SidebarProps {
  onClose: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Doctors", href: "/dashboard/doctors", icon: UserCheck },
  { name: "Staff", href: "/dashboard/staff", icon: Users },
  { name: "Appointments", href: "/dashboard/appointments", icon: Calendar },
  { name: "Reports", href: "/dashboard/reports", icon: FileText },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ 
      callbackUrl: "/signin",
      redirect: true 
    });
  };

  return (
    <div className="h-full flex flex-col neumorph-flat bg-card/50 backdrop-blur-xl border-r border-border/50">
      {/* Logo and close button */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-border/50">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-gradient-to-br from-purple-heart to-royal-blue rounded-lg flex items-center justify-center">
            <Stethoscope className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold gradient-text">HealLink Provider</h1>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group flex items-center px-4 py-3 text-sm font-medium rounded-xl 
                transition-all duration-200 ease-in-out
                ${
                  isActive
                    ? "bg-gradient-to-r from-purple-heart to-royal-blue text-white shadow-lg transform scale-[1.02]"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:transform hover:scale-[1.01]"
                }
              `}
              onClick={onClose}
            >
              <item.icon className={`mr-3 h-5 w-5 transition-transform group-hover:scale-110 ${
                isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground"
              }`} />
              <span className="truncate">{item.name}</span>
              {isActive && (
                <div className="ml-auto h-2 w-2 bg-white rounded-full animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section and sign out */}
      <div className="p-4 border-t border-border/50 space-y-3">
        {/* User info */}
        <div className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-muted/30">
          <div className="h-8 w-8 bg-gradient-to-br from-purple-heart to-royal-blue rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">P</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">Provider</p>
            <p className="text-xs text-muted-foreground truncate">Healthcare Professional</p>
          </div>
        </div>
        
        {/* Sign out button */}
        <button
          onClick={handleSignOut}
          className="flex w-full items-center px-4 py-3 text-sm font-medium text-muted-foreground rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 group"
        >
          <LogOut className="mr-3 h-5 w-5 group-hover:transform group-hover:scale-110 transition-transform" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}