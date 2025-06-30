"use client"

import { useState } from "react"
import { LandingPage } from "@/components/landing-page"
import { OptionsPage } from "@/components/options-page"
import { WritingChallenge } from "@/components/writing-challenge"
import { Challenge2 } from "@/components/challenge2"
import { Challenge3 } from "@/components/challenge3"
import { Challenge4 } from "@/components/challenge4"
import { Challenge5 } from "@/components/challenge5"
import { SiteSimulator } from "@/components/site-simulator"
import { SettingsPanel } from "@/components/settings-panel"
import type { Settings } from "@/types/settings"

// Default settings with progress tracking
const DEFAULT_SETTINGS: Settings = {
  enabled: true,
  sites: [
    { url: "https://www.instagram.com/misbahulislam_2602", baseDelay: 30 },
    { url: "https://www.youtube.com/", baseDelay: 30 },
    { url: "https://github.com/misbahGitPilot44", baseDelay: 30 },
    { url: "https://www.linkedin.com/in/misbah-ul-islam-0501b2323/", baseDelay: 30 },
    { url: "https://discord.com/channels/@me/1378005598825873482", baseDelay: 30 },
  ],
  maxDelay: 120,
  minDelay: 10,
  timeFactorWeight: 0.3,
  usageFactorWeight: 0.5,
  emotionFactorWeight: 0.2,
  highUsageThreshold: 60,
  peakHours: [20, 21, 22, 23, 0, 1],
  productiveHours: [9, 10, 11, 12, 13, 14, 15, 16],
  showReflectionPrompts: true,
  showInspirationalContent: true,
  showGoalReminders: true,
  goals: [
    {
      id: "goal-1",
      text: "Complete my online course by the end of the month",
      category: "learning",
      priority: 1,
      progress: 65,
      target: 20,
      unit: "lessons",
      deadline: "2024-12-31",
      createdAt: "2024-12-01T00:00:00.000Z",
      lastUpdated: "2024-12-13T00:00:00.000Z",
    },
    {
      id: "goal-2",
      text: "Exercise for 30 minutes at least 3 times a week",
      category: "health",
      priority: 1,
      progress: 40,
      target: 12,
      unit: "sessions",
      deadline: "2024-12-31",
      createdAt: "2024-12-01T00:00:00.000Z",
      lastUpdated: "2024-12-12T00:00:00.000Z",
    },
    {
      id: "goal-3",
      text: "Spend more quality time with family",
      category: "relationships",
      priority: 1,
      progress: 80,
      target: 30,
      unit: "hours",
      createdAt: "2024-12-01T00:00:00.000Z",
      lastUpdated: "2024-12-13T00:00:00.000Z",
    },
    {
      id: "goal-4",
      text: "Read 12 books this year",
      category: "learning",
      priority: 1,
      progress: 75,
      target: 12,
      unit: "books",
      deadline: "2024-12-31",
      createdAt: "2024-01-01T00:00:00.000Z",
      lastUpdated: "2024-12-10T00:00:00.000Z",
    },
    {
      id: "goal-5",
      text: "Learn to play guitar",
      category: "personal",
      priority: 1,
      progress: 25,
      target: 50,
      unit: "practice sessions",
      createdAt: "2024-11-01T00:00:00.000Z",
      lastUpdated: "2024-12-11T00:00:00.000Z",
    },
  ],
}

type AppState = "landing" | "options" | "main-site"

export default function Home() {
  const [appState, setAppState] = useState<AppState>("landing")
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [showWritingChallenge, setShowWritingChallenge] = useState(false)
  const [showChallenge2, setShowChallenge2] = useState(false)
  const [showChallenge3, setShowChallenge3] = useState(false)
  const [showChallenge4, setShowChallenge4] = useState(false)
  const [showChallenge5, setShowChallenge5] = useState(false)
  const [currentSite, setCurrentSite] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showWritingChallengeMode, setShowWritingChallengeMode] = useState(false)

  const handleSiteClick = (site: string) => {
    if (!settings.enabled) {
      setCurrentSite(site)
      return
    }

    setCurrentSite(site)
    setShowWritingChallenge(true)
  }

  const handleWritingChallengeSuccess = () => {
    setShowWritingChallenge(false)
    // Direct access to site after completing writing challenge
    if (currentSite) {
      window.open(currentSite, "_blank")
    }
  }

  const handleChallenge2Success = (points?: number) => {
    setShowChallenge2(false)
    if (points !== undefined) {
      console.log(`Challenge 2 completed! Points earned: ${points}`)
    }
  }

  const handleChallenge3Success = (points?: number) => {
    setShowChallenge3(false)
    if (points !== undefined) {
      console.log(`Challenge 3 completed! Points earned: ${points}`)
    }
  }

  const handleChallenge4Success = (points?: number) => {
    setShowChallenge4(false)
    if (points !== undefined) {
      console.log(`Challenge 4 completed! Points earned: ${points}`)
    }
  }

  const handleChallenge5Success = (points?: number) => {
    setShowChallenge5(false)
    if (points !== undefined) {
      console.log(`Challenge 5 completed! Points earned: ${points}`)
    }
  }

  const handleGoBack = () => {
    setShowWritingChallenge(false)
    setShowChallenge2(false)
    setShowChallenge3(false)
    setShowChallenge4(false)
    setShowChallenge5(false)
    setShowWritingChallengeMode(false)
    setCurrentSite(null)
  }

  const toggleSettings = () => {
    setShowSettings(!showSettings)
  }

  const startChallenge2 = () => {
    setShowChallenge2(true)
  }

  const startChallenge3 = () => {
    setShowChallenge3(true)
  }

  const startChallenge4 = () => {
    setShowChallenge4(true)
  }

  const startChallenge5 = () => {
    setShowChallenge5(true)
  }

  const startWritingChallengeMode = () => {
    setShowWritingChallengeMode(true)
  }

  // Landing Page
  if (appState === "landing") {
    return <LandingPage onContinue={() => setAppState("options")} />
  }

  // Options Page
  if (appState === "options") {
    return <OptionsPage onSiteClick={() => setAppState("main-site")} />
  }

  // Main Dopamine Delay System
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">NeuroSync: Delay the Dopamine, Hack Your Habits</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setAppState("options")}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Back to Options
            </button>
            <button
              onClick={toggleSettings}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              {showSettings ? "Close Settings" : "Settings"}
            </button>
          </div>
        </header>

        {showSettings ? (
          <SettingsPanel settings={settings} onSettingsChange={setSettings} />
        ) : (
          <>
            {/* Challenge Access Buttons */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Choose Your Challenge</h2>
              <p className="text-gray-600 mb-6">
               Explore 5 Powerful Challenges to Reclaim Your Focus. Choose any challenge to pause, reflect, and realign your digital habits.


              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={startWritingChallengeMode}
                  className="flex items-center gap-3 px-6 py-4 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                    </svg>
                  </div>
                  Writing Challenge
                </button>

                <button
                  onClick={startChallenge2}
                  className="flex items-center gap-3 px-6 py-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
                    </svg>
                  </div>
                  Motivation Challenge
                </button>

                <button
                  onClick={startChallenge3}
                  className="flex items-center gap-3 px-6 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" />
                    </svg>
                  </div>
                  Wellness Challenge
                </button>

                <button
                  onClick={startChallenge4}
                  className="flex items-center gap-3 px-6 py-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M12,3C13.73,3 15.13,4.58 15.35,6.53C16.94,6.5 18.5,7.82 18.5,10H17.5C17.5,8.92 16.92,8 16.06,8H15.69C15.42,9.34 14.86,10.28 14,10.28C13.14,10.28 12.58,9.34 12.31,8H11.94C11.08,8 10.5,8.92 10.5,10H9.5C9.5,7.82 11.06,6.5 12.65,6.53C12.87,4.58 14.27,3 16,3H12M12,5A1,1 0 0,1 13,6A1,1 0 0,1 12,7A1,1 0 0,1 11,6A1,1 0 0,1 12,5M16,5A1,1 0 0,1 17,6A1,1 0 0,1 16,7A1,1 0 0,1 15,6A1,1 0 0,1 16,5M7.91,10.09C8.66,10.09 9.41,10.23 10.12,10.5L9.47,11.38C8.96,11.19 8.44,11.09 7.91,11.09C6.83,11.09 5.79,11.5 4.95,12.21L4.24,11.38C5.32,10.5 6.58,10.09 7.91,10.09M16.09,10.09C17.42,10.09 18.68,10.5 19.76,11.38L19.05,12.21C18.21,11.5 17.17,11.09 16.09,11.09C15.56,11.09 15.04,11.19 14.53,11.38L13.88,10.5C14.59,10.23 15.34,10.09 16.09,10.09M7.91,12.09C8.25,12.09 8.58,12.14 8.91,12.23L8.27,13.1C8.15,13.07 8.03,13.09 7.91,13.09C7.79,13.09 7.67,13.07 7.55,13.1L6.91,12.23C7.24,12.14 7.57,12.09 7.91,12.09M16.09,12.09C16.43,12.09 16.76,12.14 17.09,12.23L16.45,13.1C16.33,13.07 16.21,13.09 16.09,13.09C15.97,13.09 15.85,13.07 15.73,13.1L15.09,12.23C15.42,12.14 15.75,12.09 16.09,12.09Z" />
                    </svg>
                  </div>
                  Knowledge Quiz
                </button>

                <button
                  onClick={startChallenge5}
                  className="flex items-center gap-3 px-6 py-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
                    </svg>
                  </div>
                  Brain Teasers
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Writing Challenge</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Answer 5 questions (50+ words each)</li>
                    <li>• 60 seconds per question</li>
                    <li>• Complete to access blocked sites</li>
                    <li>• Tests cognitive engagement</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Motivation Challenge</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Watch 3 motivational videos</li>
                    <li>• Earn 2 points per complete video</li>
                    <li>• Build daily point streaks</li>
                    <li>• Boost motivation and focus</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Wellness Challenge</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>• 5 timed wellness exercises</li>
                    <li>• Meditation, eye rest, stretching</li>
                    <li>• Complete all for 10 points</li>
                    <li>• Quit or fail = 0 points</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Knowledge Quiz</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>• 10 MCQ questions about dopamine</li>
                    <li>• +1 point for correct, -1 for wrong</li>
                    <li>• 30 seconds per question</li>
                    <li>• Auto-advance when time expires</li>
                  </ul>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Brain Teaser Challenge</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>• 10 mind-bending riddles</li>
                    <li>• 30 seconds per riddle</li>
                    <li>• +2 points for correct answers</li>
                    <li>• Explanations after each riddle</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}

        {showWritingChallengeMode && !showWritingChallenge && (
          <div className="fixed inset-0 bg-white z-40 overflow-auto">
            <div className="container mx-auto px-4 py-8">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Writing Challenge Mode</h1>
                <button
                  onClick={() => setShowWritingChallengeMode(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Back to Main
                </button>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Complete the writing challenge to access these sites</h2>
                <p className="text-gray-600 mb-6">
                  Click any site below to start the 5-question writing challenge. You must complete all questions with
                  50+ words each within 60 seconds per question to gain access.
                </p>
              </div>
              <SiteSimulator
                sites={settings.sites.map((site) => site.url)}
                onSiteClick={handleSiteClick}
                currentSite={currentSite}
              />
            </div>
          </div>
        )}

        {showWritingChallenge && (
          <WritingChallenge
            site={currentSite || ""}
            onSuccess={handleWritingChallengeSuccess}
            onFail={() => {}}
            onGoBack={handleGoBack}
          />
        )}

        {showChallenge2 && <Challenge2 onSuccess={handleChallenge2Success} onGoBack={handleGoBack} />}

        {showChallenge3 && <Challenge3 onSuccess={handleChallenge3Success} onGoBack={handleGoBack} />}

        {showChallenge4 && <Challenge4 onSuccess={handleChallenge4Success} onGoBack={handleGoBack} />}

        {showChallenge5 && <Challenge5 onSuccess={handleChallenge5Success} onGoBack={handleGoBack} />}
      </div>
    </main>
  )
}
