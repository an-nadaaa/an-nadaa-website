
export default defineEventHandler(async (event) => {
  const userSession = await getUserSession(event)
  const query = getQuery(event)
  const token = query.emailChangeToken
  if (!token || typeof token !== "string" || !token.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid link",
      message: "Missing or invalid email change token.",
    })
  }

  const runtimeConfig = useRuntimeConfig()
  const STRAPI_API = runtimeConfig.public.STRAPI_API
  const apiKey = runtimeConfig.STRAPI_API_KEY_BACKEND
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  }

  const usersRes = await fetch(
    `${STRAPI_API}/users?filters[emailChangeToken][$eq]=${encodeURIComponent(token.trim())}`,
    { method: "GET", headers }
  )
  if (!usersRes.ok) {
    throw createError({
      statusCode: usersRes.status,
      statusMessage: usersRes.statusText,
      message: "Failed to verify link.",
    })
  }

  const usersData = await usersRes.json()
  const users = Array.isArray(usersData) ? usersData : usersData?.data ?? []
  if (users.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: "Invalid or expired link",
      message: "This link is invalid or has already been used.",
    })
  }

  const user = users[0]
  const expiry = user.emailChangeTokenExpiry != null
    ? Number(user.emailChangeTokenExpiry)
    : 0
  if (Number.isNaN(expiry) || expiry <= Date.now()) {
    throw createError({
      statusCode: 400,
      statusMessage: "Link has expired",
      message: "This link has expired. Please request a new email change from your account settings.",
    })
  }

  const pendingEmail = user.pendingEmail
  if (!pendingEmail || typeof pendingEmail !== "string") {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid link",
      message: "No pending email change found.",
    })
  }

  const existingRes = await fetch(
    `${STRAPI_API}/users?filters[email][$eq]=${encodeURIComponent(pendingEmail)}`,
    { method: "GET", headers }
  )
  if (existingRes.ok) {
    const existingData = await existingRes.json()
    const existing = Array.isArray(existingData) ? existingData : existingData?.data ?? []
    if (existing.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "Email already in use",
        message: "This email address is already registered.",
      })
    }
  }

  const userId = user.id ?? user.documentId
  if (userId == null) {
    throw createError({
      statusCode: 500,
      statusMessage: "Invalid user data",
      message: "Unable to update email.",
    })
  }

  const putRes = await fetch(`${STRAPI_API}/users/${userId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      email: pendingEmail,
      pendingEmail: null,
      emailChangeToken: null,
      emailChangeTokenExpiry: null,
    }),
  })

  if (!putRes.ok) {
    const statusMessage = putRes.status === 400 ? "Invalid credentials" : putRes.statusText
    throw createError({
      statusCode: putRes.status,
      statusMessage,
      message: "Failed to update email.",
    })
  }

  if(userSession) {
  await setUserSession(event, {
    ...userSession,
    user: {
      ...userSession?.user,
      user: {...userSession?.user?.user, email: pendingEmail},
      },
    })
  }

  return { success: true, message: "Email updated successfully" }
})
