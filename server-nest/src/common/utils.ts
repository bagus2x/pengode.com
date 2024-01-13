export const env = (key: string, required: boolean = true): string => {
  const value = process.env[key]

  if (!value && required) throw new Error(`Env for ${key} must be specified`)

  return value
}
