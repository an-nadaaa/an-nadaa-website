import { z } from "zod"

const bodySchema = z.object({
  email: z.string(),
  password: z.string().min(4),
})

export default defineEventHandler(async (event) => {
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

  console.log("response", response)

  await setUserSession(event, {
    user: { user: response.user, token: response.jwt },
  })

  return {
    success: true,
    message: "Login successful",
  }
  // if (
  //   email === process.env.SUPERADMIN_USERNAME &&
  //   password === process.env.SUPERADMIN_PASSWORD
  // ) {
  //   await setUserSession(event, {
  //     user: {
  //       organizationId: "00000000-0000-7000-0000-000000000000",
  //       role: "superadmin",
  //       expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 12), // 12 hours
  //     },
  //   })

  //   return {
  //     success: true,
  //     redirect: "/root",
  //   }
  // } else {
  //   const user = await db.query.users.findFirst({
  //     where: or(
  //       eq(users.email, email),
  //       eq(users.username, email)
  //     ),
  //   })

  //   if (!user) {
  //     throw createError({
  //       statusCode: 401,
  //       message: "Bad credentials",
  //     })
  //   }

  //   if (!user.passwordHash) {
  //     throw createError({
  //       statusCode: 401,
  //       statusMessage: "Activate your account",
  //     })
  //   }

  //   // const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
  //   const isPasswordValid = await verifyPasswordHash(
  //     password,
  //     user.passwordHash
  //   )
  //   if (!isPasswordValid) {
  //     throw createError({
  //       statusCode: 401,
  //       message: "Bad credentials",
  //     })
  //   }

  //   await setUserSession(event, {
  //     user: {
  //       organizationId: user.organizationId,
  //       role: user.role,
  //       expiresAt: Date.now() + 1000 * 60 * 60 * 12, // 12 hours
  //     },
  //   })

  //   return {
  //     success: true,
  //     redirect: null,
  //   }
  // }
})
