"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/app/theme/ThemeProvider";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Clock,
  Shield,
  Activity,
  Edit,
  Trash2,
  Lock,
  Save,
  X,
  Check,
  Users,
} from "lucide-react";
import BackgroundGradient from "@/app/components/dashboard/BackgroundGradient";

// Define a proper type for the user
interface UserType {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  phone: string;
  role: string;
  status: string;
  address: string;
  dateOfBirth: string;
  lastActive: string;
  created: string;
  medicalProvider: string;
  emergencyContact: string;
  appointments: number;
  notes: string;
}

// Mock users for this example
const MOCK_USERS: UserType[] = [
  {
    id: "u1",
    name: "James Wilson",
    email: "james.w@example.com",
    avatar: null,
    phone: "+1 (555) 123-4567",
    role: "Patient",
    status: "Active",
    address: "123 Main St, San Francisco, CA 94105",
    dateOfBirth: "1985-06-22",
    lastActive: "2023-05-14T10:45:00",
    created: "2022-12-15T11:20:00",
    medicalProvider: "Dr. Sarah Williams",
    emergencyContact: "Emily Wilson - +1 (555) 987-6543",
    appointments: 12,
    notes: "Patient has a history of allergies to penicillin.",
  },
  {
    id: "u2",
    name: "Sophia Garcia",
    email: "s.garcia@example.com",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    phone: "+1 (555) 234-5678",
    role: "Patient",
    status: "Active",
    address: "456 Oak Ave, San Francisco, CA 94102",
    dateOfBirth: "1990-03-15",
    lastActive: "2023-05-10T14:30:00",
    created: "2022-11-05T09:00:00",
    medicalProvider: "Dr. Robert Chen",
    emergencyContact: "Miguel Garcia - +1 (555) 876-5432",
    appointments: 8,
    notes: "Patient is currently pregnant and due in August 2023.",
  },
];

// This would typically be fetched from an API
const getUserById = (id: string) => {
  return MOCK_USERS.find((user) => user.id === id) || null;
};

export default function UserDetailsPage() {
  const { id } = useParams();
  const userId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();
  const { theme } = useTheme();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserType | null>(null);

  // Fetch user data
  useEffect(() => {
    const timer = setTimeout(() => {
      if (userId) {
        const fetchedUser = getUserById(userId);
        setUser(fetchedUser);
        setEditedUser(fetchedUser ? { ...fetchedUser } : null);
      }
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [userId]);

  const shadowColor =
    theme === "dark" ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.1)";

  // Handle edit form changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setEditedUser((prev: UserType | null) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  // Save edited user data
  const handleSave = () => {
    setUser(editedUser);
    setIsEditing(false);
    // In a real app, you would send this to your API
    alert("User information saved successfully!");
  };

  // Cancel editing
  const handleCancel = () => {
    // Only spread the user if it exists
    setEditedUser(user ? { ...user } : null);
    setIsEditing(false);
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format time
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
        className={`px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor}`}
      >
        {status}
      </span>
    );
  };

  // Calculate age
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
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

  if (loading) {
    return (
      <div className="container mx-auto pb-12 pt-6">
        <BackgroundGradient />

        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-6 w-48" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Skeleton className="h-80 rounded-2xl" />
          </div>
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto pb-12 pt-6">
        <BackgroundGradient />

        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-primary/10"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-semibold">User Details</h1>
        </div>

        <div
          className="bg-background rounded-2xl p-8 text-center"
          style={{
            boxShadow: `0 10px 25px ${shadowColor}`,
          }}
        >
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-20 w-20 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-4">
              <X size={40} />
            </div>
            <h2 className="text-2xl font-semibold mb-2">User Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The user you are looking for does not exist or has been removed.
            </p>
            <button
              onClick={() => router.push("/dashboard/users")}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Back to Users
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto pb-12 pt-6">
      <BackgroundGradient />

      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header with back button */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-2 mb-6"
        >
          <button
            onClick={() => router.push("/dashboard/users")}
            className="p-2 rounded-full hover:bg-primary/10"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-semibold">User Details</h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Info Card */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-1 bg-background rounded-2xl overflow-hidden"
            style={{
              boxShadow: `0 10px 25px ${shadowColor}`,
            }}
          >
            {/* User header with gradient background */}
            <div className="bg-gradient-to-r from-primary/80 to-secondary/80 p-6 flex flex-col items-center">
              <div className="h-24 w-24 bg-white rounded-full mb-4 overflow-hidden">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-primary/20 flex items-center justify-center">
                    <User size={40} className="text-primary" />
                  </div>
                )}
              </div>
              <h2 className="text-xl font-semibold text-white">{user.name}</h2>
              <div className="mt-2">
                <UserStatusBadge status={user.status} />
              </div>
            </div>

            {/* User details */}
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="text-primary h-5 w-5 mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">Email</div>
                    <div>{user.email}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="text-primary h-5 w-5 mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">Phone</div>
                    <div>{user.phone}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shield className="text-primary h-5 w-5 mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">Role</div>
                    <div>{user.role}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="text-primary h-5 w-5 mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Date of Birth
                    </div>
                    <div>
                      {formatDate(user.dateOfBirth)} (
                      {calculateAge(user.dateOfBirth)} years)
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="text-primary h-5 w-5 mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">Address</div>
                    <div>{user.address}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="text-primary h-5 w-5 mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Last Active
                    </div>
                    <div>
                      {formatDate(user.lastActive)} at{" "}
                      {formatTime(user.lastActive)}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Activity className="text-primary h-5 w-5 mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Account Created
                    </div>
                    <div>{formatDate(user.created)}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  <Edit size={16} />
                  <span>Edit Profile</span>
                </button>

                <button className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-input bg-transparent rounded-lg hover:bg-primary/10">
                  <Lock size={16} />
                  <span>Reset Password</span>
                </button>

                <button className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600">
                  <Trash2 size={16} />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Edit Form / User Details */}
            <motion.div
              variants={itemVariants}
              className="bg-background rounded-2xl p-6"
              style={{
                boxShadow: `0 10px 25px ${shadowColor}`,
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">
                  {isEditing ? "Edit User Information" : "User Information"}
                </h3>
                {isEditing && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      className="p-2 rounded-lg border border-input hover:bg-muted/20"
                    >
                      <X size={18} />
                    </button>
                    <button
                      onClick={handleSave}
                      className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Save size={18} />
                    </button>
                  </div>
                )}
              </div>

              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={editedUser?.name || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={editedUser?.email || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={editedUser?.phone || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={editedUser?.dateOfBirth || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Role
                      </label>
                      <select
                        name="role"
                        value={editedUser?.role || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="Patient">Patient</option>
                        <option value="Provider">Provider</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Status
                      </label>
                      <select
                        name="status"
                        value={editedUser?.status || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={editedUser?.address || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Emergency Contact
                      </label>
                      <input
                        type="text"
                        name="emergencyContact"
                        value={editedUser?.emergencyContact || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={editedUser?.notes || ""}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
                    ></textarea>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Medical Provider
                      </div>
                      <div className="font-medium">{user.medicalProvider}</div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground">
                        Emergency Contact
                      </div>
                      <div className="font-medium">{user.emergencyContact}</div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground">
                        Total Appointments
                      </div>
                      <div className="font-medium">{user.appointments}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Notes
                    </div>
                    <div className="p-4 bg-muted/10 rounded-lg">
                      {user.notes}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Activity Section */}
            <motion.div
              variants={itemVariants}
              className="bg-background rounded-2xl p-6"
              style={{
                boxShadow: `0 10px 25px ${shadowColor}`,
              }}
            >
              <h3 className="text-xl font-semibold mb-6">Recent Activity</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-3 hover:bg-muted/10 rounded-lg transition-colors">
                  <div className="h-10 w-10 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <div className="font-medium">Appointment Scheduled</div>
                    <div className="text-sm text-muted-foreground">
                      Scheduled an appointment with Dr. Sarah Williams
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Yesterday at 2:30 PM
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 hover:bg-muted/10 rounded-lg transition-colors">
                  <div className="h-10 w-10 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center">
                    <Check size={20} />
                  </div>
                  <div>
                    <div className="font-medium">Profile Updated</div>
                    <div className="text-sm text-muted-foreground">
                      Updated personal information
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      3 days ago at 10:15 AM
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 hover:bg-muted/10 rounded-lg transition-colors">
                  <div className="h-10 w-10 bg-purple-500/20 text-purple-500 rounded-full flex items-center justify-center">
                    <Users size={20} />
                  </div>
                  <div>
                    <div className="font-medium">Account Created</div>
                    <div className="text-sm text-muted-foreground">
                      Joined Heallink healthcare platform
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatDate(user.created)}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
