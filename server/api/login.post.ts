import { z } from "zod"

const bodySchema = z.object({
  email: z.string(),
  password: z.string().min(4),
})

export default defineEventHandler(async (event: any) => {
  const { email, password } = await readValidatedBody(event, bodySchema.parse)

  const runtimeConfig = useRuntimeConfig()
  const STRAPI_API = runtimeConfig.public.STRAPI_API
  const response = await fetch(STRAPI_API + "/auth/local", {
    method: "POST",
    body: JSON.stringify({
      identifier: email,
      password: password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.ok) {
      return res.json()
    } else {
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
  })

  await setUserSession(event, {
    user: { user: response.user, token: response.jwt },
  })

  return {
    success: true,
    message: "Login successful",
  }
})
