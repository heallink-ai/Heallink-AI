"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminFormPresentation from "../components/AdminFormPresentation";
import { useCreateAdmin, useUpdateAdmin, useUpdateAdminRole } from "../hooks/use-admin-queries";
import { 
  AdminFormData, 
  AdminRole, 
  UserRole, 
  AdminUser,
  CreateAdminDto,
  UpdateAdminDto,
  UpdateAdminRoleDto
} from "../types/admin.types";

interface AdminFormContainerProps {
  admin?: AdminUser;
  isEdit?: boolean;
  onSuccess?: () => void;
}

export default function AdminFormContainer({ 
  admin, 
  isEdit = false,
  onSuccess 
}: AdminFormContainerProps) {
  const router = useRouter();
  
  // Mutation hooks
  const createAdminMutation = useCreateAdmin();
  const updateAdminMutation = useUpdateAdmin();
  const updateRoleMutation = useUpdateAdminRole();

  // Form state
  const [formState, setFormState] = useState<AdminFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    adminRole: AdminRole.SYSTEM_ADMIN,
    isActive: true,
    permissions: [],
    accessRights: {
      systemConfiguration: false,
      userManagement: false,
      adminManagement: false,
      providerManagement: false,
      billingManagement: false,
      securitySettings: false,
      auditLogs: false,
      apiAccess: false,
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"basic" | "permissions">("basic");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Populate form when admin data loads (for edit mode)
  useEffect(() => {
    if (admin && isEdit) {
      const nameParts = admin.name.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      // Convert permissions to access rights
      const accessRights = {
        systemConfiguration: admin.permissions?.includes("system_configuration") || false,
        userManagement: admin.permissions?.includes("user_management") || false,
        adminManagement: admin.permissions?.includes("admin_management") || false,
        providerManagement: admin.permissions?.includes("provider_management") || false,
        billingManagement: admin.permissions?.includes("billing_management") || false,
        securitySettings: admin.permissions?.includes("security_settings") || false,
        auditLogs: admin.permissions?.includes("audit_logs") || false,
        apiAccess: admin.permissions?.includes("api_access") || false,
      };

      setFormState({
        firstName,
        lastName,
        email: admin.email,
        phone: admin.phone || "",
        adminRole: admin.adminRole,
        isActive: admin.isActive,
        permissions: admin.permissions || [],
        accessRights,
      });
    }
  }, [admin, isEdit]);

  // Event handlers
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (name === "isActive") {
      setFormState((prev) => ({
        ...prev,
        isActive: checked,
      }));
    } else {
      setFormState((prev) => ({
        ...prev,
        accessRights: {
          ...prev.accessRights,
          [name]: checked,
        },
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formState.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formState.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formState.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formState.adminRole) {
      newErrors.adminRole = "Please select an admin role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const fullName = `${formState.firstName} ${formState.lastName}`.trim();

    // Build permissions array based on selected access rights
    const permissions: string[] = [];
    Object.entries(formState.accessRights).forEach(([key, value]) => {
      if (value) {
        // Convert camelCase to snake_case
        const permission = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        permissions.push(permission);
      }
    });

    if (isEdit && admin) {
      // For edit mode, handle basic info and permissions separately if needed
      if (activeTab === "basic") {
        const updateData: UpdateAdminDto = {
          name: fullName,
          email: formState.email,
          phone: formState.phone || undefined,
          isActive: formState.isActive,
        };

        updateAdminMutation.mutate(
          { id: admin.id, data: updateData },
          {
            onSuccess: () => {
              setSubmitSuccess(true);
              setTimeout(() => {
                onSuccess?.() || router.push("/dashboard/admins");
              }, 2000);
            },
          }
        );
      } else {
        // Update role and permissions
        const roleData: UpdateAdminRoleDto = {
          adminRole: formState.adminRole,
          permissions: permissions.length > 0 ? permissions : undefined,
        };

        updateRoleMutation.mutate(
          { id: admin.id, roleData },
          {
            onSuccess: () => {
              setSubmitSuccess(true);
              setTimeout(() => {
                onSuccess?.() || router.push("/dashboard/admins");
              }, 2000);
            },
          }
        );
      }
    } else {
      // Create new admin
      const createData: CreateAdminDto = {
        name: fullName,
        email: formState.email,
        phone: formState.phone || undefined,
        role: UserRole.ADMIN,
        adminRole: formState.adminRole,
        permissions: permissions.length > 0 ? permissions : undefined,
      };

      createAdminMutation.mutate(createData, {
        onSuccess: () => {
          setSubmitSuccess(true);
          setTimeout(() => {
            onSuccess?.() || router.push("/dashboard/admins");
          }, 2000);
        },
      });
    }
  };

  const handleTabChange = (tab: "basic" | "permissions") => {
    setActiveTab(tab);
  };

  const handleCancel = () => {
    if (submitSuccess) {
      setSubmitSuccess(false);
      setFormState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        adminRole: AdminRole.SYSTEM_ADMIN,
        isActive: true,
        permissions: [],
        accessRights: {
          systemConfiguration: false,
          userManagement: false,
          adminManagement: false,
          providerManagement: false,
          billingManagement: false,
          securitySettings: false,
          auditLogs: false,
          apiAccess: false,
        },
      });
      setErrors({});
    } else {
      router.push("/dashboard/admins");
    }
  };

  // Determine current mutation state
  const isSubmitting = isEdit 
    ? (activeTab === "basic" ? updateAdminMutation.isPending : updateRoleMutation.isPending)
    : createAdminMutation.isPending;

  const submitError = isEdit
    ? (activeTab === "basic" ? updateAdminMutation.error : updateRoleMutation.error)
    : createAdminMutation.error;

  return (
    <AdminFormPresentation
      formState={formState}
      errors={errors}
      isEdit={isEdit}
      activeTab={activeTab}
      isSubmitting={isSubmitting}
      submitSuccess={submitSuccess}
      submitError={submitError}
      onFormChange={handleFormChange}
      onCheckboxChange={handleCheckboxChange}
      onSubmit={handleSubmit}
      onTabChange={isEdit ? handleTabChange : undefined}
      onCancel={handleCancel}
    />
  );
}