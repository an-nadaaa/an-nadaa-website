// auth.d.ts
declare module "#auth-utils" {
  // interface User {
  //   // Add your own fields
  // }

  interface User {
    // Add your own fields
    user: Record<string, any>
    token: string
  }

  // interface SecureSessionData {
  //   // Add your own fields
  // }
}

export {}
