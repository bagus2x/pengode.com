export interface Auth {
  accessToken: string
  refreshToken: string
  user: {
    id: number
    email: string
    username: string
    name: string
    photo?: string | null
    roles: { id: number; name: string }[]
  }
}
