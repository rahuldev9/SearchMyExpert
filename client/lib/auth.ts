import Cookies from "js-cookie";
// Save user to localStorage
export function setCurrentUser(user: any) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("user", JSON.stringify(user));
  } catch (error) {
    console.error("Failed to store user in localStorage", error);
  }
}

// Get user object from localStorage
export function getCurrentUser() {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem("user");

  if (!user) return null;

  try {
    return JSON.parse(user);
  } catch (error) {
    console.warn("Invalid user JSON in localStorage:", user);
    return null;
  }
}

// Get only the user ID
export function getCurrentUserId() {
  const user = getCurrentUser();

  if (!user) return null;

  return user.id || user._id || null;
}

// Remove user (logout)
export function removeCurrentUser() {
  if (typeof window === "undefined") return;

  localStorage.removeItem("user");
  localStorage.removeItem("token");
}

export function getToken() {
  if (typeof window === "undefined") return null;

  return Cookies.get("token") || null;
}

// Get role from cookies
export function getRole() {
  if (typeof window === "undefined") return null;

  return Cookies.get("role") || null;
}
