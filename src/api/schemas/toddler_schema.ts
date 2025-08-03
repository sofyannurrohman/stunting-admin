export interface ToddlerCreate {
  age_months: number
  gender: string
  weight_kg: number
  height_cm: number
  profile_id: number
}

export interface ToddlerUpdate {
  id?: number
  profile_id?: number
  gender?: string
  age_months?: number
  height_cm?: number
  weight_kg?: number
  predicted?: string
}

export interface ToddlerRead {
  id: number
  profile_id: number
  age_months: number
  gender: string
  weight_kg: number
  height_cm: number
  predicted: string
  createdAt: string // ISO string from FastAPI datetime
  updatedAt: string
}
