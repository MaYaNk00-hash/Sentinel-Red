export type ProjectType = 'api' | 'codebase'

export type ScanStatus = 'pending' | 'running' | 'paused' | 'completed' | 'failed'

export interface Project {
  id: string
  name: string
  type: ProjectType
  created_at: string
  updated_at: string
  last_scan_id?: string
  last_scan_status?: ScanStatus
  vulnerability_counts?: {
    critical: number
    high: number
    medium: number
    low: number
  }
}

export interface ProjectUploadData {
  name: string
  type: ProjectType
  file?: File
  repoUrl?: string
}

export interface ScanStatusResponse {
  scan_id: string
  status: ScanStatus
  progress: number
  current_step?: string
  started_at: string
  completed_at?: string
  error?: string
}
export interface Endpoint {
  id: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD'
  path: string
  description?: string
  auth_required: boolean
  parameters?: {
    name: string
    in: 'query' | 'header' | 'path' | 'body'
    type: string
    required: boolean
  }[]
}

export interface ScanHistoryItem {
  id: string
  status: ScanStatus
  created_at: string
  duration?: number
  vulnerability_count: number
  risk_score?: number
}
