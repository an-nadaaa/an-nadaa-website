import { jwtDecode } from "jwt-decode"

export default defineEventHandler(async (event) => {
  if (event.path.startsWith("/api/dashboard")) {
    // This will throw an error if the user is not logged in
    const { user } = await requireUserSession(event)
    const { token } = user
    // To logout
    // await clearUserSession(event)

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
      // If token is invalid or cannot be decoded, logout and throw
      await clearUserSession(event)
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid session",
      })
    }
  }

  return
})
