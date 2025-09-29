"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RefreshCw, User, LogIn, LogOut, Settings, Activity } from "lucide-react"

interface ActivityItem {
  id: number
  action: string
  description: string
  metadata?: any
  createdAt: string
}

export function ActivityFeed() {
  const { user } = useAuth()
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchActivities = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/activity")
      if (response.ok) {
        const data = await response.json()
        setActivities(data.activities || [])
      }
    } catch (error) {
      console.error("Failed to fetch activities:", error)
      // Mock data for demo
      setActivities([
        {
          id: 1,
          action: "LOGIN",
          description: "User logged in successfully",
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          action: "PROGRESS_UPDATE",
          description: "Updated progress for fraud_detection:demo_task",
          metadata: { taskType: "fraud_detection", percentage: 75 },
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 3,
          action: "DASHBOARD_VIEW",
          description: "Accessed fraud detection dashboard",
          createdAt: new Date(Date.now() - 7200000).toISOString(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [])

  const getActionIcon = (action: string) => {
    switch (action) {
      case "LOGIN":
        return <LogIn className="h-4 w-4 text-green-500" />
      case "LOGOUT":
        return <LogOut className="h-4 w-4 text-red-500" />
      case "PROGRESS_UPDATE":
        return <Activity className="h-4 w-4 text-blue-500" />
      case "SETTINGS_UPDATE":
        return <Settings className="h-4 w-4 text-purple-500" />
      default:
        return <User className="h-4 w-4 text-gray-500" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "LOGIN":
        return "bg-green-100 text-green-800 border-green-200"
      case "LOGOUT":
        return "bg-red-100 text-red-800 border-red-200"
      case "PROGRESS_UPDATE":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "SETTINGS_UPDATE":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Activity Feed</CardTitle>
            <CardDescription>
              Recent activities and system events
            </CardDescription>
          </div>
          <Button
            onClick={fetchActivities}
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
        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No activities found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-b-0">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-background border flex items-center justify-center">
                    {getActionIcon(activity.action)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className={getActionColor(activity.action)}>
                        {activity.action.replace(/_/g, " ")}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(activity.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">
                      {activity.description}
                    </p>
                    {activity.metadata && (
                      <div className="mt-1">
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {JSON.stringify(activity.metadata, null, 2)}
                        </code>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
