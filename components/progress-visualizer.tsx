"use client"

import type { Goal } from "@/types/goal"

interface ProgressVisualizerProps {
  goal: Goal
  showDetails?: boolean
  size?: "small" | "medium" | "large"
}

export function ProgressVisualizer({ goal, showDetails = false, size = "medium" }: ProgressVisualizerProps) {
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500"
    if (progress >= 60) return "bg-blue-500"
    if (progress >= 40) return "bg-yellow-500"
    if (progress >= 20) return "bg-orange-500"
    return "bg-red-500"
  }

  const getProgressTextColor = (progress: number) => {
    if (progress >= 80) return "text-green-600"
    if (progress >= 60) return "text-blue-600"
    if (progress >= 40) return "text-yellow-600"
    if (progress >= 20) return "text-orange-600"
    return "text-red-600"
  }

  const sizeClasses = {
    small: "h-2",
    medium: "h-3",
    large: "h-4",
  }

  const getDaysUntilDeadline = () => {
    if (!goal.deadline) return null

    const deadline = new Date(goal.deadline)
    const today = new Date()
    const diffTime = deadline.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
  }

  const daysUntilDeadline = getDaysUntilDeadline()

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${getProgressTextColor(goal.progress)}`}>{goal.progress}% Complete</span>
        {goal.target && goal.unit && (
          <span className="text-xs text-gray-500">
            {Math.round((goal.progress / 100) * goal.target)} / {goal.target} {goal.unit}
          </span>
        )}
      </div>

      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]}`}>
        <div
          className={`${sizeClasses[size]} rounded-full transition-all duration-500 ${getProgressColor(goal.progress)}`}
          style={{ width: `${goal.progress}%` }}
        ></div>
      </div>

      {showDetails && (
        <div className="text-xs text-gray-500 space-y-1">
          {goal.deadline && (
            <div className="flex justify-between">
              <span>Deadline:</span>
              <span className={daysUntilDeadline && daysUntilDeadline < 7 ? "text-red-500 font-medium" : ""}>
                {new Date(goal.deadline).toLocaleDateString()}
                {daysUntilDeadline !== null && (
                  <span className="ml-1">({daysUntilDeadline > 0 ? `${daysUntilDeadline} days left` : "Overdue"})</span>
                )}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Last updated:</span>
            <span>{new Date(goal.lastUpdated).toLocaleDateString()}</span>
          </div>
        </div>
      )}
    </div>
  )
}
