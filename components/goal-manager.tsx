"use client"

import { useState } from "react"
import type { Goal } from "@/types/goal"
import { ProgressVisualizer } from "./progress-visualizer"

interface GoalManagerProps {
  goals: Goal[]
  onGoalsChange: (goals: Goal[]) => void
}

export function GoalManager({ goals, onGoalsChange }: GoalManagerProps) {
  const [newGoalText, setNewGoalText] = useState("")
  const [newGoalCategory, setNewGoalCategory] = useState("personal")
  const [newGoalTarget, setNewGoalTarget] = useState("")
  const [newGoalUnit, setNewGoalUnit] = useState("")
  const [newGoalDeadline, setNewGoalDeadline] = useState("")

  const categories = ["personal", "career", "health", "relationships", "learning"]

  const handleAddGoal = () => {
    if (!newGoalText.trim()) return

    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      text: newGoalText,
      category: newGoalCategory,
      priority: 1,
      progress: 0,
      target: newGoalTarget ? Number.parseInt(newGoalTarget) : undefined,
      unit: newGoalUnit || undefined,
      deadline: newGoalDeadline || undefined,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    }

    onGoalsChange([...goals, newGoal])

    setNewGoalText("")
    setNewGoalCategory("personal")
    setNewGoalTarget("")
    setNewGoalUnit("")
    setNewGoalDeadline("")
  }

  const handleRemoveGoal = (id: string) => {
    onGoalsChange(goals.filter((goal) => goal.id !== id))
  }

  const handleUpdateProgress = (id: string, newProgress: number) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === id
        ? {
            ...goal,
            progress: Math.max(0, Math.min(100, newProgress)),
            lastUpdated: new Date().toISOString(),
          }
        : goal,
    )

    onGoalsChange(updatedGoals)
  }

  const handleQuickProgressUpdate = (id: string, increment: number) => {
    const goal = goals.find((g) => g.id === id)
    if (goal) {
      handleUpdateProgress(id, goal.progress + increment)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Your Goals</h3>

      <div className="space-y-3 mb-4">
        {goals.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No goals added yet. Add some goals below.</p>
        ) : (
          goals.map((goal) => (
            <div key={goal.id} className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">{goal.text}</p>
                  <span className="text-xs text-indigo-600 font-medium">{goal.category}</span>
                </div>
                <button
                  onClick={() => handleRemoveGoal(goal.id)}
                  className="p-1 text-red-600 hover:text-red-800"
                  aria-label="Remove goal"
                >
                  ✕
                </button>
              </div>

              <ProgressVisualizer goal={goal} showDetails={true} size="medium" />

              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => handleQuickProgressUpdate(goal.id, -10)}
                  className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                  disabled={goal.progress <= 0}
                >
                  -10%
                </button>
                <button
                  onClick={() => handleQuickProgressUpdate(goal.id, -5)}
                  className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                  disabled={goal.progress <= 0}
                >
                  -5%
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={goal.progress}
                  onChange={(e) => handleUpdateProgress(goal.id, Number.parseInt(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <button
                  onClick={() => handleQuickProgressUpdate(goal.id, 5)}
                  className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                  disabled={goal.progress >= 100}
                >
                  +5%
                </button>
                <button
                  onClick={() => handleQuickProgressUpdate(goal.id, 10)}
                  className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                  disabled={goal.progress >= 100}
                >
                  +10%
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="space-y-3 border-t pt-4">
        <h4 className="font-medium text-sm">Add New Goal</h4>
        <div>
          <label htmlFor="goal-text" className="block text-sm font-medium text-gray-700 mb-1">
            Goal
          </label>
          <input
            id="goal-text"
            type="text"
            value={newGoalText}
            onChange={(e) => setNewGoalText(e.target.value)}
            placeholder="Enter your goal"
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="goal-category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="goal-category"
              value={newGoalCategory}
              onChange={(e) => setNewGoalCategory(e.target.value)}
              className="w-full p-2 border rounded"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="goal-deadline" className="block text-sm font-medium text-gray-700 mb-1">
              Deadline (optional)
            </label>
            <input
              id="goal-deadline"
              type="date"
              value={newGoalDeadline}
              onChange={(e) => setNewGoalDeadline(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="goal-target" className="block text-sm font-medium text-gray-700 mb-1">
              Target (optional)
            </label>
            <input
              id="goal-target"
              type="number"
              value={newGoalTarget}
              onChange={(e) => setNewGoalTarget(e.target.value)}
              placeholder="e.g., 30"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="goal-unit" className="block text-sm font-medium text-gray-700 mb-1">
              Unit (optional)
            </label>
            <input
              id="goal-unit"
              type="text"
              value={newGoalUnit}
              onChange={(e) => setNewGoalUnit(e.target.value)}
              placeholder="e.g., days, books, hours"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <button
          onClick={handleAddGoal}
          className="w-full px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Add Goal
        </button>
      </div>
    </div>
  )
}
