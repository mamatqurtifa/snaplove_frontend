import { redirect } from "next/navigation";

export function checkAuthClientSide() {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    return !!token;
  }
  return false;
}

export function loginRedirect(currentPath) {
  const redirectUrl = encodeURIComponent(currentPath || '/');
  return `/login?redirect=${redirectUrl}`;
}