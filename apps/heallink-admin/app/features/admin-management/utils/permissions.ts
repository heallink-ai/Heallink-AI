import { UserRole } from "../types/admin.types";

export interface UserContext {
  id: string;
  role: UserRole;
  name: string;
}

export const canCreateAdmin = (user: UserContext): boolean => {
  return user.role === UserRole.ADMIN;
};

export const canEditAdmin = (
  user: UserContext,
  targetAdmin: { _id: string; role: UserRole }
): boolean => {
  if (user.role !== UserRole.ADMIN) return false;
  if (user.id === targetAdmin._id) return false; // Can't edit self
  return true;
};

export const canDeleteAdmin = (
  user: UserContext,
  targetAdmin: { _id: string; role: UserRole },
  totalAdmins: number
): boolean => {
  if (!canEditAdmin(user, targetAdmin)) return false;

  // Don't allow deletion of the last admin
  if (targetAdmin.role === UserRole.ADMIN && totalAdmins <= 1) {
    return false;
  }

  return true;
};

export const canToggleAdminStatus = (
  user: UserContext,
  targetAdmin: { _id: string; role: UserRole }
): boolean => {
  return canEditAdmin(user, targetAdmin);
};

export const canViewAdminManagement = (user: UserContext): boolean => {
  return user.role === UserRole.ADMIN;
};

export const canBulkDeleteAdmins = (user: UserContext): boolean => {
  return user.role === UserRole.ADMIN;
};
