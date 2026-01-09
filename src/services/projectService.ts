import type { Project, ProjectUploadData, ScanStatus, Endpoint, ScanHistoryItem } from '@/types/project'

// Mock state
let mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'E-Commerce API',
    type: 'api',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
    last_scan_id: 'scan-1',
    last_scan_status: 'completed',
    vulnerability_counts: { critical: 1, high: 3, medium: 5, low: 2 }
  },
  {
    id: 'proj-2',
    name: 'Legacy Backend',
    type: 'codebase',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    last_scan_id: 'scan-2',
    last_scan_status: 'completed',
    vulnerability_counts: { critical: 2, high: 4, medium: 1, low: 0 }
  }
]

let activeScan: { id: string; projectId: string; progress: number; status: ScanStatus; logs: string[] } | null = null

export const projectService = {
  async getProjects(): Promise<Project[]> {
    await new Promise(resolve => setTimeout(resolve, 500))
    return [...mockProjects]
  },

  async getProject(id: string): Promise<Project> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const project = mockProjects.find(p => p.id === id)
    if (!project) throw new Error('Project not found')
    return project
  },

  async uploadProject(data: ProjectUploadData): Promise<Project> {
    await new Promise(resolve => setTimeout(resolve, 1500))
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: data.name,
      type: data.type,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      vulnerability_counts: { critical: 0, high: 0, medium: 0, low: 0 }
    }
    mockProjects = [newProject, ...mockProjects]
    return newProject
  },

  async deleteProject(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500))
    mockProjects = mockProjects.filter(p => p.id !== id)
  },

  async startScan(projectId: string): Promise<{ scan_id: string }> {
    await new Promise(resolve => setTimeout(resolve, 500))
    const scanId = `scan-${Date.now()}`
    activeScan = {
      id: scanId,
      projectId,
      progress: 0,
      status: 'running',
      logs: ['Initializing scan engine...', 'Loading project files...']
    }

    // Update project status
    const project = mockProjects.find(p => p.id === projectId)
    if (project) {
      project.last_scan_id = scanId
      project.last_scan_status = 'running'
    }

    // Simulate background scan progress
    simulateScanProgress(scanId)

    return { scan_id: scanId }
  },

  async getScanStatus(scanId: string): Promise<import('@/types/project').ScanStatusResponse> {
    await new Promise(resolve => setTimeout(resolve, 200))

    if (activeScan && activeScan.id === scanId) {
      return {
        scan_id: scanId,
        status: activeScan.status,
        progress: activeScan.progress,
        current_step: getStepForProgress(activeScan.progress),
        started_at: new Date().toISOString()
      }
    }

    return {
      scan_id: scanId,
      status: 'completed',
      progress: 100,
      current_step: 'Analysis Complete',
      started_at: new Date(Date.now() - 3600000).toISOString(),
      completed_at: new Date().toISOString()
    }
  },

  async pauseScan(scanId: string): Promise<void> {
    if (activeScan && activeScan.id === scanId) {
      activeScan.status = 'paused'
    }
  },

  async stopScan(scanId: string): Promise<void> {
    if (activeScan && activeScan.id === scanId) {
      activeScan.status = 'failed'
      activeScan.logs.push('Scan stopped by user.')
    }
  },

  async getScanLogs(scanId: string): Promise<string[]> {
    if (activeScan && activeScan.id === scanId) {
      return [...activeScan.logs]
    }
    return [
      'Initializing scan engine...',
      'Loading project files...',
      'Target mapped: 15 endpoints discovered',
      'Starting static analysis...',
      'Vulnerability found: SQL Injection in /api/users',
      'Analysis complete.'
    ]
  },

  async getProjectEndpoints(_projectId: string): Promise<Endpoint[]> {
    await new Promise(resolve => setTimeout(resolve, 400))
    return [
      {
        id: 'ep-1',
        method: 'POST',
        path: '/api/auth/login',
        auth_required: false,
        parameters: [{ name: 'email', in: 'body', type: 'string', required: true }]
      },
      {
        id: 'ep-2',
        method: 'GET',
        path: '/api/users',
        auth_required: true,
        description: 'Get list of users',
        parameters: [{ name: 'page', in: 'query', type: 'integer', required: false }]
      },
      {
        id: 'ep-3',
        method: 'POST',
        path: '/api/orders',
        auth_required: true,
        parameters: [{ name: 'jwt', in: 'header', type: 'string', required: true }]
      },
      {
        id: 'ep-4',
        method: 'DELETE',
        path: '/api/products/:id',
        auth_required: true,
        parameters: [{ name: 'id', in: 'path', type: 'string', required: true }]
      }
    ]
  },

  async getProjectScanHistory(_projectId: string): Promise<ScanHistoryItem[]> {
    await new Promise(resolve => setTimeout(resolve, 400))
    return [
      {
        id: 'scan-1',
        status: 'completed',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        duration: 345,
        vulnerability_count: 5,
        risk_score: 85
      },
      {
        id: 'scan-old',
        status: 'failed',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        duration: 120,
        vulnerability_count: 0
      }
    ]
  },
}

// Helper to simulate scan progress
function simulateScanProgress(scanId: string) {
  if (!activeScan) return

  let progress = 0
  const interval = setInterval(() => {
    if (!activeScan || activeScan.id !== scanId || activeScan.status !== 'running') {
      clearInterval(interval)
      return
    }

    progress += Math.floor(Math.random() * 5) + 1
    if (progress > 100) progress = 100

    activeScan.progress = progress

    // Add logs based on progress
    if (progress === 10) activeScan.logs.push('Reconnaissance started...')
    if (progress === 30) activeScan.logs.push('Endpoints mapped successfully.')
    if (progress === 50) activeScan.logs.push('Static analysis in progress...')
    if (progress === 70) activeScan.logs.push('Dynamic testing authorized endpoints...')
    if (progress === 90) activeScan.logs.push('Generating final report...')

    if (progress === 100) {
      activeScan.status = 'completed'
      activeScan.logs.push('Scan completed successfully.')

      // Update project
      const project = mockProjects.find(p => p.id === activeScan?.projectId)
      if (project) {
        project.last_scan_status = 'completed'
        // Randomly add vulnerabilities
        project.vulnerability_counts = { critical: 2, high: 2, medium: 1, low: 4 }
      }

      clearInterval(interval)
    }
  }, 500)
}

function getStepForProgress(progress: number): string {
  if (progress < 20) return 'Reconnaissance'
  if (progress < 50) return 'Static Analysis'
  if (progress < 80) return 'Dynamic Testing'
  return 'Finalizing'
}
