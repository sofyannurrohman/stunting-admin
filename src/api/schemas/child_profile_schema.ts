export interface ChildProfileCreate {
  nik: string
  name: string
  tanggal_lahir: string // use string when sending from frontend (date.toISOString())
  tempat_lahir: string
  user_id: number
}

export interface ChildProfileUpdate {
  name?: string
  nik?: string
  tanggal_lahir?: string // same: use string (ISO date)
  tempat_lahir?: string
  user_id?: number
}

export interface ChildProfileRead {
  id: number
  nik: string
  name: string
  tanggal_lahir: string // backend returns ISO string
  tempat_lahir: string
  user_id: number
}
