'use server'

import { v2 as cloudinary } from 'cloudinary'

import { env } from '@pengode/common/utils'

const config = cloudinary.config({
  cloud_name: env('CLOUDINARY_CLOUD_NAME'),
  api_key: env('CLOUDINARY_API_KEY'),
  api_secret: env('CLOUDINARY_API_SECRET'),
  secure: true,
})

export async function getSignature() {
  const timestamp = Math.round(new Date().getTime() / 1000)

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder: 'pengode' },
    config.api_secret!!,
  )

  return { timestamp, signature }
}

interface CloudinaryResponse {
  asset_id: string
  public_id: string
  version: number
  version_id: string
  signature: string
  width: number
  height: number
  format: string
  resource_type: string
  created_at: string
  tags: string[]
  bytes: number
  type: string
  etag: string
  placeholder: boolean
  url: string
  secure_url: string
  folder: string
  access_mode: string
  original_filename: string
  api_key: string
}

export async function upload(formData: FormData) {
  const { timestamp, signature } = await getSignature()
  formData.append('cloud_name', config.cloud_name!)
  formData.append('api_key', config.api_key!)
  formData.append('api_secret', config.api_secret!)
  formData.append('signature', signature)
  formData.append('timestamp', timestamp as any)
  formData.append('folder', 'pengode')

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloud_name}/image/upload`,
    {
      body: formData,
      method: 'POST',
    },
  )

  const data = await res.json()

  return data as CloudinaryResponse
}
