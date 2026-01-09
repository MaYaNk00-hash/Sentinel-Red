import { create } from 'zustand'
import type { ScanStatus } from '@/types/project'

interface ScanState {
  activeScanId: string | null
  scanStatus: ScanStatus | null
  scanProgress: number
  scanLogs: string[]
  currentStep: string | null
  error: string | null
  setActiveScan: (scanId: string) => void
  updateScanStatus: (status: ScanStatus, progress: number, step?: string) => void
  addScanLog: (log: string) => void
  setError: (error: string | null) => void
  clearScan: () => void
}

export const useScanStore = create<ScanState>((set) => ({
  activeScanId: null,
  scanStatus: null,
  scanProgress: 0,
  scanLogs: [],
  currentStep: null,
  error: null,
  setActiveScan: (scanId) => set({ activeScanId: scanId }),
  updateScanStatus: (status, progress, step) =>
    set({ scanStatus: status, scanProgress: progress, currentStep: step }),
  addScanLog: (log) =>
    set((state) => ({
      scanLogs: [...state.scanLogs, log].slice(-1000), // Keep last 1000 logs
    })),
  setError: (error) => set({ error }),
  clearScan: () =>
    set({
      activeScanId: null,
      scanStatus: null,
      scanProgress: 0,
      scanLogs: [],
      currentStep: null,
      error: null,
    }),
}))
