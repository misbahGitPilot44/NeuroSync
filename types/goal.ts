export interface Goal {
  id: string
  text: string
  category: string
  priority: number
  progress: number // 0-100 percentage
  target?: number // Optional target value (e.g., days, hours, count)
  unit?: string // Optional unit (e.g., "days", "hours", "books")
  deadline?: string // Optional deadline date
  createdAt: string
  lastUpdated: string
}
