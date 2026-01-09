import { create } from 'zustand'
import type { Project, ScanStatus } from '@/types/project'

interface ProjectState {
  projects: Project[]
  currentProject: Project | null
  currentScanStatus: ScanStatus | null
  setProjects: (projects: Project[]) => void
  addProject: (project: Project) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  removeProject: (id: string) => void
  setCurrentProject: (project: Project | null) => void
  setCurrentScanStatus: (status: ScanStatus | null) => void
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  currentProject: null,
  currentScanStatus: null,
  setProjects: (projects) => set({ projects }),
  addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      currentProject: state.currentProject?.id === id
        ? { ...state.currentProject, ...updates }
        : state.currentProject,
    })),
  removeProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      currentProject: state.currentProject?.id === id ? null : state.currentProject,
    })),
  setCurrentProject: (project) => set({ currentProject: project }),
  setCurrentScanStatus: (status) => set({ currentScanStatus: status }),
}))
