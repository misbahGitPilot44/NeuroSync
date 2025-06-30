"use client"

import { useState, useEffect, useRef } from "react"

interface Challenge5Props {
  onSuccess: (points: number) => void
  onGoBack: () => void
}

interface Riddle {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const RIDDLES: Riddle[] = [
  {
    id: 1,
    question: "What comes once in a minute, twice in a moment, but never in a thousand years?",
    options: ["Time", "The letter M", "Silence", "Opportunity"],
    correctAnswer: 1,
    explanation: "The letter 'M' appears once in 'minute', twice in 'moment', but never in 'thousand years'.",
  },
  {
    id: 2,
    question: "You see a boat filled with people, but there isn't a single person on board. How is that possible?",
    options: ["It's a ghost ship", "They're all married", "They're underwater", "It's an illusion"],
    correctAnswer: 1,
    explanation: "They're all married - so there are no 'single' people on board!",
  },
  {
    id: 3,
    question: "I speak without a mouth and hear without ears. I have no body, but I come alive with the wind.",
    options: ["A radio", "An echo", "A whisper", "A spirit"],
    correctAnswer: 1,
    explanation:
      "An echo can 'speak' by repeating sounds and 'comes alive' when sound bounces off surfaces, especially in windy conditions.",
  },
  {
    id: 4,
    question: "What has keys but can't open locks?",
    options: ["A broken key", "A piano", "A computer", "A map"],
    correctAnswer: 1,
    explanation: "A piano has keys (the black and white keys you press) but they can't open locks.",
  },
  {
    id: 5,
    question: "The more you take, the more you leave behind. What am I?",
    options: ["Memories", "Footsteps", "Time", "Breath"],
    correctAnswer: 1,
    explanation: "Footsteps - the more steps you take, the more footprints you leave behind.",
  },
  {
    id: 6,
    question: "What can travel around the world while staying in the same corner?",
    options: ["A stamp", "A spider", "A thought", "The wind"],
    correctAnswer: 0,
    explanation:
      "A stamp stays in the corner of an envelope but can travel around the world when the letter is mailed.",
  },
  {
    id: 7,
    question: "What begins with T, ends with T, and has T in it?",
    options: ["A tent", "A teapot", "A trumpet", "A tablet"],
    correctAnswer: 1,
    explanation: "A teapot begins with 'T', ends with 'T', and has tea (T) in it!",
  },
  {
    id: 8,
    question: "I have branches, but no fruit, trunk, or leaves. What am I?",
    options: ["A river", "A bank", "A family tree", "A lightning bolt"],
    correctAnswer: 1,
    explanation: "A bank has branches (branch offices) but no fruit, trunk, or leaves like a tree.",
  },
  {
    id: 9,
    question: "What gets wetter the more it dries?",
    options: ["A sponge", "A towel", "Hair", "Paint"],
    correctAnswer: 1,
    explanation: "A towel gets wetter as it dries other things by absorbing the water.",
  },
  {
    id: 10,
    question: "I'm tall when I'm young, and I'm short when I'm old. What am I?",
    options: ["A person", "A candle", "A tree", "A building"],
    correctAnswer: 1,
    explanation: "A candle is tall when new (young) and gets shorter as it burns and gets older.",
  },
]

export function Challenge5({ onSuccess, onGoBack }: Challenge5Props) {
  const [currentRiddleIndex, setCurrentRiddleIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(RIDDLES.length).fill(null))
  const [showExplanation, setShowExplanation] = useState(false)
  const [challengeCompleted, setChallengeCompleted] = useState(false)
  const [showPointsPopup, setShowPointsPopup] = useState(false)
  const [earnedPoints, setEarnedPoints] = useState(0)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const currentRiddle = RIDDLES[currentRiddleIndex]

  useEffect(() => {
    if (!isAnswered && !challengeCompleted) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Time's up, show explanation and move to next
            handleTimeUp()
            return 30
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [currentRiddleIndex, isAnswered, challengeCompleted])

  const handleTimeUp = () => {
    // Mark as not attempted
    const newAnswers = [...answers]
    newAnswers[currentRiddleIndex] = null
    setAnswers(newAnswers)
    setIsAnswered(true)
    setShowExplanation(true)

    // Auto-advance after showing explanation
    setTimeout(() => {
      if (currentRiddleIndex < RIDDLES.length - 1) {
        moveToNextRiddle()
      } else {
        completeChallenge()
      }
    }, 4000)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return

    setSelectedAnswer(answerIndex)
    setIsAnswered(true)

    // Clear the timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Update answers array
    const newAnswers = [...answers]
    newAnswers[currentRiddleIndex] = answerIndex
    setAnswers(newAnswers)

    // Calculate score
    let pointsEarned = 0
    if (answerIndex === currentRiddle.correctAnswer) {
      pointsEarned = 2
      setScore((prev) => prev + 2)
    }

    // Show explanation
    setShowExplanation(true)

    // Show points popup if points were earned
    if (pointsEarned > 0) {
      setEarnedPoints(pointsEarned)
      setShowPointsPopup(true)

      // Save points to localStorage immediately
      const today = new Date().toISOString().split("T")[0]
      const existingData = JSON.parse(localStorage.getItem("dailyPoints") || "{}")
      existingData[today] = (existingData[today] || 0) + pointsEarned
      localStorage.setItem("dailyPoints", JSON.stringify(existingData))
    }

    // Auto-advance after showing explanation
    setTimeout(() => {
      if (currentRiddleIndex < RIDDLES.length - 1) {
        moveToNextRiddle()
      } else {
        completeChallenge()
      }
    }, 4000)
  }

  const moveToNextRiddle = () => {
    setCurrentRiddleIndex((prev) => prev + 1)
    setTimeLeft(30)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setShowExplanation(false)
    setShowPointsPopup(false)
  }

  const completeChallenge = () => {
    setChallengeCompleted(true)
  }

  const handleGoBack = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    onGoBack()
  }

  const progressPercentage = ((currentRiddleIndex + 1) / RIDDLES.length) * 100

  // Points Earned Popup
  if (showPointsPopup) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center max-w-md">
          <div className="text-6xl mb-4">🧠</div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Correct!</h2>
          <p className="text-lg text-gray-700 mb-4">You earned {earnedPoints} points!</p>
          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-green-700">Great thinking! 🎯</p>
            <p className="text-xs text-green-600 mt-1">
              {currentRiddleIndex < RIDDLES.length - 1 ? "Next riddle coming up..." : "Challenge completed!"}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (challengeCompleted) {
    const correctAnswers = answers.filter((answer, index) => answer === RIDDLES[index].correctAnswer).length
    const totalPoints = correctAnswers * 2

    return (
      <div className="fixed inset-0 bg-white bg-opacity-95 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4">🧩</div>
            <h2 className="text-2xl font-bold text-purple-600 mb-2">Brain Teaser Challenge Complete!</h2>
            <p className="text-gray-700 mb-4">
              You solved {correctAnswers} out of {RIDDLES.length} riddles correctly
            </p>
            <div className="bg-purple-50 p-4 rounded-lg mb-4">
              <p className="text-lg font-semibold text-purple-700">Points Earned: {totalPoints}</p>
              <p className="text-sm text-purple-600">
                {totalPoints > 0
                  ? `Excellent brain work! ${correctAnswers} correct answers × 2 points each`
                  : "Keep practicing those thinking skills!"}
              </p>
            </div>

            <div className="text-left bg-blue-50 p-4 rounded-lg mb-4 max-h-40 overflow-y-auto">
              <h3 className="font-semibold mb-2">Your Performance:</h3>
              <div className="space-y-1">
                {RIDDLES.map((riddle, index) => (
                  <div key={riddle.id} className="text-sm flex justify-between">
                    <span>Riddle {index + 1}:</span>
                    {answers[index] === null ? (
                      <span className="text-gray-500">⏰ Time up</span>
                    ) : answers[index] === riddle.correctAnswer ? (
                      <span className="text-green-600">✓ Correct (+2)</span>
                    ) : (
                      <span className="text-red-600">✗ Wrong (0)</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => onSuccess(totalPoints)}
              className="px-6 py-2 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700"
            >
              Continue
            </button>
            <button
              onClick={handleGoBack}
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Brain Teaser Challenge</h2>
          <p className="text-gray-600">Solve riddles to exercise your mind and earn points</p>
          <div className="mt-2 text-sm text-gray-500">
            Riddle {currentRiddleIndex + 1} of {RIDDLES.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Timer and Score */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className={`text-3xl font-bold ${timeLeft <= 10 ? "text-red-600" : "text-green-600"}`}>
              {timeLeft}s
            </div>
            <div className="text-sm text-gray-600">Think fast!</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-900">Score: {score}</div>
            <div className="text-xs text-gray-500">+2 per correct answer</div>
          </div>
        </div>

        {/* Riddle */}
        <div className="bg-purple-50 rounded-lg p-6 mb-6">
          <div className="text-center mb-4">
            <div className="text-3xl mb-3">🧩</div>
            <h3 className="text-lg font-semibold text-purple-800 leading-relaxed">{currentRiddle.question}</h3>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentRiddle.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={isAnswered}
                className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                  isAnswered
                    ? index === currentRiddle.correctAnswer
                      ? "border-green-500 bg-green-50 text-green-800"
                      : selectedAnswer === index
                        ? "border-red-500 bg-red-50 text-red-800"
                        : "border-gray-200 bg-gray-50 text-gray-500"
                    : selectedAnswer === index
                      ? "border-purple-500 bg-purple-100"
                      : "border-gray-300 hover:border-purple-300 hover:bg-purple-50"
                } ${isAnswered ? "cursor-not-allowed" : "cursor-pointer"}`}
              >
                <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                {option}
                {isAnswered && index === currentRiddle.correctAnswer && (
                  <span className="float-right text-green-600">✓</span>
                )}
                {isAnswered && selectedAnswer === index && index !== currentRiddle.correctAnswer && (
                  <span className="float-right text-red-600">✗</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="text-center">
              <h4 className="font-semibold text-blue-800 mb-2">
                {selectedAnswer === currentRiddle.correctAnswer
                  ? "🎉 Correct!"
                  : selectedAnswer === null
                    ? "⏰ Time's Up!"
                    : "🤔 Not quite!"}
              </h4>
              <p className="text-sm text-blue-700 mb-2">
                <strong>Answer:</strong> {currentRiddle.options[currentRiddle.correctAnswer]}
              </p>
              <p className="text-sm text-blue-600 italic">{currentRiddle.explanation}</p>
              <p className="text-xs text-blue-500 mt-2">
                {currentRiddleIndex < RIDDLES.length - 1 ? "Next riddle coming up..." : "Challenge completed!"}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleGoBack}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-400"
          >
            Quit Challenge
          </button>
        </div>

        {/* Riddle Progress Dots */}
        <div className="mt-6 text-center">
          <div className="flex justify-center space-x-2">
            {RIDDLES.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index < currentRiddleIndex
                    ? answers[index] === RIDDLES[index].correctAnswer
                      ? "bg-green-500"
                      : answers[index] === null
                        ? "bg-gray-400"
                        : "bg-red-500"
                    : index === currentRiddleIndex
                      ? "bg-purple-500"
                      : "bg-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">🟢 Correct • 🔴 Wrong • ⚪ Time up • 🟣 Current</p>
        </div>
      </div>
    </div>
  )
}
