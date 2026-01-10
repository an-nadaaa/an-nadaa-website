import type { User } from "#auth-utils"
import { jwtDecode } from "jwt-decode"
// App middleware is not auto applied to all routes, must be manually applied
// in the definePageMeta
// e.g. definePageMeta({ middleware: ["auth"] })

export default defineNuxtRouteMiddleware(async (to, _from) => {
  const {
    loggedIn,
    user,
    clear: logout,
    fetch: refreshSession,
  } = useUserSession()

  await refreshSession()

  const loginRoutes = [
    "/login",
    "/sign-up",
    "/forgot-password",
    "/reset-password",
    "/email-confirmation",
  ]
  // If the user is on a login route, check if they're logged in
  if (loginRoutes.includes(to.path)) {
    if (loggedIn.value) {
      return navigateTo("/dashboard")
    }
    return
  }

  if (loggedIn.value) {
    const { token } = user.value as User
    try {
      const decoded = jwtDecode<{ exp: number }>(token)
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        await logout()
        await refreshSession()
      }
    } catch (err) {
      await logout()
      await refreshSession()
    }
  }

  if (!loggedIn.value && to.path.startsWith("/dashboard")) {
    return navigateTo("/login")
  }
})
