import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { projectService } from '@/services/projectService'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Network, Shield, Play, ExternalLink, History } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Project, Endpoint, ScanHistoryItem } from '@/types/project'
import { useToast } from '@/components/ui/use-toast'

export default function ProjectDetailsPage() {
    const { projectId } = useParams<{ projectId: string }>()
    const navigate = useNavigate()
    const toast = useToast()

    const [project, setProject] = useState<Project | null>(null)
    const [endpoints, setEndpoints] = useState<Endpoint[]>([])
    const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (projectId) {
            loadProjectData()
        }
    }, [projectId])

    const loadProjectData = async () => {
        if (!projectId) return

        try {
            setLoading(true)
            const [projectData, endpointsData, historyData] = await Promise.all([
                projectService.getProject(projectId),
                projectService.getProjectEndpoints(projectId),
                projectService.getProjectScanHistory(projectId),
            ])

            setProject(projectData)
            setEndpoints(endpointsData)
            setScanHistory(historyData)
        } catch (error: any) {
            toast({
                title: 'Error',
                description: 'Failed to load project details',
                variant: 'destructive'
            })
        } finally {
            setLoading(false)
        }
    }

    const handleStartScan = async () => {
        if (!projectId) return

        try {
            const { scan_id } = await projectService.startScan(projectId)
            navigate(`/dashboard/scan/${projectId}?scanId=${scan_id}`)
        } catch (error: any) {
            toast({ title: 'Error', description: 'Failed to start scan', variant: 'destructive' })
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-96 w-full" />
            </div>
        )
    }

    if (!project) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Project not found</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            {project.name}
                            <Badge variant="outline" className="text-lg py-1">{project.type}</Badge>
                        </h1>
                        <p className="text-muted-foreground">
                            Created {formatDate(project.created_at)} • {endpoints.length} Endpoints Discovered
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={handleStartScan}>
                        <Play className="mr-2 h-4 w-4" />
                        Start New Scan
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="recon">Recon Map</TabsTrigger>
                    <TabsTrigger value="history">Scan History</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    {/* Quick Stats */}
                    <div className="grid md:grid-cols-4 gap-4">
                        <Card className="bg-card border-dim-grey/30">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Total Scans</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{scanHistory.length}</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card border-critical/30">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Critical Issues</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-critical">
                                    {project.vulnerability_counts?.critical || 0}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card border-yellow-green/30">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Last Scan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2">
                                    <Badge variant={project.last_scan_status === 'completed' ? 'info' : 'secondary' as any}>
                                        {project.last_scan_status || 'Never'}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card border-dim-grey/30">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Endpoints</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{endpoints.length}</div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Recon / Endpoints Tab */}
                <TabsContent value="recon" className="space-y-6">
                    <Card className="bg-card border-yellow-green/30">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Network className="h-5 w-5 text-yellow-green" />
                                        Endpoint Map
                                    </CardTitle>
                                    <CardDescription>
                                        Automatically mapped API structure and parameters
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {endpoints.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    No endpoints discovered yet. Run a scan to populate the map.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {endpoints.map((endpoint) => (
                                        <div
                                            key={endpoint.id}
                                            className="flex items-center justify-between p-4 rounded-lg bg-background border border-border hover:border-primary/30 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <Badge variant={
                                                    endpoint.method === 'GET' ? 'info' :
                                                        endpoint.method === 'POST' ? 'medium' :
                                                            endpoint.method === 'DELETE' ? 'destructive' :
                                                                'secondary' as any
                                                } className="w-16 justify-center">
                                                    {endpoint.method}
                                                </Badge>
                                                <div>
                                                    <code className="text-sm font-mono block mb-1">{endpoint.path}</code>
                                                    {endpoint.description && (
                                                        <p className="text-xs text-muted-foreground">{endpoint.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {endpoint.auth_required && (
                                                    <Badge variant="outline" className="border-yellow-green/50 text-yellow-green bg-yellow-green/10">
                                                        <Shield className="h-3 w-3 mr-1" /> Auth Required
                                                    </Badge>
                                                )}
                                                <span className="text-xs text-muted-foreground">
                                                    {endpoint.parameters?.length || 0} params
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Scan History Tab */}
                <TabsContent value="history" className="space-y-6">
                    <Card className="bg-card border-dim-grey/30">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <History className="h-5 w-5" />
                                Scan History
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {scanHistory.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No scans performed yet.
                                    </div>
                                ) : (
                                    scanHistory.map((scan) => (
                                        <div key={scan.id} className="flex items-center justify-between p-4 rounded-lg bg-background border border-border hover:bg-muted/5 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-2 h-2 rounded-full ${scan.status === 'completed' ? 'bg-green-500' : 'bg-secondary'}`} />
                                                <div>
                                                    <p className="font-medium">Scan #{scan.id.slice(0, 8)}</p>
                                                    <p className="text-xs text-muted-foreground">{formatDate(scan.created_at)}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6">
                                                <div className="text-sm">
                                                    <span className="text-muted-foreground mr-2">Issues:</span>
                                                    <span className={scan.vulnerability_count > 0 ? 'text-critical font-bold' : 'text-green-500'}>
                                                        {scan.vulnerability_count}
                                                    </span>
                                                </div>

                                                {scan.status === 'completed' && (
                                                    <Button variant="outline" size="sm" onClick={() => navigate(`/dashboard/report/${scan.id}`)}>
                                                        View Report
                                                        <ExternalLink className="ml-2 h-3 w-3" />
                                                    </Button>
                                                )}
                                                {scan.status === 'running' && (
                                                    <Button size="sm" variant="default" onClick={() => navigate(`/dashboard/scan/${projectId}?scanId=${scan.id}`)}>
                                                        View Live Scan
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Settings</CardTitle>
                            <CardDescription>Configuration for security scans</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                                Configuration options such as excluded paths, authentication tokens, and rate limits will go here.
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    )
}
