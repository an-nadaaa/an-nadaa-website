import { z } from "zod"

const bodySchema = z.object({
  isDonationNotificationsEnabled: z.boolean(),
  isProjectUpdatesNotificationsEnabled: z.boolean(),
})

export default defineEventHandler(async (event: any) => {
  const userSession = await requireUserSession(event)
  const runtimeConfig = useRuntimeConfig()
  const STRAPI_API = runtimeConfig.public.STRAPI_API
  const userId = userSession?.user?.user?.id
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${runtimeConfig.STRAPI_API_KEY_BACKEND}`,
  }

  const { isDonationNotificationsEnabled, isProjectUpdatesNotificationsEnabled } =
    await readValidatedBody(event, bodySchema.parse)

  const currentUser = await fetch(`${STRAPI_API}/users/${userId}`, {
    method: "GET",
    headers,
  }).then((res) => {
    if (!res.ok) {
      throw createError({ statusCode: res.status, statusMessage: res.statusText })
    }
    return res.json()
  })

  const updatedSettings = {
    ...(currentUser.settings ?? {}),
    notifications: {
      isDonationNotificationsEnabled,
      isProjectUpdatesNotificationsEnabled,
    },
  }

  const res = await fetch(`${STRAPI_API}/users/${userId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ settings: updatedSettings }),
  })

  if (!res.ok) {
    throw createError({ statusCode: res.status, statusMessage: res.statusText })
  }

  return {
    success: true,
    notifications: updatedSettings.notifications,
    message: "Notification settings updated successfully",
  }
})
