import { z } from "zod"

const bodySchema = z.object({
  username: z.string().min(1, { message: "Username is required" }).optional().or(z.literal("")),
  email: z.string().email({ message: "Invalid email" }).optional().or(z.literal("")),
})
const TOKEN_EXPIRY = 1000 * 60 * 10

export default defineEventHandler(async (event: any) => {
  const userSession = await requireUserSession(event)
  const runtimeConfig = useRuntimeConfig()
  const STRAPI_API = runtimeConfig.public.STRAPI_API
  const { username, email } = await readValidatedBody(event, bodySchema.parse)
  const user = await fetch(`${useRuntimeConfig().public.STRAPI_API}/users/${userSession?.user?.user?.id}`, {
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
  const isEmailChanged = email !== user.email

  if(isEmailChanged) {
    await fetch(`${STRAPI_API}/users?filters[email][$eq]=${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${runtimeConfig.STRAPI_API_KEY_BACKEND}`,
      },
    }).then(async (res)=>{
      if(res.ok) {
        const data = await res.json()
        if(data.length > 0) {
          throw createError({
            statusCode: 400,
            statusMessage: "Email already exists",
          })
        }
      }else {
        throw createError({
          statusCode: res.status,
          statusMessage: res.statusText,
        })
      }
    })
  }
  const emailChangeToken = isEmailChanged ? crypto.randomUUID() : undefined
  const emailChangeTokenExpiry = isEmailChanged ? Date.now() + TOKEN_EXPIRY : undefined
  return await fetch(`${STRAPI_API}/users/${userSession?.user?.user?.id}`, {
    method: "PUT",
    body: JSON.stringify({
      username: username,
      pendingEmail: isEmailChanged ? email : undefined,
      emailChangeToken: emailChangeToken,
      emailChangeTokenExpiry: emailChangeTokenExpiry,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${runtimeConfig.STRAPI_API_KEY_BACKEND}`,
    },
  }).then(async (res) => {
    if (res.ok) {
      await setUserSession(event, {
        ...userSession,
        user: {
          ...userSession?.user,
          user: {...userSession?.user?.user, username: username},
        },
      })

      return {
        success: true,
        pendingEmail: emailChangeToken ? email : undefined,
        emailChangeTokenExpiry: emailChangeTokenExpiry,
        message: "Profile updated successfully",
      }

    } else {      
      throw createError({
        statusCode: res.status,
        statusMessage:  res.status===400 ? "Invalid credentials" : res.statusText,
      })
    }
  })

})
