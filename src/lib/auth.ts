import { NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import NextAuth from "next-auth"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export type UserRole = "viewer" | "mod" | "admin"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Mock authentication - trong thực tế sẽ check database
        const mockUsers = [
          {
            id: "1",
            email: "admin@example.com",
            password: "admin123",
            name: "Admin User",
            role: "admin" as UserRole
          },
          {
            id: "2", 
            email: "mod@example.com",
            password: "mod123",
            name: "Mod User",
            role: "mod" as UserRole
          },
          {
            id: "3",
            email: "user@example.com", 
            password: "user123",
            name: "Regular User",
            role: "viewer" as UserRole
          }
        ]

        const user = mockUsers.find(
          u => u.email === credentials.email && u.password === credentials.password
        )

        if (user) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          }
        }

        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: UserRole }).role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { role?: UserRole; id?: string }).role = token.role as UserRole | undefined
        ;(session.user as { role?: UserRole; id?: string }).id = token.sub as string | undefined
      }
      return session
    }
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error"
  },
  session: {
    strategy: "jwt"
  }
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  image?: string
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return null
  }

  // Mock user data - trong thực tế sẽ fetch từ database
  return {
    id: (session.user as { id?: string }).id || "1",
    name: session.user.name || "User",
    email: session.user.email || "",
    role: (session.user as { role?: UserRole })?.role || "viewer",
    image: session.user.image ?? undefined
  }
}

export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    viewer: 1,
    mod: 2,
    admin: 3
  }

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

export function requireAuth(requiredRole: UserRole = "viewer") {
  return async function middleware(req: NextRequest) {
    const user = await getCurrentUser()
    
    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    if (!hasPermission(user.role, requiredRole)) {
      return new Response("Forbidden", { status: 403 })
    }

    return null
  }
}

export function canAccessAdmin(userRole: UserRole): boolean {
  return hasPermission(userRole, "admin")
}

export function canModerate(userRole: UserRole): boolean {
  return hasPermission(userRole, "mod")
}