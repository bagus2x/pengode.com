export interface User {
  id: number
  email: string
  username: string
  phone?: string | null
  name: string
  photo: string
  roles: { id: number; name: string }[]
}
