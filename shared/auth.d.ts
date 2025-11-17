// auth.d.ts
declare module "#auth-utils" {
  // interface User {
  //   // Add your own fields
  // }

  interface User {
    user: {
      username: string
      email: string
      id: number
      documentId: string
      provider?: string
      password?: string
      resetPasswordToken?: string
      confirmationToken?: string
      confirmed?: boolean
      blocked?: boolean
      role?: any
      stripeCustomerId?: string
      createdAt: string
      updatedAt: string
    }
    token: string
  }

  // interface SecureSessionData {
  //   // Add your own fields
  // }
}

export {}
