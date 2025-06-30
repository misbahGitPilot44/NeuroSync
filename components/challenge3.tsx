"use client"

import { useState, useEffect, useRef } from "react"

interface Challenge3Props {
  onSuccess: (points: number) => void
  onGoBack: () => void
}

const WELLNESS_EXERCISES = [
  {
    id: 1,
    title: "Deep Breathing",
    description: "Take slow, deep breaths to center yourself",
    duration: 60,
    instructions: "Breathe in for 4 counts, hold for 4, breathe out for 6. Repeat.",
  },
  {
    id: 2,
    title: "Eye Rest",
    description: "Give your eyes a break from screen time",
    duration: 45,
    instructions: "Look away from your screen and focus on something 20 feet away.",
  },
  {
    id: 3,
    title: "Neck Stretch",
    description: "Relieve tension in your neck and shoulders",
    duration: 30,
    instructions: "Gently roll your neck in circles, then stretch side to side.",
  },
  {
    id: 4,
    title: "Mindful Moment",
    description: "Practice mindfulness and presence",
    duration: 90,
    instructions: "Close your eyes and focus on the present moment. Notice your thoughts without judgment.",
  },
  {
    id: 5,
    title: "Posture Check",
    description: "Improve your sitting posture",
    duration: 30,
    instructions: "Sit up straight, align your shoulders, and adjust your workspace ergonomics.",
  },
]

export function Challenge3({ onSuccess, onGoBack }: Challenge3Props) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(WELLNESS_EXERCISES[0].duration)
  const [isActive, setIsActive] = useState(false)
  const [completedExercises, setCompletedExercises] = useState<boolean[]>([false, false, false, false, false])
  const [showInstructions, setShowInstructions] = useState(true)
  const [challengeCompleted, setChallengeCompleted] = useState(false)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const currentExercise = WELLNESS_EXERCISES[currentExerciseIndex]

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Exercise completed
            const newCompleted = [...completedExercises]
            newCompleted[currentExerciseIndex] = true
            setCompletedExercises(newCompleted)
            setIsActive(false)

            // Check if all exercises are completed
            if (currentExerciseIndex === WELLNESS_EXERCISES.length - 1) {
              setChallengeCompleted(true)
              // Award 10 points for completing all exercises
              const today = new Date().toISOString().split("T")[0]
              const existingData = JSON.parse(localStorage.getItem("dailyPoints") || "{}")
              existingData[today] = (existingData[today] || 0) + 10
              localStorage.setItem("dailyPoints", JSON.stringify(existingData))
              return 0
            } else {
              // Move to next exercise
              setTimeout(() => {
                setCurrentExerciseIndex((prev) => prev + 1)
                setTimeLeft(WELLNESS_EXERCISES[currentExerciseIndex + 1].duration)
                setShowInstructions(true)
              }, 2000)
              return 0
            }
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isActive, timeLeft, currentExerciseIndex, completedExercises])

  const startExercise = () => {
    setShowInstructions(false)
    setIsActive(true)
  }

  const skipExercise = () => {
    // Mark as not completed and move to next
    if (currentExerciseIndex < WELLNESS_EXERCISES.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1)
      setTimeLeft(WELLNESS_EXERCISES[currentExerciseIndex + 1].duration)
      setShowInstructions(true)
      setIsActive(false)
    } else {
      // Last exercise, end challenge with 0 points
      onSuccess(0)
    }
  }

  const quitChallenge = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    onGoBack()
  }

  const progressPercentage = ((currentExerciseIndex + (isActive ? 1 : 0)) / WELLNESS_EXERCISES.length) * 100

  if (challengeCompleted) {
    const completedCount = completedExercises.filter(Boolean).length
    const points = completedCount === WELLNESS_EXERCISES.length ? 10 : 0

    return (
      <div className="fixed inset-0 bg-white bg-opacity-95 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4">🧘‍♀️</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Wellness Challenge Complete!</h2>
            <p className="text-gray-700 mb-4">
              You completed {completedCount} out of {WELLNESS_EXERCISES.length} exercises
            </p>
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <p className="text-lg font-semibold text-green-700">Points Earned: {points}</p>
              <p className="text-sm text-green-600">
                {points > 0
                  ? "Great job completing all exercises!"
                  : "Complete all exercises next time for full points!"}
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => onSuccess(points)}
              className="px-6 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700"
            >
              Continue
            </button>
            <button
              onClick={onGoBack}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-400"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Wellness Challenge</h2>
          <p className="text-gray-600">Complete 5 wellness exercises to earn 10 points</p>
          <div className="mt-2 text-sm text-gray-500">
            Exercise {currentExerciseIndex + 1} of {WELLNESS_EXERCISES.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Overall Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Exercise Progress */}
        <div className="mb-6">
          <div className="flex justify-center gap-2">
            {WELLNESS_EXERCISES.map((_, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  completedExercises[index]
                    ? "bg-green-500 text-white"
                    : index === currentExerciseIndex
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {completedExercises[index] ? "✓" : index + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Current Exercise */}
        <div className="bg-green-50 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-green-800 mb-2">{currentExercise.title}</h3>
          <p className="text-green-700 mb-4">{currentExercise.description}</p>

          {showInstructions ? (
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-medium mb-2">Instructions:</h4>
              <p className="text-sm text-gray-700 mb-4">{currentExercise.instructions}</p>
              <p className="text-sm text-gray-600">Duration: {currentExercise.duration} seconds</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">{timeLeft}s</div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${((currentExercise.duration - timeLeft) / currentExercise.duration) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-green-700 mt-2">Focus on the exercise...</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          {showInstructions ? (
            <>
              <button
                onClick={startExercise}
                className="px-6 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700"
              >
                Start Exercise
              </button>
              <button
                onClick={skipExercise}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-400"
              >
                Skip Exercise
              </button>
            </>
          ) : (
            <button
              onClick={skipExercise}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-400"
            >
              Skip Exercise
            </button>
          )}

          <button
            onClick={quitChallenge}
            className="px-6 py-2 bg-red-300 text-red-700 rounded-md font-medium hover:bg-red-400"
          >
            Quit Challenge
          </button>
        </div>

        {/* Warning */}
        <div className="mt-4 text-center text-xs text-gray-500">
          <p>⚠️ Quitting or skipping all exercises will result in 0 points</p>
        </div>
      </div>
    </div>
  )
}
