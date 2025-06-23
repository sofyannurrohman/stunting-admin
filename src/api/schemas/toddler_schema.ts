export interface ToddlerCreate {
    name: string
    age_months: number
    gender: string
    weight_kg: number
    height_cm: number
    user_id: number
  }
  
  export interface ToddlerUpdate {
    gender?: string
    age_months?: number
    height_cm?: number
    weight_kg?: number
    prediction_result?: string
  }
  
  export interface ToddlerRead {
    id: number
    name: string
    age_months: number
    gender: string
    weight_kg: number
    height_cm: number
    user_id: number
    prediction: string
    createdAt: string // ISO string from FastAPI datetime
    updatedAt: string
  }
  