/**
 * A dead-simple in-memory user store for the MVP.
 * In production, swap this for Postgres/Drizzle or any DB.
 */

export interface User {
  id: string;
  email: string;
  name: string;
  hashedPassword: string;
  createdAt: number;
}

// Module-level store (survives hot reload in dev, resets on server restart)
const users = new Map<string, User>();          // id → user
const emailIndex = new Map<string, string>();    // email → id

let idCounter = 1;

export function createUser(
  email: string,
  name: string,
  hashedPassword: string
): User {
  const id = `usr_${Date.now()}_${idCounter++}`;
  const user: User = { id, email, name, hashedPassword, createdAt: Date.now() };
  users.set(id, user);
  emailIndex.set(email.toLowerCase(), id);
  return user;
}

export function findUserByEmail(email: string): User | undefined {
  const id = emailIndex.get(email.toLowerCase());
  return id ? users.get(id) : undefined;
}

export function findUserById(id: string): User | undefined {
  return users.get(id);
}

export function userExists(email: string): boolean {
  return emailIndex.has(email.toLowerCase());
}
