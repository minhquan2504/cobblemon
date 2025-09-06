"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RoleGuard } from "@/components/auth/RoleGuard"
import { 
  Shield, 
  Users, 
  Settings, 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  Activity,
  Calendar
} from "lucide-react"
import { toast } from "sonner"

interface User {
  id: string
  name: string
  email: string
  role: "viewer" | "mod" | "admin"
  createdAt: string
  lastLogin?: string
}

interface TournamentRule {
  id: string
  name: string
  description: string
  format: string
  status: "active" | "inactive" | "draft"
  createdAt: string
  updatedAt: string
}

interface EVGuide {
  id: string
  title: string
  description: string
  pokemon: string
  evSpread: string
  status: "published" | "draft"
  createdAt: string
  updatedAt: string
}

interface AuditLog {
  id: string
  action: string
  user: string
  resource: string
  details: string
  timestamp: string
}

// Mock data
const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: "2024-01-15T10:30:00Z"
  },
  {
    id: "2",
    name: "Mod User",
    email: "mod@example.com",
    role: "mod",
    createdAt: "2024-01-02T00:00:00Z",
    lastLogin: "2024-01-14T15:20:00Z"
  },
  {
    id: "3",
    name: "Regular User",
    email: "user@example.com",
    role: "viewer",
    createdAt: "2024-01-03T00:00:00Z",
    lastLogin: "2024-01-13T09:15:00Z"
  }
]

const mockTournamentRules: TournamentRule[] = [
  {
    id: "1",
    name: "VGC 2024",
    description: "Video Game Championships 2024 rules",
    format: "Double Battle",
    status: "active",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "2",
    name: "Smogon OU",
    description: "OverUsed tier rules",
    format: "Single Battle",
    status: "active",
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z"
  }
]

const mockEVGuides: EVGuide[] = [
  {
    id: "1",
    title: "Pikachu EV Training",
    description: "How to train Pikachu for competitive play",
    pokemon: "Pikachu",
    evSpread: "252 Atk / 252 Spe / 4 HP",
    status: "published",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  }
]

const mockAuditLogs: AuditLog[] = [
  {
    id: "1",
    action: "CREATE",
    user: "Admin User",
    resource: "Tournament Rule",
    details: "Created VGC 2024 rules",
    timestamp: "2024-01-15T10:30:00Z"
  },
  {
    id: "2",
    action: "UPDATE",
    user: "Mod User",
    resource: "EV Guide",
    details: "Updated Pikachu EV guide",
    timestamp: "2024-01-14T15:20:00Z"
  }
]

export default function AdminPage() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [tournamentRules, setTournamentRules] = useState<TournamentRule[]>(mockTournamentRules)
  const [evGuides, setEVGuides] = useState<EVGuide[]>(mockEVGuides)
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs)
  
  const [isCreateRuleOpen, setIsCreateRuleOpen] = useState(false)
  const [isCreateGuideOpen, setIsCreateGuideOpen] = useState(false)
  const [newRule, setNewRule] = useState({ name: "", description: "", format: "" })
  const [newGuide, setNewGuide] = useState({ title: "", description: "", pokemon: "", evSpread: "" })

  const handleCreateRule = () => {
    if (!newRule.name.trim()) {
      toast.error("Tên rule không được để trống")
      return
    }

    const rule: TournamentRule = {
      id: Date.now().toString(),
      name: newRule.name,
      description: newRule.description,
      format: newRule.format,
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setTournamentRules(prev => [...prev, rule])
    setNewRule({ name: "", description: "", format: "" })
    setIsCreateRuleOpen(false)
    toast.success("Tạo rule thành công!")
  }

  const handleCreateGuide = () => {
    if (!newGuide.title.trim()) {
      toast.error("Tiêu đề guide không được để trống")
      return
    }

    const guide: EVGuide = {
      id: Date.now().toString(),
      title: newGuide.title,
      description: newGuide.description,
      pokemon: newGuide.pokemon,
      evSpread: newGuide.evSpread,
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setEVGuides(prev => [...prev, guide])
    setNewGuide({ title: "", description: "", pokemon: "", evSpread: "" })
    setIsCreateGuideOpen(false)
    toast.success("Tạo guide thành công!")
  }

  const handleUpdateUserRole = (userId: string, newRole: "viewer" | "mod" | "admin") => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ))
    toast.success("Cập nhật role thành công!")
  }

  const handleDeleteRule = (ruleId: string) => {
    setTournamentRules(prev => prev.filter(rule => rule.id !== ruleId))
    toast.success("Xóa rule thành công!")
  }

  const handleDeleteGuide = (guideId: string) => {
    setEVGuides(prev => prev.filter(guide => guide.id !== guideId))
    toast.success("Xóa guide thành công!")
  }

  return (
    <RoleGuard requiredRole="admin">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Admin Panel
          </h1>
          <p className="text-xl text-muted-foreground">
            Quản lý hệ thống và nội dung
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="users">Người dùng</TabsTrigger>
            <TabsTrigger value="rules">Tournament Rules</TabsTrigger>
            <TabsTrigger value="guides">EV Guides</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users.length}</div>
                  <p className="text-xs text-muted-foreground">
                    +2 từ tháng trước
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tournament Rules</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{tournamentRules.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {tournamentRules.filter(r => r.status === "active").length} đang hoạt động
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">EV Guides</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{evGuides.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {evGuides.filter(g => g.status === "published").length} đã xuất bản
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Hoạt động gần đây</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditLogs.slice(0, 5).map(log => (
                    <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{log.user} {log.action}d {log.resource}</p>
                          <p className="text-sm text-muted-foreground">{log.details}</p>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString('vi-VN')}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quản lý người dùng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="font-semibold">{user.name}</h3>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Tham gia: {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={user.role === "admin" ? "default" : user.role === "mod" ? "secondary" : "outline"}>
                          {user.role === "admin" ? "Quản trị viên" : 
                           user.role === "mod" ? "Điều hành viên" : "Người xem"}
                        </Badge>
                        <Select
                          value={user.role}
                          onValueChange={(value: "viewer" | "mod" | "admin") => handleUpdateUserRole(user.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="viewer">Người xem</SelectItem>
                            <SelectItem value="mod">Điều hành viên</SelectItem>
                            <SelectItem value="admin">Quản trị viên</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rules" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Tournament Rules</CardTitle>
                  <Dialog open={isCreateRuleOpen} onOpenChange={setIsCreateRuleOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Tạo rule mới
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Tạo Tournament Rule mới</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="rule-name">Tên rule</Label>
                          <Input
                            id="rule-name"
                            value={newRule.name}
                            onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="VGC 2024"
                          />
                        </div>
                        <div>
                          <Label htmlFor="rule-format">Format</Label>
                          <Select value={newRule.format} onValueChange={(value) => setNewRule(prev => ({ ...prev, format: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn format" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Single Battle">Single Battle</SelectItem>
                              <SelectItem value="Double Battle">Double Battle</SelectItem>
                              <SelectItem value="Triple Battle">Triple Battle</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="rule-description">Mô tả</Label>
                          <Textarea
                            id="rule-description"
                            value={newRule.description}
                            onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Mô tả chi tiết về rule..."
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsCreateRuleOpen(false)}>
                            Hủy
                          </Button>
                          <Button onClick={handleCreateRule}>
                            <Save className="mr-2 h-4 w-4" />
                            Tạo rule
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tournamentRules.map(rule => (
                    <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{rule.name}</h3>
                        <p className="text-sm text-muted-foreground">{rule.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{rule.format}</Badge>
                          <Badge variant={rule.status === "active" ? "default" : "secondary"}>
                            {rule.status === "active" ? "Hoạt động" : 
                             rule.status === "inactive" ? "Không hoạt động" : "Bản nháp"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteRule(rule.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guides" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>EV Training Guides</CardTitle>
                  <Dialog open={isCreateGuideOpen} onOpenChange={setIsCreateGuideOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Tạo guide mới
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Tạo EV Guide mới</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="guide-title">Tiêu đề</Label>
                          <Input
                            id="guide-title"
                            value={newGuide.title}
                            onChange={(e) => setNewGuide(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Pikachu EV Training"
                          />
                        </div>
                        <div>
                          <Label htmlFor="guide-pokemon">Pokémon</Label>
                          <Input
                            id="guide-pokemon"
                            value={newGuide.pokemon}
                            onChange={(e) => setNewGuide(prev => ({ ...prev, pokemon: e.target.value }))}
                            placeholder="Pikachu"
                          />
                        </div>
                        <div>
                          <Label htmlFor="guide-ev">EV Spread</Label>
                          <Input
                            id="guide-ev"
                            value={newGuide.evSpread}
                            onChange={(e) => setNewGuide(prev => ({ ...prev, evSpread: e.target.value }))}
                            placeholder="252 Atk / 252 Spe / 4 HP"
                          />
                        </div>
                        <div>
                          <Label htmlFor="guide-description">Mô tả</Label>
                          <Textarea
                            id="guide-description"
                            value={newGuide.description}
                            onChange={(e) => setNewGuide(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Hướng dẫn chi tiết..."
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsCreateGuideOpen(false)}>
                            Hủy
                          </Button>
                          <Button onClick={handleCreateGuide}>
                            <Save className="mr-2 h-4 w-4" />
                            Tạo guide
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {evGuides.map(guide => (
                    <div key={guide.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{guide.title}</h3>
                        <p className="text-sm text-muted-foreground">{guide.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{guide.pokemon}</Badge>
                          <Badge variant="outline">{guide.evSpread}</Badge>
                          <Badge variant={guide.status === "published" ? "default" : "secondary"}>
                            {guide.status === "published" ? "Đã xuất bản" : "Bản nháp"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteGuide(guide.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Audit Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditLogs.map(log => (
                    <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Activity className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            <span className="text-primary">{log.user}</span> {log.action}d{" "}
                            <span className="font-semibold">{log.resource}</span>
                          </p>
                          <p className="text-sm text-muted-foreground">{log.details}</p>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        {new Date(log.timestamp).toLocaleString('vi-VN')}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RoleGuard>
  )
}
