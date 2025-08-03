export interface UserCreate {
  email: string
  name: string
  password: string
  role: string
  rt: string
  rw: string
}

export interface UserRead {
  id: number
  email: string
  name: string
  role: string
  rt: string
  rw: string
}

export interface UserUpdate {
  name?: string
  email?: string
  role?: string
  rt?: string
  rw?: string
}
