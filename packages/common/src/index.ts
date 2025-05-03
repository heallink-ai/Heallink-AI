/**
 * Example utility functions for the common package
 */

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}