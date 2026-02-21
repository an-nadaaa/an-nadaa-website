import { jwtDecode } from "jwt-decode"

export default defineEventHandler(async (event) => {
  if (event.path.startsWith("/api/dashboard")) {
    const userSession = await requireUserSession(event)
    const { user } = userSession
    const { token } = user

    try {
      const decoded = jwtDecode<{ exp: number }>(token)
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        await clearUserSession(event)
        throw createError({
          statusCode: 401,
          statusMessage: "Session expired",
        })
      }
    } catch (err) {
      await clearUserSession(event)
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid session",
      })
    }

    const userId = user?.user?.id
    if (userId) {
      const config = useRuntimeConfig()
      const STRAPI_API = config.public.STRAPI_API
      const apiKey = config.STRAPI_API_KEY_BACKEND
      const res = await fetch(`${STRAPI_API}/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      })
      if (res.ok) {
        const strapiUser = await res.json()
        const sessionUser = user.user
        const emailChanged = sessionUser?.email !== strapiUser.email
        const usernameChanged = sessionUser?.username !== strapiUser.username
        if (emailChanged || usernameChanged) {
          await setUserSession(event, {
            ...userSession,
            user: {
              ...userSession.user,
              user: { ...sessionUser, email: strapiUser.email, username: strapiUser.username },
            },
          })
        }
      }
    }

    return
  }

  return
})
