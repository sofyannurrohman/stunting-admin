export interface UserCreate {
    email: string;
    name: string;
    role:string;
    password: string;
  }
  
  export interface UserRead {
    id: number;
    email: string;
    name: string;
    role: string;
  }
  
  export interface UserUpdate {
    name?: string;
  }
  