"use client"

import type { Goal } from "@/types/goal"
import { ProgressVisualizer } from "./progress-visualizer"

interface ProgressDashboardProps {
  goals: Goal[]
}

export function ProgressDashboard({ goals }: ProgressDashboardProps) {
  if (!goals || goals.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No goals to track yet. Add some goals to see your progress!</p>
      </div>
    )
  }

  const completedGoals = goals.filter((goal) => goal.progress >= 100)
  const inProgressGoals = goals.filter((goal) => goal.progress > 0 && goal.progress < 100)
  const notStartedGoals = goals.filter((goal) => goal.progress === 0)
  const averageProgress = goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length

  const getOverdueGoals = () => {
    const today = new Date()
    return goals.filter((goal) => {
      if (!goal.deadline) return false
      const deadline = new Date(goal.deadline)
      return deadline < today && goal.progress < 100
    })
  }

  const overdueGoals = getOverdueGoals()

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{goals.length}</div>
          <div className="text-sm text-blue-600">Total Goals</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{completedGoals.length}</div>
          <div className="text-sm text-green-600">Completed</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-600">{inProgressGoals.length}</div>
          <div className="text-sm text-yellow-600">In Progress</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-gray-600">{Math.round(averageProgress)}%</div>
          <div className="text-sm text-gray-600">Avg Progress</div>
        </div>
      </div>

      {/* Overdue Goals Alert */}
      {overdueGoals.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium mb-2">⚠️ Overdue Goals ({overdueGoals.length})</h3>
          <div className="space-y-2">
            {overdueGoals.map((goal) => (
              <div key={goal.id} className="text-sm text-red-700">
                • {goal.text}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Goals by Status */}
      <div className="space-y-4">
        {inProgressGoals.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-900 mb-3">In Progress ({inProgressGoals.length})</h3>
            <div className="space-y-3">
              {inProgressGoals.map((goal) => (
                <div key={goal.id} className="bg-white p-4 rounded-lg border">
                  <div className="mb-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-gray-900">{goal.text}</h4>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{goal.category}</span>
                    </div>
                  </div>
                  <ProgressVisualizer goal={goal} showDetails={true} />
                </div>
              ))}
            </div>
          </div>
        )}

        {completedGoals.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Completed ({completedGoals.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {completedGoals.map((goal) => (
                <div key={goal.id} className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-sm font-medium text-green-800">{goal.text}</span>
                  </div>
                  <div className="text-xs text-green-600 mt-1">{goal.category}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {notStartedGoals.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Not Started ({notStartedGoals.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {notStartedGoals.map((goal) => (
                <div key={goal.id} className="bg-gray-50 p-3 rounded-lg border">
                  <div className="text-sm font-medium text-gray-700">{goal.text}</div>
                  <div className="text-xs text-gray-500 mt-1">{goal.category}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
