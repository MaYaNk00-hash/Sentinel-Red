import type { SecurityReport } from '@/types/report'

const mockReport: SecurityReport = {
  scan_id: 'scan-1',
  project_name: 'E-Commerce API',
  generated_at: new Date().toISOString(),
  executive_summary: {
    total_vulnerabilities: 12,
    critical_count: 2,
    high_count: 4,
    medium_count: 5,
    low_count: 1,
    overall_risk: 'critical',
    summary: 'The security scan identified several critical vulnerabilities, particularly in the authentication and user data handling modules. Immediate attention is required for SQL Injection and IDOR issues.'
  },
  findings: [
    {
      id: 'vuln-1',
      scan_id: 'scan-1',
      title: 'SQL Injection in Login',
      description: 'The login endpoint is vulnerable to SQL injection via the username parameter.',
      severity: 'critical',
      type: 'Input Validation',

      discovered_at: new Date().toISOString(),
      impact: 'Data Breach',
      exploit_complexity: 'low',
      cvss_score: 9.8,
      affected_endpoints: ['/api/auth/login'],
      recommended_fixes: ['Use parameterized queries.'],
      attack_chain: []
    },
    {
      id: 'vuln-2',
      scan_id: 'scan-1',
      title: 'Broken Access Control',
      description: 'Users can access other users\' private data.',
      severity: 'high',
      type: 'IDOR',

      discovered_at: new Date().toISOString(),
      impact: 'Privacy Violation',
      exploit_complexity: 'medium',
      cvss_score: 7.5,
      affected_endpoints: ['/api/users/123'],
      recommended_fixes: ['Implement proper authorization checks.'],
      attack_chain: []
    }
  ],
  recommendations: [
    'Implement parameterized queries to prevent SQL Injection.',
    'Enforce strict access controls on all API endpoints.',
    'Enable Multi-Factor Authentication (MFA) for administrative accounts.',
    'Regularly rotate API keys and secrets.'
  ],
  metadata: {
    scan_duration: 360,
    endpoints_tested: 45,
    test_cases_executed: 1250
  }
}

export const reportService = {
  async getReport(scanId: string): Promise<SecurityReport> {
    await new Promise(resolve => setTimeout(resolve, 800))
    return { ...mockReport, scan_id: scanId }
  },

  async exportReportPDF(_scanId: string): Promise<Blob> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return new Blob(['Mock PDF Content'], { type: 'application/pdf' })
  },

  async exportReportJSON(scanId: string): Promise<object> {
    await new Promise(resolve => setTimeout(resolve, 500))
    return { ...mockReport, scan_id: scanId }
  },
}
