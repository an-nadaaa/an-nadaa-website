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

  if (!to.path.startsWith("/dashboard")) {
    return
  }

  // redirect the user to the login screen if they're not authenticated
  if (!loggedIn.value) {
    await logout()
    return navigateTo("/login")
  } else {
    const { token } = user.value

    try {
      const decoded = jwtDecode<{ exp: number }>(token)
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        await logout()
        await refreshSession()
        return navigateTo("/login")
      }
    } catch (err) {
      await logout()
      await refreshSession()
      return navigateTo("/login")
    }
  }
})
