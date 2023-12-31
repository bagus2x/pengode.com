'use server'

import { cache } from 'react'

let value = 0

export const increment = cache(async () => {
  value += 1
  console.log(value)
  return Math.random()
})
