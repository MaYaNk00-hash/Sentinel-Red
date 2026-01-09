import { AttackGraph, AttackNode } from '@/types/attackGraph'

const mockGraph: AttackGraph = {
  scan_id: 'scan-1',
  nodes: [
    {
      id: 'start',
      type: 'start',
      label: 'Attacker',
      position: { x: 250, y: 0 },
      data: { description: 'External Threat Actor' }
    },
    {
      id: 'node-1',
      type: 'api_call',
      label: 'Login API',
      position: { x: 250, y: 100 },
      data: {
        method: 'POST',
        endpoint: '/api/auth/login',
        description: 'Authentication Endpoint'
      }
    },
    {
      id: 'node-2',
      type: 'vulnerability',
      label: 'SQL Injection',
      position: { x: 250, y: 200 },
      data: {
        vulnerability_id: 'vuln-1',
        description: 'SQL Injection in username parameter'
      }
    },
    {
      id: 'node-3',
      type: 'exploit',
      label: 'Auth Bypass',
      position: { x: 250, y: 300 },
      data: {
        description: 'Bypassed authentication using SQLi'
      }
    },
    {
      id: 'node-4',
      type: 'api_call',
      label: 'User Profile',
      position: { x: 250, y: 400 },
      data: {
        method: 'GET',
        endpoint: '/api/users/:id',
        description: 'Access User Data'
      }
    },
    {
      id: 'node-5',
      type: 'vulnerability',
      label: 'IDOR',
      position: { x: 250, y: 500 },
      data: {
        vulnerability_id: 'vuln-2',
        description: 'Insecure Direct Object Reference'
      }
    },
    {
      id: 'end',
      type: 'end',
      label: 'Data Breach',
      position: { x: 250, y: 600 },
      data: { description: 'Access to sensitive user data' }
    }
  ],
  edges: [
    { id: 'e1', source: 'start', target: 'node-1', label: 'Initiates', type: 'default' },
    { id: 'e2', source: 'node-1', target: 'node-2', label: 'Exploits', type: 'vulnerable' },
    { id: 'e3', source: 'node-2', target: 'node-3', label: 'Result', type: 'exploit' },
    { id: 'e4', source: 'node-3', target: 'node-4', label: 'Accesses', type: 'default' },
    { id: 'e5', source: 'node-4', target: 'node-5', label: 'Exploits', type: 'vulnerable' },
    { id: 'e6', source: 'node-5', target: 'end', label: 'Leads to', type: 'vulnerable' }
  ]
}

export const attackGraphService = {
  async getAttackGraph(scanId: string): Promise<AttackGraph> {
    await new Promise(resolve => setTimeout(resolve, 800))
    return { ...mockGraph, scan_id: scanId }
  },

  async getNodeDetails(nodeId: string): Promise<{
    node: AttackNode
    requests: Array<{
      method: string
      url: string
      headers: Record<string, string>
      body: unknown
      response: {
        status: number
        headers: Record<string, string>
        body: unknown
      }
    }>
  }> {
    await new Promise(resolve => setTimeout(resolve, 500))
    const node = mockGraph.nodes.find(n => n.id === nodeId)
    if (!node) throw new Error('Node not found')

    return {
      node,
      requests: [
        {
          method: 'POST',
          url: '/api/auth/login',
          headers: { 'Content-Type': 'application/json' },
          body: { username: "' OR 1=1 --", password: "any" },
          response: {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
            body: { token: "ey..." }
          }
        }
      ]
    }
  },
}
