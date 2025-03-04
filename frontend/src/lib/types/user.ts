export interface User {
  user_id: string;
  name: string;
  email: string;
  // avatar: string
  age: number | null;
  imperialSystem: boolean | false;
  gender: string | null;
  height: number | null;
  weight: number | null;
}
