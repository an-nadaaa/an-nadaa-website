import { z } from "zod"

const bodySchema = z.object({
  username: z.string().min(1, { message: "Username is required" }).optional().or(z.literal("")),
  email: z.string().email({ message: "Invalid email" }).optional().or(z.literal("")),
  isEmailChanged: z.boolean(),
})

export default defineEventHandler(async (event: any) => {
  const userSession = await getUserSession(event)
  const { username, email, isEmailChanged } = await readValidatedBody(event, bodySchema.parse)

  const runtimeConfig = useRuntimeConfig()
  const STRAPI_API = runtimeConfig.public.STRAPI_API
  const res = await fetch(`${STRAPI_API}/users/${userSession?.user?.user?.id}`, {
    method: "PUT",
    body: JSON.stringify({
      username: username,
      email: email,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${runtimeConfig.STRAPI_API_KEY_BACKEND}`,
    },
  }).then((res) => {
    if (res.ok) {
      return res.json()
    } else {
      throw createError({
        statusCode: res.status,
        statusMessage: res.statusText,
      })
    }
  })

  await setUserSession(event, {
    ...userSession,
    user: {
      ...userSession?.user,
      user: {...userSession?.user?.user, username: username, email: email},
    },
  })

  return {
    success: true,
    message: "Profile updated successfully",
  }
})
