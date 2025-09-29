"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react"

interface ProgressItem {
  id: number
  taskType: string
  taskId: string
  status: string
  percentage: number
  metadata?: any
  createdAt: string
  updatedAt: string
}

export function ProgressTracker() {
  const { user } = useAuth()
  const [progressItems, setProgressItems] = useState<ProgressItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchProgress = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/progress")
      if (response.ok) {
        const data = await response.json()
        setProgressItems(data.progress || [])
      }
    } catch (error) {
      console.error("Failed to fetch progress:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateProgress = async (taskType: string, taskId: string, status: string, percentage: number) => {
    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskType,
          taskId,
          status,
          percentage,
        }),
      })

      if (response.ok) {
        fetchProgress()
      }
    } catch (error) {
      console.error("Failed to update progress:", error)
    }
  }

  useEffect(() => {
    fetchProgress()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "IN_PROGRESS":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "FAILED":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "PENDING":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-500"
      case "IN_PROGRESS":
        return "bg-blue-500"
      case "FAILED":
        return "bg-red-500"
      case "PENDING":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Progress Tracker</CardTitle>
              <CardDescription>
                Monitor the progress of your fraud detection tasks
              </CardDescription>
            </div>
            <Button
              onClick={fetchProgress}
              disabled={isLoading}
              size="sm"
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : progressItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No progress items found.</p>
              <Button
                onClick={() => updateProgress("fraud_detection", "demo_task", "IN_PROGRESS", 25)}
                className="mt-4"
                variant="outline"
              >
                Create Demo Task
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {progressItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      <h4 className="font-medium">
                        {item.taskType.replace(/_/g, " ").toUpperCase()}
                      </h4>
                      <Badge variant="outline">{item.taskId}</Badge>
                    </div>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{item.percentage}%</span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>Created: {new Date(item.createdAt).toLocaleDateString()}</span>
                    <span>Updated: {new Date(item.updatedAt).toLocaleDateString()}</span>
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
