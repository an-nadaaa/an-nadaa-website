export default defineEventHandler(async (event: any) => {
  const userSession = await requireUserSession(event)
  const runtimeConfig = useRuntimeConfig()
  const STRAPI_API = runtimeConfig.public.STRAPI_API
  const user = await fetch(`${STRAPI_API}/users/${userSession?.user?.user?.id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${useRuntimeConfig().STRAPI_API_KEY_BACKEND}`,
    },
  }).then(res=>{
    if(!res.ok){
      throw createError({
        statusCode: res.status,
        statusMessage: res.statusText,
      })
    }
    return res.json()
  })

  return {
    success: true,
    pendingEmail: user.pendingEmail || null,
    emailChangeTokenExpiry: parseInt(user?.emailChangeTokenExpiry ?? '0') || null,
    message: "Profile fetched successfully",
  }
})
