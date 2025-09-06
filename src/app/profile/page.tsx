"use client"

import { useState, useEffect } from "react"
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
import { User, Settings, Save, Plus, Trash2, Share2, Download, Upload } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

interface Pokemon {
  id: number
  name: string
  gen: number
  types: string[]
  stats: {
    hp: number
    atk: number
    def: number
    spa: number
    spd: number
    spe: number
  }
  abilities: string[]
  spriteUrl?: string
}

interface Team {
  id: string
  name: string
  description?: string
  pokemon: Pokemon[]
  createdAt: string
  updatedAt: string
}

// Mock data
const mockPokemon: Pokemon[] = [
  {
    id: 1,
    name: "Bulbasaur",
    gen: 1,
    types: ["grass", "poison"],
    stats: { hp: 45, atk: 49, def: 49, spa: 65, spd: 65, spe: 45 },
    abilities: ["Overgrow", "Chlorophyll"],
    spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
  },
  {
    id: 4,
    name: "Charmander",
    gen: 1,
    types: ["fire"],
    stats: { hp: 39, atk: 52, def: 43, spa: 60, spd: 50, spe: 65 },
    abilities: ["Blaze", "Solar Power"],
    spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png"
  },
  {
    id: 7,
    name: "Squirtle",
    gen: 1,
    types: ["water"],
    stats: { hp: 44, atk: 48, def: 65, spa: 50, spd: 64, spe: 43 },
    abilities: ["Torrent", "Rain Dish"],
    spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png"
  },
  {
    id: 25,
    name: "Pikachu",
    gen: 1,
    types: ["electric"],
    stats: { hp: 35, atk: 55, def: 40, spa: 50, spd: 50, spe: 90 },
    abilities: ["Static", "Lightning Rod"],
    spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
  }
]

const typeColors: Record<string, string> = {
  normal: "bg-gray-500",
  fire: "bg-red-500",
  water: "bg-blue-500",
  electric: "bg-yellow-500",
  grass: "bg-green-500",
  ice: "bg-cyan-500",
  fighting: "bg-orange-500",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  flying: "bg-sky-500",
  psychic: "bg-pink-500",
  bug: "bg-lime-500",
  rock: "bg-amber-600",
  ghost: "bg-indigo-500",
  dragon: "bg-violet-500",
  dark: "bg-gray-700",
  steel: "bg-gray-400",
  fairy: "bg-pink-300"
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [teams, setTeams] = useState<Team[]>([])
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false)
  const [newTeam, setNewTeam] = useState({ name: "", description: "" })
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)

  // Mock teams data
  useEffect(() => {
    const mockTeams: Team[] = [
      {
        id: "1",
        name: "Starter Team",
        description: "My first team with starter Pokémon",
        pokemon: [mockPokemon[0], mockPokemon[1], mockPokemon[2]],
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z"
      },
      {
        id: "2",
        name: "Electric Team",
        description: "Fast electric Pokémon team",
        pokemon: [mockPokemon[3]],
        createdAt: "2024-01-02T00:00:00Z",
        updatedAt: "2024-01-02T00:00:00Z"
      }
    ]
    setTeams(mockTeams)
  }, [])

  const handleCreateTeam = () => {
    if (!newTeam.name.trim()) {
      toast.error("Tên team không được để trống")
      return
    }

    const team: Team = {
      id: Date.now().toString(),
      name: newTeam.name,
      description: newTeam.description,
      pokemon: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setTeams(prev => [...prev, team])
    setNewTeam({ name: "", description: "" })
    setIsCreateTeamOpen(false)
    toast.success("Tạo team thành công!")
  }

  const handleDeleteTeam = (teamId: string) => {
    setTeams(prev => prev.filter(team => team.id !== teamId))
    toast.success("Xóa team thành công!")
  }

  const handleExportTeam = (team: Team) => {
    const dataStr = JSON.stringify(team, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `${team.name.replace(/\s+/g, '_')}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    
    toast.success("Export team thành công!")
  }

  const handleShareTeam = (team: Team) => {
    const url = `${window.location.origin}/team/${team.id}`
    navigator.clipboard.writeText(url)
    toast.success("Link team đã được copy!")
  }

  if (status === "loading") {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">Vui lòng đăng nhập để xem hồ sơ</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Hồ sơ cá nhân</h1>
        <p className="text-xl text-muted-foreground">
          Quản lý thông tin cá nhân và team Pokémon
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Thông tin cá nhân
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-8 w-8" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-lg">{session.user?.name || "Người dùng"}</h3>
                  <p className="text-muted-foreground">{session.user?.email}</p>
                  <Badge variant="outline" className="mt-1">
                    {session.user?.role === "admin" ? "Quản trị viên" : 
                     session.user?.role === "mod" ? "Điều hành viên" : "Người xem"}
                  </Badge>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Thống kê</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Tổng teams:</span>
                    <span className="font-medium">{teams.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tổng Pokémon:</span>
                    <span className="font-medium">
                      {teams.reduce((sum, team) => sum + team.pokemon.length, 0)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Teams */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Teams của tôi</CardTitle>
                <Dialog open={isCreateTeamOpen} onOpenChange={setIsCreateTeamOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Tạo team mới
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tạo team mới</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="team-name">Tên team</Label>
                        <Input
                          id="team-name"
                          value={newTeam.name}
                          onChange={(e) => setNewTeam(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Nhập tên team"
                        />
                      </div>
                      <div>
                        <Label htmlFor="team-description">Mô tả (tùy chọn)</Label>
                        <Textarea
                          id="team-description"
                          value={newTeam.description}
                          onChange={(e) => setNewTeam(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Mô tả team"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsCreateTeamOpen(false)}>
                          Hủy
                        </Button>
                        <Button onClick={handleCreateTeam}>
                          <Save className="mr-2 h-4 w-4" />
                          Tạo team
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {teams.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Chưa có team nào. Tạo team đầu tiên của bạn!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {teams.map(team => (
                    <Card key={team.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{team.name}</h3>
                            {team.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {team.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline">
                                {team.pokemon.length} Pokémon
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                Cập nhật: {new Date(team.updatedAt).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                            
                            {/* Pokémon in team */}
                            <div className="flex gap-2 mt-3">
                              {team.pokemon.map(pokemon => (
                                <div key={pokemon.id} className="flex items-center gap-1 bg-muted rounded-lg p-2">
                                  <Image
                                    src={pokemon.spriteUrl || ""}
                                    alt={pokemon.name}
                                    width={24}
                                    height={24}
                                  />
                                  <span className="text-xs font-medium">{pokemon.name}</span>
                                </div>
                              ))}
                              {team.pokemon.length === 0 && (
                                <span className="text-sm text-muted-foreground">
                                  Chưa có Pokémon nào
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-1 ml-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleShareTeam(team)}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleExportTeam(team)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTeam(team.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
