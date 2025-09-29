"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RefreshCw, Plus, Edit, Trash2, Play, Settings } from "lucide-react"

interface PromptChain {
  id: number
  name: string
  description?: string
  prompts: any[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export function PromptChainManager() {
  const { user } = useAuth()
  const [promptChains, setPromptChains] = useState<PromptChain[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingChain, setEditingChain] = useState<PromptChain | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    prompts: "[]",
  })
  const [error, setError] = useState("")

  const fetchPromptChains = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/prompt-chain")
      if (response.ok) {
        const data = await response.json()
        setPromptChains(Array.isArray(data.promptChains) ? data.promptChains : [])
      }
    } catch (error) {
      console.error("Failed to fetch prompt chains:", error)
      // Mock data for demo
      setPromptChains([
        {
          id: 1,
          name: "fraud_detection_basic",
          description: "Basic fraud detection prompt chain",
          prompts: [
            { role: "system", content: "You are a fraud detection AI assistant." },
            { role: "user", content: "Analyze this transaction for potential fraud." },
          ],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 2,
          name: "advanced_analysis",
          description: "Advanced fraud analysis with multiple steps",
          prompts: [
            { role: "system", content: "You are an advanced fraud detection system." },
            { role: "user", content: "Perform comprehensive fraud analysis." },
            { role: "assistant", content: "I'll analyze multiple factors including..." },
          ],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const prompts = JSON.parse(formData.prompts)
      
      const response = await fetch("/api/prompt-chain", {
        method: editingChain ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(editingChain && { id: editingChain.id }),
          name: formData.name,
          description: formData.description,
          prompts,
        }),
      })

      if (response.ok) {
        setIsDialogOpen(false)
        setEditingChain(null)
        setFormData({ name: "", description: "", prompts: "[]" })
        fetchPromptChains()
      } else {
        const data = await response.json()
        setError(data.error || "Failed to save prompt chain")
      }
    } catch (err) {
      setError("Invalid JSON format in prompts")
    }
  }

  const handleEdit = (chain: PromptChain) => {
    setEditingChain(chain)
    setFormData({
      name: chain.name,
      description: chain.description || "",
      prompts: JSON.stringify(chain.prompts, null, 2),
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this prompt chain?")) return

    try {
      const response = await fetch("/api/prompt-chain", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          isActive: false,
        }),
      })

      if (response.ok) {
        fetchPromptChains()
      }
    } catch (error) {
      console.error("Failed to delete prompt chain:", error)
    }
  }

  useEffect(() => {
    fetchPromptChains()
  }, [])

  const isAdmin = user?.role === "ADMIN"

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>AI Prompt Chain Manager</CardTitle>
              <CardDescription>
                Manage and optimize AI prompt chains for better fraud detection
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={fetchPromptChains}
                disabled={isLoading}
                size="sm"
                variant="outline"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              {isAdmin && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      New Chain
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingChain ? "Edit Prompt Chain" : "Create New Prompt Chain"}
                      </DialogTitle>
                      <DialogDescription>
                        Configure the AI prompt chain for enhanced fraud detection
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {error && (
                        <Alert variant="destructive">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="prompts">Prompts (JSON Array)</Label>
                        <Textarea
                          id="prompts"
                          value={formData.prompts}
                          onChange={(e) => setFormData({ ...formData, prompts: e.target.value })}
                          rows={10}
                          className="font-mono text-sm"
                          placeholder='[{"role": "system", "content": "You are a fraud detection AI..."}, {"role": "user", "content": "Analyze this transaction..."}]'
                          required
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsDialogOpen(false)
                            setEditingChain(null)
                            setFormData({ name: "", description: "", prompts: "[]" })
                            setError("")
                          }}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">
                          {editingChain ? "Update" : "Create"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse border rounded-lg p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : promptChains.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No prompt chains found.</p>
              {isAdmin && (
                <p className="text-sm text-muted-foreground mt-2">
                  Create your first prompt chain to get started.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {promptChains.map((chain) => (
                <div key={chain.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{chain.name}</h4>
                      <Badge variant={chain.isActive ? "default" : "secondary"}>
                        {chain.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline">
                        {chain.prompts.length} prompts
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost">
                        <Play className="h-4 w-4" />
                      </Button>
                      {isAdmin && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(chain)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(chain.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  {chain.description && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {chain.description}
                    </p>
                  )}
                  <ScrollArea className="h-32">
                    <pre className="text-xs bg-muted p-2 rounded">
                      {JSON.stringify(chain.prompts, null, 2)}
                    </pre>
                  </ScrollArea>
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>Created: {new Date(chain.createdAt).toLocaleDateString()}</span>
                    <span>Updated: {new Date(chain.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
