"use client"

import { useSession } from "next-auth/react"
import { ReactNode } from "react"
import { UserRole } from "@/lib/auth"

interface RoleGuardProps {
  children: ReactNode
  requiredRole: UserRole
  fallback?: ReactNode
}

export function RoleGuard({ children, requiredRole, fallback }: RoleGuardProps) {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div className="animate-pulse bg-muted h-8 w-full rounded" />
  }

  if (!session?.user) {
    return fallback || <div>Vui lòng đăng nhập</div>
  }

  type SessionUserWithRole = { role?: UserRole }
  const userRole: UserRole = ((session.user as SessionUserWithRole)?.role) ?? "viewer"
  
  const roleHierarchy: Record<UserRole, number> = {
    viewer: 1,
    mod: 2,
    admin: 3
  }

  const hasPermission = roleHierarchy[userRole] >= roleHierarchy[requiredRole]

  if (!hasPermission) {
    return fallback || <div>Bạn không có quyền truy cập</div>
  }

  return <>{children}</>
}
