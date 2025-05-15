"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/app/theme/ThemeProvider";
import {
  Search,
  Filter,
  UserPlus,
  Download,
  Upload,
  Users,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Edit,
  Trash2,
  Lock,
  Mail,
} from "lucide-react";
import BackgroundGradient from "@/app/components/dashboard/BackgroundGradient";

// Mock user data
const MOCK_USERS = [
  {
    id: "u1",
    name: "James Wilson",
    email: "james.w@example.com",
    avatar: null,
    role: "Patient",
    status: "Active",
    lastActive: "2023-05-14T10:45:00",
    created: "2022-12-15T11:20:00",
  },
  {
    id: "u2",
    name: "Sophia Garcia",
    email: "s.garcia@example.com",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    role: "Patient",
    status: "Active",
    lastActive: "2023-05-10T14:30:00",
    created: "2022-11-05T09:00:00",
  },
  {
    id: "u3",
    name: "Michael Chen",
    email: "m.chen@example.com",
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    role: "Provider",
    status: "Inactive",
    lastActive: "2023-04-30T16:15:00",
    created: "2023-01-07T14:10:00",
  },
  {
    id: "u4",
    name: "Aisha Patel",
    email: "aisha.p@example.com",
    avatar: null,
    role: "Patient",
    status: "Active",
    lastActive: "2023-05-13T09:10:00",
    created: "2023-02-18T08:30:00",
  },
  {
    id: "u5",
    name: "Robert Kim",
    email: "r.kim@example.com",
    avatar: null,
    role: "Provider",
    status: "Pending",
    lastActive: null,
    created: "2023-05-05T11:45:00",
  },
  {
    id: "u6",
    name: "Emma Thompson",
    email: "emma.t@example.com",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    role: "Patient",
    status: "Active",
    lastActive: "2023-05-15T08:20:00",
    created: "2023-03-12T16:40:00",
  },
  {
    id: "u7",
    name: "David Rodriguez",
    email: "david.r@example.com",
    avatar: null,
    role: "Patient",
    status: "Inactive",
    lastActive: "2023-03-20T14:15:00",
    created: "2023-01-10T13:25:00",
  },
  {
    id: "u8",
    name: "Sarah Miller",
    email: "sarah.m@example.com",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    role: "Provider",
    status: "Active",
    lastActive: "2023-05-12T09:30:00",
    created: "2022-10-22T08:45:00",
  },
];

export default function UsersPage() {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState<string | null>(null);

  const usersPerPage = 5;

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const shadowColor =
    theme === "dark" ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.1)";

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // Filter users
  const filteredUsers = MOCK_USERS.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "All" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "All" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aVal = a[sortBy as keyof typeof a];
    const bVal = b[sortBy as keyof typeof b];

    if (aVal === null) return 1;
    if (bVal === null) return -1;

    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortOrder === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return sortOrder === "asc"
      ? (aVal as any) - (bVal as any)
      : (bVal as any) - (aVal as any);
  });

  // Paginate users
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Status badge component
  const UserStatusBadge = ({ status }: { status: string }) => {
    let bgColor = "";
    let textColor = "";

    switch (status) {
      case "Active":
        bgColor = "bg-green-500/20";
        textColor = "text-green-500";
        break;
      case "Inactive":
        bgColor = "bg-red-500/20";
        textColor = "text-red-500";
        break;
      case "Pending":
        bgColor = "bg-yellow-500/20";
        textColor = "text-yellow-500";
        break;
      default:
        bgColor = "bg-gray-500/20";
        textColor = "text-gray-500";
    }

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
      >
        {status}
      </span>
    );
  };

  // Role badge component
  const UserRoleBadge = ({ role }: { role: string }) => {
    let bgColor = "";
    let textColor = "";

    switch (role) {
      case "Patient":
        bgColor = "bg-blue-500/20";
        textColor = "text-blue-500";
        break;
      case "Provider":
        bgColor = "bg-purple-500/20";
        textColor = "text-purple-500";
        break;
      case "Admin":
        bgColor = "bg-red-500/20";
        textColor = "text-red-500";
        break;
      default:
        bgColor = "bg-gray-500/20";
        textColor = "text-gray-500";
    }

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
      >
        {role}
      </span>
    );
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  // Skeleton loader
  const Skeleton = ({ className }: { className?: string }) => (
    <div
      className={`animate-pulse bg-primary/10 rounded-lg ${className}`}
    ></div>
  );

  // Dropdown menu
  const DropdownMenu = ({ userId }: { userId: string }) => {
    const isOpen = isDropdownOpen === userId;

    return (
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(isOpen ? null : userId)}
          className="p-2 rounded-full hover:bg-primary/10"
        >
          <MoreHorizontal size={16} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-1 w-48 rounded-lg shadow-lg bg-card border border-border overflow-hidden z-50"
              style={{
                boxShadow: `0 10px 25px ${shadowColor}`,
              }}
            >
              <div className="py-1">
                <button
                  className="flex w-full items-center px-4 py-2 text-sm hover:bg-primary/10"
                  onClick={() => setIsDropdownOpen(null)}
                >
                  <Edit size={14} className="mr-2" />
                  Edit User
                </button>
                <button
                  className="flex w-full items-center px-4 py-2 text-sm hover:bg-primary/10"
                  onClick={() => setIsDropdownOpen(null)}
                >
                  <Mail size={14} className="mr-2" />
                  Send Message
                </button>
                <button
                  className="flex w-full items-center px-4 py-2 text-sm hover:bg-primary/10"
                  onClick={() => setIsDropdownOpen(null)}
                >
                  <Lock size={14} className="mr-2" />
                  Reset Password
                </button>
                <button
                  className="flex w-full items-center px-4 py-2 text-sm text-red-500 hover:bg-red-500/10"
                  onClick={() => setIsDropdownOpen(null)}
                >
                  <Trash2 size={14} className="mr-2" />
                  Delete User
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="container mx-auto pb-12 pt-6">
      <BackgroundGradient />

      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold">
            <span className="gradient-text">User Management</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            View, search, and manage all users on the Heallink platform
          </p>
        </motion.div>

        {/* Actions and Filters */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl p-6 bg-background"
          style={{
            boxShadow: `0 10px 25px ${shadowColor}`,
          }}
        >
          <div className="flex flex-col md:flex-row gap-4 justify-between mb-4">
            {/* Search */}
            <div className="relative flex-grow max-w-md">
              {loading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    className="pl-10 pr-4 py-2 w-full rounded-lg border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Search users by name or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </>
              )}
            </div>

            {/* Button */}
            {loading ? (
              <Skeleton className="h-10 w-32" />
            ) : (
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                <UserPlus size={16} />
                <span>Add User</span>
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            {loading ? (
              <>
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </>
            ) : (
              <>
                {/* Role Filter */}
                <div className="flex items-center">
                  <Filter size={16} className="mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground mr-2">
                    Role:
                  </span>
                  <select
                    className="px-3 py-2 rounded-lg border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="All">All Roles</option>
                    <option value="Patient">Patient</option>
                    <option value="Provider">Provider</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground mr-2">
                    Status:
                  </span>
                  <select
                    className="px-3 py-2 rounded-lg border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                {/* Export Button */}
                <div className="ml-auto flex gap-2">
                  <button className="px-3 py-2 rounded-lg border border-input bg-background hover:bg-primary/10 text-sm flex items-center gap-1.5">
                    <Download size={14} />
                    <span>Export</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl overflow-hidden bg-background"
          style={{
            boxShadow: `0 10px 25px ${shadowColor}`,
          }}
        >
          {loading ? (
            <div className="p-8 space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/20">
                      <th className="px-6 py-4 text-left">
                        <div
                          className="flex items-center gap-1 cursor-pointer"
                          onClick={() => handleSort("name")}
                        >
                          <span>User</span>
                          {sortBy === "name" && (
                            <span className="text-primary">
                              {sortOrder === "asc" ? (
                                <ChevronUp size={14} />
                              ) : (
                                <ChevronDown size={14} />
                              )}
                            </span>
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <div
                          className="flex items-center gap-1 cursor-pointer"
                          onClick={() => handleSort("role")}
                        >
                          <span>Role</span>
                          {sortBy === "role" && (
                            <span className="text-primary">
                              {sortOrder === "asc" ? (
                                <ChevronUp size={14} />
                              ) : (
                                <ChevronDown size={14} />
                              )}
                            </span>
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <div
                          className="flex items-center gap-1 cursor-pointer"
                          onClick={() => handleSort("status")}
                        >
                          <span>Status</span>
                          {sortBy === "status" && (
                            <span className="text-primary">
                              {sortOrder === "asc" ? (
                                <ChevronUp size={14} />
                              ) : (
                                <ChevronDown size={14} />
                              )}
                            </span>
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <div
                          className="flex items-center gap-1 cursor-pointer"
                          onClick={() => handleSort("lastActive")}
                        >
                          <span>Last Active</span>
                          {sortBy === "lastActive" && (
                            <span className="text-primary">
                              {sortOrder === "asc" ? (
                                <ChevronUp size={14} />
                              ) : (
                                <ChevronDown size={14} />
                              )}
                            </span>
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-border hover:bg-muted/10"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                              {user.avatar ? (
                                <img
                                  src={user.avatar}
                                  alt={user.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Users size={16} className="text-primary" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <UserRoleBadge role={user.role} />
                        </td>
                        <td className="px-6 py-4">
                          <UserStatusBadge status={user.status} />
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            {user.lastActive ? (
                              <>
                                <div>{formatDate(user.lastActive)}</div>
                                <div className="text-xs text-muted-foreground">
                                  {formatTime(user.lastActive)}
                                </div>
                              </>
                            ) : (
                              <span className="text-muted-foreground">
                                Never
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <DropdownMenu userId={user.id} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 flex justify-between items-center border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * usersPerPage + 1} to{" "}
                    {Math.min(currentPage * usersPerPage, filteredUsers.length)}{" "}
                    of {filteredUsers.length} users
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-input disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10"
                    >
                      <ChevronUp className="rotate-90" size={16} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 rounded-lg ${
                            currentPage === page
                              ? "bg-primary text-primary-foreground"
                              : "border border-input hover:bg-primary/10"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-input disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10"
                    >
                      <ChevronDown className="rotate-90" size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
