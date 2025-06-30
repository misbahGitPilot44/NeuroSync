"use client"

import { useState, useEffect, useRef } from "react"
import { getRandomPrompt } from "@/lib/prompts"

interface WritingChallengeProps {
  site: string
  onSuccess: () => void
  onFail: () => void
  onGoBack: () => void
}

export function WritingChallenge({ site, onSuccess, onFail, onGoBack }: WritingChallengeProps) {
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [questions] = useState(() => {
    // Generate 5 random questions for this challenge
    const questionSet = []
    for (let i = 0; i < 5; i++) {
      questionSet.push(getRandomPrompt())
    }
    return questionSet
  })
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [timeLeft, setTimeLeft] = useState(60)
  const [wordCount, setWordCount] = useState(0)
  const [isActive, setIsActive] = useState(true)
  const [challengeStatus, setChallengeStatus] = useState<"active" | "passed" | "failed">("active")
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const nextButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (wordCount >= 50) {
              // If they've written enough words but time ran out while they didn't click next
              // We'll still count it as a success for this question
              if (currentQuestion < 5) {
                setCurrentQuestion((prev) => prev + 1)
                setCurrentAnswer("")
                setTimeLeft(60)
                return 60
              } else {
                // All questions completed successfully
                setChallengeStatus("passed")
                setIsActive(false)
                return 0
              }
            } else {
              // Failed - not enough words written when time ran out
              setIsActive(false)
              setChallengeStatus("failed")
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
  }, [isActive, timeLeft, wordCount, currentQuestion])

  useEffect(() => {
    const words = currentAnswer
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0)
    setWordCount(words.length)
  }, [currentAnswer])

  // Auto-focus the next button when word count reaches 50
  useEffect(() => {
    if (wordCount >= 50 && isActive && nextButtonRef.current) {
      nextButtonRef.current.focus()
    }
  }, [wordCount, isActive])

  const handleNextQuestion = () => {
    if (wordCount >= 50) {
      if (currentQuestion < 5) {
        // Move to next question
        setCurrentQuestion((prev) => prev + 1)
        setCurrentAnswer("")
        setTimeLeft(60)
        setIsActive(true)
      } else {
        // All questions completed successfully
        setChallengeStatus("passed")
        setIsActive(false)
      }
    }
  }

  const handleRetry = () => {
    setCurrentQuestion(1)
    setCurrentAnswer("")
    setTimeLeft(60)
    setWordCount(0)
    setIsActive(true)
    setChallengeStatus("active")
  }

  const getProgressColor = () => {
    if (wordCount >= 50) return "bg-green-500"
    if (wordCount >= 40) return "bg-yellow-500"
    if (wordCount >= 25) return "bg-orange-500"
    return "bg-red-500"
  }

  const getTimeColor = () => {
    if (timeLeft > 40) return "text-green-600"
    if (timeLeft > 20) return "text-yellow-600"
    if (timeLeft > 10) return "text-orange-600"
    return "text-red-600"
  }

  if (challengeStatus === "passed") {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-95 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Writing Challenge Complete!</h2>
            <p className="text-gray-700">You have successfully passed the writing challenge!</p>
            <p className="text-sm text-gray-500 mt-2">
              You completed all 5 questions with 50+ words each within the time limit.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={onSuccess}
              className="px-6 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700"
            >
              {site ? `Continue to ${new URL(site).hostname}` : "Continue"}
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

  if (challengeStatus === "failed") {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-95 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Challenge Failed</h2>
            <p className="text-gray-700">You failed to write 50 words within the time limit.</p>
            <p className="text-sm text-gray-500 mt-2">You must redo the test to pass and access the site.</p>
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleRetry}
              className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
            >
              Retry Challenge
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Writing Challenge</h2>
          <p className="text-gray-600">
            Complete this challenge to access {site ? new URL(site).hostname : "the site"}
          </p>
          <div className="mt-2 text-sm text-gray-500">
            Question {currentQuestion} of 5 • Write 50+ words in 60 seconds
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-2xl font-bold ${getTimeColor()}`}>{timeLeft}s</span>
            <span className={`font-medium ${wordCount >= 50 ? "text-green-600" : "text-gray-600"}`}>
              {wordCount}/50 words
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${getProgressColor()}`}
              style={{ width: `${Math.min((wordCount / 50) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-lg mb-2">Question {currentQuestion}:</h3>
          <p className="text-gray-700">{questions[currentQuestion - 1]}</p>
        </div>

        <div className="mb-6">
          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Start writing your response here..."
            className="w-full h-40 p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!isActive}
            autoFocus
          />
        </div>

        <div className="flex justify-center gap-4">
          {wordCount >= 50 ? (
            <button
              ref={nextButtonRef}
              onClick={handleNextQuestion}
              className="px-6 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 animate-pulse"
            >
              {currentQuestion < 5 ? "Next Question" : "Complete Challenge"}
            </button>
          ) : (
            <button disabled className="px-6 py-2 bg-gray-300 text-gray-500 rounded-md font-medium cursor-not-allowed">
              {`Need ${50 - wordCount} more words`}
            </button>
          )}
          <button
            onClick={onGoBack}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-400"
          >
            Go Back
          </button>
        </div>

        <div className="mt-4 text-center">
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <div
                key={num}
                className={`w-3 h-3 rounded-full ${
                  num < currentQuestion ? "bg-green-500" : num === currentQuestion ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">Progress through questions</p>
        </div>
      </div>
    </div>
  )
}
