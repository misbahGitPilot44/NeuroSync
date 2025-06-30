import type { Goal } from "./goal"

export interface Site {
  url: string
  baseDelay: number
}

export interface Settings {
  enabled: boolean
  sites: Site[]
  maxDelay: number
  minDelay: number
  timeFactorWeight: number
  usageFactorWeight: number
  emotionFactorWeight: number
  highUsageThreshold: number
  peakHours: number[]
  productiveHours: number[]
  showReflectionPrompts: boolean
  showInspirationalContent: boolean
  showGoalReminders: boolean
  goals: Goal[]
}
