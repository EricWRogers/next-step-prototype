import PocketBase from "https://unpkg.com/pocketbase/dist/pocketbase.es.js";

export const pb = new PocketBase(window.location.origin);

export function requireAuthOrRedirect(to = "login.html") {
  if (!pb.authStore.isValid) {
    window.location.href = to;
    return false;
  }
  return true;
}

export function currentUser() {
  return pb.authStore.model;
}
