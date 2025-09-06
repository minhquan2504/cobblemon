"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Shield } from "lucide-react"
import { toast } from "sonner"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        setError("Email hoặc mật khẩu không đúng")
        toast.error("Đăng nhập thất bại")
      } else {
        toast.success("Đăng nhập thành công!")
        router.push("/")
        router.refresh()
      }
    } catch (error) {
      setError("Có lỗi xảy ra, vui lòng thử lại")
      toast.error("Có lỗi xảy ra")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async (role: "admin" | "mod" | "user") => {
    setIsLoading(true)
    setError("")

    const credentials = {
      admin: { email: "admin@example.com", password: "admin123" },
      mod: { email: "mod@example.com", password: "mod123" },
      user: { email: "user@example.com", password: "user123" }
    }

    try {
      const result = await signIn("credentials", {
        email: credentials[role].email,
        password: credentials[role].password,
        redirect: false
      })

      if (result?.error) {
        setError("Có lỗi xảy ra")
        toast.error("Đăng nhập thất bại")
      } else {
        toast.success(`Đăng nhập với tài khoản ${role} thành công!`)
        router.push("/")
        router.refresh()
      }
    } catch (error) {
      setError("Có lỗi xảy ra")
      toast.error("Có lỗi xảy ra")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Đăng nhập</CardTitle>
          <p className="text-muted-foreground">
            Đăng nhập vào Harry Cobblemon
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Đăng nhập
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Hoặc đăng nhập demo
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleDemoLogin("admin")}
                disabled={isLoading}
              >
                <Shield className="mr-2 h-4 w-4" />
                Admin Demo
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleDemoLogin("mod")}
                disabled={isLoading}
              >
                <Shield className="mr-2 h-4 w-4" />
                Mod Demo
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleDemoLogin("user")}
                disabled={isLoading}
              >
                <Shield className="mr-2 h-4 w-4" />
                User Demo
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Tài khoản demo:</p>
            <p><strong>Admin:</strong> admin@example.com / admin123</p>
            <p><strong>Mod:</strong> mod@example.com / mod123</p>
            <p><strong>User:</strong> user@example.com / user123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}