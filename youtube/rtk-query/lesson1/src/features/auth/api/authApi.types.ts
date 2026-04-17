import * as z from 'zod'
import type { loginResponseSchema, meResponseSchema } from '../model/auth.schemas.ts'

export type MeResponse = z.infer<typeof meResponseSchema>
export type LoginResponse = z.infer<typeof loginResponseSchema>

// Arguments
export type LoginArgs = {
  code: string
  redirectUri: string
  rememberMe: boolean
  accessTokenTTL?: string // e.g. "3m"
}
