import { type } from "os";

interface user {
  id: string;
  name: string;
}

export type User = user | null;
