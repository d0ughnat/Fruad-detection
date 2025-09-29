"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { ProgressTracker } from "@/components/progress-tracker"
import { ActivityFeed } from "@/components/activity-feed"
import { PromptChainManager } from "@/components/prompt-chain-manager"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, TrendingUp, Shield, AlertTriangle, Users } from "lucide-react"

import data from "../app/dashboard/data.json"

interface DashboardStats {
  totalTransactions: number
  fraudDetected: number
  accuracyRate: number
  activeUsers: number
}

export function EnhancedDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalTransactions: 0,
    fraudDetected: 0,
    accuracyRate: 0,
    activeUsers: 0,
  })
  const [isLoading, setIsLoading] = useState(false)

  const refreshDashboard = async () => {
    setIsLoading(true)
    try {
      // Simulate API call to refresh dashboard data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update stats with mock data
      setStats({
        totalTransactions: Math.floor(Math.random() * 10000) + 50000,
        fraudDetected: Math.floor(Math.random() * 500) + 100,
        accuracyRate: Math.random() * 10 + 90,
        activeUsers: Math.floor(Math.random() * 100) + 200,
      })
    } catch (error) {
      console.error("Failed to refresh dashboard:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshDashboard()
  }, [])

  if (!user) {
    return null
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* Welcome Section */}
              <div className="px-4 lg:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                      Welcome back, {user.name}
                    </h1>
                    <p className="text-muted-foreground">
                      Here's what's happening with your fraud detection system today.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {user.role}
                    </Badge>
                    <Button
                      onClick={refreshDashboard}
                      disabled={isLoading}
                      size="sm"
                      variant="outline"
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </div>
                </div>
              </div>

              {/* Enhanced Stats Cards */}
              <div className="px-4 lg:px-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalTransactions.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">
                        +12.5% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Fraud Detected</CardTitle>
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">{stats.fraudDetected}</div>
                      <p className="text-xs text-muted-foreground">
                        -2.1% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
                      <Shield className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {stats.accuracyRate.toFixed(1)}%
                      </div>
                      <p className="text-xs text-muted-foreground">
                        +0.3% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.activeUsers}</div>
                      <p className="text-xs text-muted-foreground">
                        +5.2% from last month
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Main Dashboard Content */}
              <div className="px-4 lg:px-6">
                <Tabs defaultValue="overview" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="progress">Progress</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                    <TabsTrigger value="prompts">AI Prompts</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-4">
                    <SectionCards />
                    <ChartAreaInteractive />
                    <DataTable data={data} />
                  </TabsContent>
                  
                  <TabsContent value="analytics" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Advanced Analytics</CardTitle>
                        <CardDescription>
                          Detailed fraud detection analytics and insights
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ChartAreaInteractive />
                      </CardContent>
                    </Card>
                    <DataTable data={data} />
                  </TabsContent>
                  
                  <TabsContent value="progress" className="space-y-4">
                    <ProgressTracker />
                  </TabsContent>
                  
                  <TabsContent value="activity" className="space-y-4">
                    <ActivityFeed />
                  </TabsContent>
                  
                  <TabsContent value="prompts" className="space-y-4">
                    <PromptChainManager />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
