export interface User {
  id: string
  email: string
  name?: string
}

export interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  tags: string[]
  userId: string
}
