import { z } from "zod"

const bodySchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  passwordConfirmation: z.string().min(1, { message: "Please confirm your password" }),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Passwords do not match",
  path: ["passwordConfirmation"],
})

export default defineEventHandler(async (event) => {
  const userSession = await requireUserSession(event)
  const body = await readValidatedBody(event, bodySchema.parse)

  const runtimeConfig = useRuntimeConfig()
  const STRAPI_API = runtimeConfig.public.STRAPI_API
  const token = userSession?.user?.token
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "Not authenticated",
    })
  }

  const res = await fetch(`${STRAPI_API}/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      currentPassword: body.currentPassword,
      password: body.password,
      passwordConfirmation: body.passwordConfirmation,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const message = err?.error?.message ?? (res.status === 400 ? "Invalid credentials" : res.statusText)
    throw createError({
      statusCode: res.status,
      statusMessage: message,
      message,
    })
  }

  const data = await res.json()
  if (data.jwt) {
    await setUserSession(event, {
      ...userSession,
      user: {
        ...userSession.user,
        token: data.jwt,
        user: data.user ?? userSession.user.user,
      },
    })
  }

  return { success: true, message: "Password changed successfully" }
})
