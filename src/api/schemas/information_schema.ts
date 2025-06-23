export interface InformationCreate {
  title: string
  content: string
  category?: string
  image?: File
  source: string
}

export interface InformationUpdate {
  title: string
  content: string
  category?: string
  source: string
  image?: File
}

export interface InformationRead {
  id: number
  title: string
  content: string
  category?: string
  image_url?: string
  source: string
  createdAt: string
  updatedAt: string
}
