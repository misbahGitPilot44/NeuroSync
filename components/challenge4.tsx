"use client"

import { useState, useEffect, useRef } from "react"

interface Challenge4Props {
  onSuccess: (points: number) => void
  onGoBack: () => void
}

interface Question {
  id: number
  question: string
  emoji: string
  options: string[]
  correctAnswer: number
  meme: string
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "What part of the brain is most associated with dopamine reward signaling?",
    emoji: "🧠🟢",
    options: ["Hippocampus", "Nucleus accumbens", "Amygdala", "Pineal gland"],
    correctAnswer: 1,
    meme: "Dopamine hits the nucleus accumbens like... 'We doin' this again?! YUP.' (brain.exe loops)",
  },
  {
    id: 2,
    question: "Which everyday activity can cause a dopamine spike?",
    emoji: "🍔📱🏃",
    options: ["Scrolling Instagram", "Eating junk food", "Going for a run", "All of the above"],
    correctAnswer: 3,
    meme: "Brain: 'Eat a salad.' Me: 'Nah, I need the dopamine from scrolling reels of dogs cooking omelettes.'",
  },
  {
    id: 3,
    question: "What happens when dopamine levels drop too low?",
    emoji: "😔📉",
    options: ["You feel more creative", "You sleep more", "You lose motivation", "You become physically stronger"],
    correctAnswer: 2,
    meme: "Low dopamine me looking at my to-do list: 'That's crazy. I'm not doing any of that.'",
  },
  {
    id: 4,
    question: 'What is a "dopamine detox"?',
    emoji: "🧘📴🕊️",
    options: ["A water-only diet", "A social media challenge", "A break from instant gratification", "A brain surgery"],
    correctAnswer: 2,
    meme: "Day 1 of dopamine detox: 'Maybe I'll just look at one meme...'",
  },
  {
    id: 5,
    question: "Which hormone works alongside dopamine to reinforce habits?",
    emoji: "🤝🧪",
    options: ["Insulin", "Oxytocin", "Testosterone", "Adrenaline"],
    correctAnswer: 1,
    meme: "Dopamine and Oxytocin high-fiving like: 'Let's make this feel too good to stop.'",
  },
  {
    id: 6,
    question: "What's a behavior driven more by dopamine anticipation than reward?",
    emoji: "🌀📱💭",
    options: ["Reading a book", "Sleeping", "Craving a notification", "Drinking water"],
    correctAnswer: 2,
    meme: "When you check your phone, and it's just an ad: 'The dopamine anticipation betrayed me.'",
  },
  {
    id: 7,
    question: "True or False: Social media apps are designed to trigger dopamine release.",
    emoji: "📲🎯",
    options: ["True", "False"],
    correctAnswer: 0,
    meme: "Instagram: 'Here's 30 seconds of serotonin.' Dopamine system: 'Bet. Let's waste 3 hours.'",
  },
  {
    id: 8,
    question: "Which activity is more likely to create sustainable dopamine balance?",
    emoji: "📈⚖️",
    options: ["Watching reels", "Completing daily goals", "Eating cake", "Refreshing YouTube comments"],
    correctAnswer: 1,
    meme: "Finishing a goal = dopamine with dignity vs. Scroll dopamine = 'Discount version of happiness'",
  },
  {
    id: 9,
    question: "What's the brain's reward chemical often mistaken for happiness?",
    emoji: "🧪🤯",
    options: ["Serotonin", "Dopamine", "Melatonin", "Endorphins"],
    correctAnswer: 1,
    meme: "Dopamine: 'I never said I was happiness. I'm just the gas pedal.'",
  },
  {
    id: 10,
    question: "Which term describes endlessly scrolling short-form content?",
    emoji: "📱📉",
    options: ["Mind gardening", "Doomscrolling", "Meme mining", "Deep diving"],
    correctAnswer: 1,
    meme: "1am me: 'Just one more scroll.' 4am me: 'Congratulations, you've reached the end of the internet.'",
  },
]

export function Challenge4({ onSuccess, onGoBack }: Challenge4Props) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(QUIZ_QUESTIONS.length).fill(null))
  const [showResult, setShowResult] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [showMeme, setShowMeme] = useState(false)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex]

  useEffect(() => {
    if (!isAnswered && !quizCompleted) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Time's up, move to next question
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
  }, [currentQuestionIndex, isAnswered, quizCompleted])

  const handleTimeUp = () => {
    // Mark as not attempted (no points change)
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = null
    setAnswers(newAnswers)

    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      // Move to next question
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1)
        setTimeLeft(30)
        setSelectedAnswer(null)
        setIsAnswered(false)
        setShowResult(false)
        setShowMeme(false)
      }, 1000)
    } else {
      // Quiz completed
      completeQuiz()
    }
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
    newAnswers[currentQuestionIndex] = answerIndex
    setAnswers(newAnswers)

    // Calculate score
    let newScore = score
    if (answerIndex === currentQuestion.correctAnswer) {
      newScore += 1
    } else {
      newScore -= 1
    }
    setScore(newScore)

    // Show result
    setShowResult(true)

    // Show meme after 2 seconds, then proceed
    setTimeout(() => {
      setShowMeme(true)

      setTimeout(() => {
        if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
          // Move to next question
          setCurrentQuestionIndex((prev) => prev + 1)
          setTimeLeft(30)
          setSelectedAnswer(null)
          setIsAnswered(false)
          setShowResult(false)
          setShowMeme(false)
        } else {
          // Quiz completed
          completeQuiz()
        }
      }, 3000)
    }, 2000)
  }

  const completeQuiz = () => {
    setQuizCompleted(true)

    // Save points to localStorage
    const today = new Date().toISOString().split("T")[0]
    const existingData = JSON.parse(localStorage.getItem("dailyPoints") || "{}")
    existingData[today] = (existingData[today] || 0) + Math.max(0, score) // Only add positive points
    localStorage.setItem("dailyPoints", JSON.stringify(existingData))
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600"
    if (score >= 5) return "text-blue-600"
    if (score >= 2) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreMessage = (score: number) => {
    if (score >= 8) return "Dopamine Expert! 🧠✨"
    if (score >= 5) return "Good Knowledge! 👍"
    if (score >= 2) return "Getting There! 📚"
    return "Keep Learning! 💪"
  }

  if (quizCompleted) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-95 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4">🧠</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
            <p className="text-gray-700 mb-4">Dopamine Delay Knowledge Nuggets</p>

            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <div className={`text-4xl font-bold mb-2 ${getScoreColor(score)}`}>
                {score}/{QUIZ_QUESTIONS.length}
              </div>
              <p className="text-lg font-medium text-gray-700 mb-2">{getScoreMessage(score)}</p>
              <p className="text-sm text-gray-600">
                Points earned: {Math.max(0, score)} (only positive points count toward daily total)
              </p>
            </div>

            <div className="text-left bg-blue-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold mb-2">Your Answers:</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {QUIZ_QUESTIONS.map((q, index) => (
                  <div key={q.id} className="text-sm">
                    <span className="font-medium">Q{index + 1}:</span>
                    {answers[index] === null ? (
                      <span className="text-gray-500 ml-2">Not attempted</span>
                    ) : answers[index] === q.correctAnswer ? (
                      <span className="text-green-600 ml-2">✓ Correct</span>
                    ) : (
                      <span className="text-red-600 ml-2">✗ Wrong</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => onSuccess(Math.max(0, score))}
              className="px-6 py-2 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700"
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Dopamine Delay Knowledge Nuggets</h2>
          <p className="text-gray-600">Test your knowledge about dopamine and digital wellness</p>
          <div className="mt-2 text-sm text-gray-500">
            Question {currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{Math.round(((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Timer and Score */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className={`text-2xl font-bold ${timeLeft <= 10 ? "text-red-600" : "text-green-600"}`}>
              {timeLeft}s
            </div>
            <div className="text-sm text-gray-600">Time remaining</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-900">Score: {score}</div>
            <div className="text-xs text-gray-500">+1 correct, -1 wrong</div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-purple-50 rounded-lg p-6 mb-6">
          <div className="text-center mb-4">
            <div className="text-2xl mb-2">{currentQuestion.emoji}</div>
            <h3 className="text-lg font-semibold text-purple-800">{currentQuestion.question}</h3>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={isAnswered}
                className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                  isAnswered
                    ? index === currentQuestion.correctAnswer
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
                {isAnswered && index === currentQuestion.correctAnswer && (
                  <span className="float-right text-green-600">✓</span>
                )}
                {isAnswered && selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                  <span className="float-right text-red-600">✗</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Result and Meme */}
        {showResult && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            {selectedAnswer === currentQuestion.correctAnswer ? (
              <div className="text-center text-green-600">
                <div className="text-2xl mb-2">🎉</div>
                <p className="font-semibold">Correct! +1 point</p>
              </div>
            ) : (
              <div className="text-center text-red-600">
                <div className="text-2xl mb-2">❌</div>
                <p className="font-semibold">Wrong! -1 point</p>
                <p className="text-sm mt-1">
                  Correct answer: {String.fromCharCode(65 + currentQuestion.correctAnswer)}.{" "}
                  {currentQuestion.options[currentQuestion.correctAnswer]}
                </p>
              </div>
            )}
          </div>
        )}

        {showMeme && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="text-center">
              <div className="text-xl mb-2">😂</div>
              <p className="text-sm italic text-gray-700">{currentQuestion.meme}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onGoBack}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-400"
          >
            Quit Quiz
          </button>
        </div>

        {/* Question Progress Dots */}
        <div className="mt-6 text-center">
          <div className="flex justify-center space-x-2">
            {QUIZ_QUESTIONS.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index < currentQuestionIndex
                    ? answers[index] === QUIZ_QUESTIONS[index].correctAnswer
                      ? "bg-green-500"
                      : answers[index] === null
                        ? "bg-gray-400"
                        : "bg-red-500"
                    : index === currentQuestionIndex
                      ? "bg-purple-500"
                      : "bg-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">🟢 Correct • 🔴 Wrong • ⚪ Not attempted • 🟣 Current</p>
        </div>
      </div>
    </div>
  )
}
