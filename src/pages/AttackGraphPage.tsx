import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  Panel,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { attackGraphService } from '@/services/attackGraphService'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, ZoomIn, ZoomOut, RotateCw, ExternalLink } from 'lucide-react'
import type { AttackGraph, AttackNode, AttackEdge } from '@/types/attackGraph'
import { useToast } from '@/components/ui/use-toast'

const nodeTypes = {
  start: ({ data }: { data: any }) => (
    <div className="px-4 py-2 rounded-lg bg-primary/20 border-2 border-primary text-primary font-semibold">
      {data.label}
    </div>
  ),
  api_call: ({ data }: { data: any }) => (
    <div className="px-4 py-2 rounded-lg bg-blue-500/20 border-2 border-blue-500 text-blue-400">
      <div className="font-semibold">{data.method || 'API'}</div>
      <div className="text-xs text-muted-foreground mt-1">{data.endpoint}</div>
    </div>
  ),
  exploit: ({ data }: { data: any }) => (
    <div className="px-4 py-2 rounded-lg bg-high/20 border-2 border-high text-high font-semibold">
      {data.label}
    </div>
  ),
  vulnerability: ({ data }: { data: any }) => (
    <div className="px-4 py-2 rounded-lg bg-critical/20 border-2 border-critical text-critical font-semibold">
      ⚠️ {data.label}
    </div>
  ),
  end: ({ data }: { data: any }) => (
    <div className="px-4 py-2 rounded-lg bg-muted border-2 border-muted-foreground text-muted-foreground font-semibold">
      {data.label}
    </div>
  ),
}

export default function AttackGraphPage() {
  const { scanId } = useParams<{ scanId: string }>()
  const navigate = useNavigate()
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [graph, setGraph] = useState<AttackGraph | null>(null)
  const [selectedNode, setSelectedNode] = useState<AttackNode | null>(null)
  const [nodeDetails, setNodeDetails] = useState<any>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)

  useEffect(() => {
    if (scanId) {
      loadAttackGraph()
    }
  }, [scanId])

  useEffect(() => {
    if (graph) {
      const flowNodes: Node[] = graph.nodes.map((node) => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data,
        style: {
          background: 'transparent',
          border: 'none',
        },
      }))

      const flowEdges: Edge[] = graph.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        type: 'smoothstep',
        animated: edge.type === 'exploit' || edge.type === 'vulnerable',
        style: {
          stroke: edge.type === 'vulnerable' ? '#ef4444' : edge.type === 'exploit' ? '#f97316' : '#3b82f6',
          strokeWidth: 2,
        },
      }))

      setNodes(flowNodes)
      setEdges(flowEdges)
    }
  }, [graph])

  const loadAttackGraph = async () => {
    if (!scanId) return

    try {
      setLoading(true)
      const data = await attackGraphService.getAttackGraph(scanId)
      setGraph(data)
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to load attack graph', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleNodeClick = async (_: React.MouseEvent, node: Node) => {
    const attackNode = graph?.nodes.find((n) => n.id === node.id)
    if (attackNode) {
      setSelectedNode(attackNode)
      try {
        const details = await attackGraphService.getNodeDetails(node.id)
        setNodeDetails(details)
      } catch (error) {
        console.error('Failed to load node details:', error)
      }
    }
  }

  const handleResetView = useCallback(() => {
    setNodes((nds) =>
      nds.map((node) => {
        node.selected = false
        return node
      })
    )
    setEdges((eds) =>
      eds.map((edge) => {
        edge.selected = false
        return edge
      })
    )
  }, [setNodes, setEdges])

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    )
  }

  if (!graph) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No attack graph available</p>
      </div>
    )
  }

  const handleAnalyzeGraph = async () => {
    setIsAnalyzing(true)
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false)
      setAnalysisResult(
        "**Sentinel AI Analysis**\n\n" +
        "Critical Attack Path Identified:\n" +
        "1. **Initial Access**: The attacker successfully bypassed authentication using SQL Injection on the `/api/auth/login` endpoint.\n" +
        "2. **Escalation**: With the retrieved admin token, the attacker accessed the `/api/users/:id` endpoint.\n" +
        "3. **Impact**: An IDOR vulnerability allowed access to sensitive user data, leading to a full data breach.\n\n" +
        "**Recommendation**: Prioritize fixing the SQL Injection in the login module as it is the root cause of this chain."
      )
    }, 2000)
  }

  return (
    <div className="space-y-6 h-[calc(100vh-12rem)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Attack Graph</h1>
            <p className="text-muted-foreground">Visualization of attack paths and vulnerabilities</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={handleAnalyzeGraph}
            disabled={isAnalyzing}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isAnalyzing ? (
              <>
                <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <ZoomIn className="mr-2 h-4 w-4" /> {/* Using ZoomIn as a placeholder for 'Analyze' icon if Sparkles/Brain not avail */}
                Analyse Graph
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={handleResetView}>
            <RotateCw className="mr-2 h-4 w-4" />
            Reset View
          </Button>
          {scanId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/dashboard/report/${scanId}`)}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View Report
            </Button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 h-full">
        <Card className={`bg-card border-yellow-green/30 shadow-lg shadow-yellow-green/20 h-full ${analysisResult ? 'lg:col-span-3' : 'lg:col-span-4'} transition-all duration-300`}>
          <CardContent className="p-0 h-full">
            <div style={{ width: '100%', height: '100%' }}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={handleNodeClick}
                connectionMode={ConnectionMode.Loose}
                fitView
                nodeTypes={nodeTypes}
              >
                <Controls />
                <MiniMap />
                <Background variant="dots" gap={12} size={1} />
                <Panel position="top-left" className="bg-background/80 backdrop-blur p-2 rounded">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-primary"></div>
                      <span>Start</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-blue-500"></div>
                      <span>API Call</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-high"></div>
                      <span>Exploit</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-critical"></div>
                      <span>Vulnerability</span>
                    </div>
                  </div>
                </Panel>
              </ReactFlow>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Panel */}
        {analysisResult && (
          <Card className="lg:col-span-1 h-full bg-card border-purple-500/30 shadow-lg shadow-purple-500/10 animate-in slide-in-from-right duration-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <ZoomIn className="h-5 w-5" />
                AI Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose prose-invert prose-sm">
                <p className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
                  {analysisResult}
                </p>
              </div>
              <Button className="w-full" variant="outline" onClick={() => setAnalysisResult(null)}>Close Analysis</Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Node Details Dialog */}
      <Dialog open={!!selectedNode} onOpenChange={() => setSelectedNode(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedNode?.data.label}</DialogTitle>
            <DialogDescription>{selectedNode?.data.description}</DialogDescription>
          </DialogHeader>
          {nodeDetails && (
            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                {nodeDetails.requests && nodeDetails.requests.length > 0 && (
                  <TabsTrigger value="requests">Requests</TabsTrigger>
                )}
              </TabsList>
              <TabsContent value="details" className="space-y-4">
                {selectedNode?.data.endpoint && (
                  <div>
                    <h4 className="font-semibold mb-2">Endpoint</h4>
                    <code className="text-sm bg-muted p-2 rounded block">
                      {selectedNode.data.method} {selectedNode.data.endpoint}
                    </code>
                  </div>
                )}
                {selectedNode?.data.vulnerability_id && (
                  <div>
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/dashboard/vulnerabilities/${selectedNode.data.vulnerability_id}`)}
                    >
                      View Vulnerability Details
                    </Button>
                  </div>
                )}
              </TabsContent>
              {nodeDetails.requests && (
                <TabsContent value="requests" className="space-y-4">
                  {nodeDetails.requests.map((req: any, idx: number) => (
                    <Card key={idx}>
                      <CardHeader>
                        <CardTitle className="text-sm">
                          {req.method} {req.url}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Request</h4>
                          <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                            {JSON.stringify(req.body, null, 2)}
                          </pre>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Response</h4>
                          <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                            Status: {req.response.status}
                            {'\n'}
                            {JSON.stringify(req.response.body, null, 2)}
                          </pre>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              )}
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
