"use client"

import { useState, useEffect } from "react"

interface DailyPoints {
  [date: string]: number
}

export function PointsDashboard() {
  const [dailyPoints, setDailyPoints] = useState<DailyPoints>({})
  const [totalPoints, setTotalPoints] = useState(0)

  useEffect(() => {
    // Load points from localStorage
    const savedPoints = localStorage.getItem("dailyPoints")
    if (savedPoints) {
      const points = JSON.parse(savedPoints)
      setDailyPoints(points)
      // Calculate total points
      const total = Object.values(points).reduce((sum: number, dayPoints: any) => sum + dayPoints, 0)
      setTotalPoints(total)
    }

    const handleStorageChange = () => {
      // Reload points when localStorage changes
      const savedPoints = localStorage.getItem("dailyPoints")
      if (savedPoints) {
        const points = JSON.parse(savedPoints)
        setDailyPoints(points)
        // Calculate total points
        const total = Object.values(points).reduce((sum: number, dayPoints: any) => sum + dayPoints, 0)
        setTotalPoints(total)
      }
    }

    // Listen for storage changes
    window.addEventListener("storage", handleStorageChange)
    // Also check for updates every second (for same-tab updates)
    const interval = setInterval(handleStorageChange, 1000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const today = new Date().toISOString().split("T")[0]
  const todayPoints = dailyPoints[today] || 0

  const getLastSevenDays = () => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateString = date.toISOString().split("T")[0]
      days.push({
        date: dateString,
        points: dailyPoints[dateString] || 0,
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
      })
    }
    return days
  }

  const lastSevenDays = getLastSevenDays()
  const weeklyAverage = lastSevenDays.reduce((sum, day) => sum + day.points, 0) / 7

  const getPerformanceLevel = (points: number) => {
    if (points >= 6) return { level: "Excellent", color: "text-green-600", bg: "bg-green-50" }
    if (points >= 4) return { level: "Good", color: "text-blue-600", bg: "bg-blue-50" }
    if (points >= 2) return { level: "Fair", color: "text-yellow-600", bg: "bg-yellow-50" }
    return { level: "Needs Improvement", color: "text-red-600", bg: "bg-red-50" }
  }

  const todayPerformance = getPerformanceLevel(todayPoints)

  const clearAllPoints = () => {
    if (confirm("Are you sure you want to clear all points? This action cannot be undone.")) {
      localStorage.removeItem("dailyPoints")
      setDailyPoints({})
      setTotalPoints(0)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Challenge Points Dashboard</h3>
        <p className="text-gray-600">Track your daily performance and motivation</p>
      </div>

      {/* Today's Performance */}
      <div className={`${todayPerformance.bg} border border-gray-200 rounded-lg p-6`}>
        <div className="text-center">
          <h4 className="text-lg font-semibold mb-2">Today's Performance</h4>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="text-3xl font-bold text-gray-900">{todayPoints}</div>
            <div className="text-sm text-gray-500">points earned</div>
          </div>
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${todayPerformance.color} bg-white`}>
            {todayPerformance.level}
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border text-center">
          <div className="text-2xl font-bold text-indigo-600">{totalPoints}</div>
          <div className="text-sm text-gray-600">Total Points</div>
        </div>
        <div className="bg-white p-4 rounded-lg border text-center">
          <div className="text-2xl font-bold text-green-600">{Math.round(weeklyAverage * 10) / 10}</div>
          <div className="text-sm text-gray-600">Weekly Average</div>
        </div>
        <div className="bg-white p-4 rounded-lg border text-center">
          <div className="text-2xl font-bold text-blue-600">{Object.keys(dailyPoints).length}</div>
          <div className="text-sm text-gray-600">Active Days</div>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-semibold mb-4">Last 7 Days</h4>
        <div className="space-y-3">
          {lastSevenDays.map((day) => (
            <div key={day.date} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 text-sm text-gray-600">{day.dayName}</div>
                <div className="text-sm text-gray-500">{new Date(day.date).toLocaleDateString()}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((day.points / 6) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="w-8 text-sm font-medium text-right">{day.points}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Point System Info */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">How Points Work</h4>
        <ul className="text-sm space-y-1">
          <li>• Complete Writing Challenge (5 questions) = Access to Challenge 2</li>
          <li>• Watch complete motivational video = 2 points each</li>
          <li>• Skip or fast-forward video = 0 points</li>
          <li>• Complete all wellness exercises = 10 points</li>
          <li>• Complete Knowledge Quiz = Variable points (correct answers only)</li>
          <li>• Quiz: +1 for correct, -1 for wrong, 0 for not attempted</li>
          <li>• Brain Teaser Riddles = 2 points per correct answer</li>
          <li>• Maximum daily points = 46 points (6 videos + 10 wellness + 10 quiz + 20 riddles)</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex justify-center">
        <button
          onClick={clearAllPoints}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200"
        >
          Clear All Points
        </button>
      </div>
    </div>
  )
}
