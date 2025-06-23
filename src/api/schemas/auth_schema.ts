import type { UserRead } from "./user_schema"

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  user: UserRead
}
