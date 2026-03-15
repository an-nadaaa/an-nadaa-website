import { z } from "zod"

const bodySchema = z.object({
  email: z.string(),
  password: z.string().min(4),
})

export default defineEventHandler(async (event: any) => {
  const { email, password } = await readValidatedBody(event, bodySchema.parse)

  const runtimeConfig = useRuntimeConfig()
  const STRAPI_API = runtimeConfig.public.STRAPI_API
  const res = await fetch(STRAPI_API + "/auth/local", {
    method: "POST",
    body: JSON.stringify({
      identifier: email,
      password: password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const message = (body?.error?.message ?? "") as string
    const isEmailNotConfirmed =
      res.status === 400 &&
      (message.toLowerCase().includes("not confirmed") ||
        message === "Your account email is not confirmed")
    if (isEmailNotConfirmed) {
      throw createError({
        statusCode: 403,
        statusMessage: "Email not confirmed",
        data: { code: "EMAIL_NOT_CONFIRMED" },
      })
    }
    if (res.status === 400) {
      throw createError({
        statusCode: 401,
        statusMessage: "Wrong email or password",
      })
    }
    throw createError({
      statusCode: res.status,
      statusMessage: res.statusText,
    })
  }

  const response = await res.json()

  await setUserSession(event, {
    user: { user: response.user, token: response.jwt },
  })

  return {
    success: true,
    message: "Login successful",
  }
})
