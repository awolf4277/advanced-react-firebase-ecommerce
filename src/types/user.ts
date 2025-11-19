export interface AppUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface UserProfile {
  uid: string;
  name: string;
  address: string;
  email: string;
  createdAt: number;
}
