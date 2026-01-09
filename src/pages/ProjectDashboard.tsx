import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { projectService } from '@/services/projectService'
import { useProjectStore } from '@/stores/projectStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, FolderOpen, ExternalLink, Trash2, Play } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'

export default function ProjectDashboard() {
  const navigate = useNavigate()
  const { projects, setProjects, removeProject } = useProjectStore()
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      setLoading(true)
      const data = await projectService.getProjects()
      setProjects(data)
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to load projects', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleStartScan = async (projectId: string) => {
    try {
      const { scan_id } = await projectService.startScan(projectId)
      navigate(`/dashboard/scan/${projectId}?scanId=${scan_id}`)
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to start scan', variant: 'destructive' })
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      await projectService.deleteProject(projectId)
      removeProject(projectId)
      toast({ title: 'Success', description: 'Project deleted successfully' })
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to delete project', variant: 'destructive' })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-muted-foreground">Manage your security scan projects</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage your security scan projects</p>
        </div>
        <Button onClick={() => navigate('/dashboard/upload')}>
          <Plus className="mr-2 h-4 w-4" />
          Create Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card className="p-12 text-center bg-card border-yellow-green/30">
          <div className="h-16 w-16 rounded-2xl bg-yellow-green flex items-center justify-center mx-auto mb-4 border-2 border-yellow-green shadow-lg shadow-yellow-green/50">
            <FolderOpen className="h-8 w-8 text-background" />
          </div>
          <h3 className="text-lg font-bold mb-2 text-primary">No projects yet</h3>
          <p className="text-dim-grey-light mb-4">
            Upload an API spec or codebase to start scanning for vulnerabilities
          </p>
          <Button
            onClick={() => navigate('/dashboard/upload')}
            className="bg-yellow-green hover:bg-yellow-green/90 text-background shadow-lg shadow-yellow-green/50 font-bold"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Project
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover:border-yellow-green/50 transition-all bg-card border-dim-grey/30 hover:shadow-lg hover:shadow-yellow-green/20">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">
                      <span
                        onClick={() => navigate(`/dashboard/project/${project.id}`)}
                        className="cursor-pointer hover:text-primary transition-colors"
                      >
                        {project.name}
                      </span>
                    </CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{project.type}</Badge>
                      {project.last_scan_status && (
                        <Badge
                          variant={
                            project.last_scan_status === 'completed'
                              ? 'info'
                              : project.last_scan_status === 'running'
                                ? 'info'
                                : project.last_scan_status === 'failed'
                                  ? 'destructive'
                                  : 'secondary'
                          }
                        >
                          {project.last_scan_status}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <CardDescription>
                  Updated {formatDate(project.updated_at)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {project.vulnerability_counts && (
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    {project.vulnerability_counts.critical > 0 && (
                      <Badge variant="critical" className="gap-1">
                        {project.vulnerability_counts.critical} Critical
                      </Badge>
                    )}
                    {project.vulnerability_counts.high > 0 && (
                      <Badge variant="high" className="gap-1">
                        {project.vulnerability_counts.high} High
                      </Badge>
                    )}
                    {project.vulnerability_counts.medium > 0 && (
                      <Badge variant="medium" className="gap-1">
                        {project.vulnerability_counts.medium} Medium
                      </Badge>
                    )}
                    {project.vulnerability_counts.low > 0 && (
                      <Badge variant="low" className="gap-1">
                        {project.vulnerability_counts.low} Low
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleStartScan(project.id)}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Scan
                  </Button>
                  {project.last_scan_id && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/dashboard/attack-graph/${project.last_scan_id}`)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
