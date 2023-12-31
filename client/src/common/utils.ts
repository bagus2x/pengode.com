export function delay(delayInMills: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, delayInMills)
  })
}

export function avatar(seed: string, url?: string | null) {
  if (url) return url

  return `https://api.dicebear.com/7.x/fun-emoji/png?seed=${seed}`
}

export function env(key: string) {
  const value = process.env[key]
  if (!value) throw new Error(`Please set ${key} in .env file`)
  return value
}
