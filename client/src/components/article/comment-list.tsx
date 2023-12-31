'use client'

import { GoogleLogin } from '@pengode/components/google-oauth'

export const CommentList = () => {
  return (
    <GoogleLogin
      useOneTap
      onSuccess={(data) => {
        console.log(data)
      }}></GoogleLogin>
  )
}
