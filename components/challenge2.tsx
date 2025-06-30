"use client"

import { useState, useRef, useEffect } from "react"

interface Challenge2Props {
  onSuccess: (points: number) => void
  onGoBack: () => void
}

const VIDEOS = [
  {
    id: "idrbwnWLJ7w",
    title: "Motivational Video 1",
    url: "https://www.youtube.com/embed/idrbwnWLJ7w",
    duration: 180, // 3 minutes in seconds
  },
  {
    id: "FWTNMzK9vG4",
    title: "Motivational Video 2",
    url: "https://www.youtube.com/embed/FWTNMzK9vG4",
    duration: 180,
  },
  {
    id: "wr6fQ4KpbRM",
    title: "Motivational Video 3",
    url: "https://www.youtube.com/embed/wr6fQ4KpbRM",
    duration: 180,
  },
]

export function Challenge2({ onSuccess, onGoBack }: Challenge2Props) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [watchedTime, setWatchedTime] = useState(0)
  const [totalPoints, setTotalPoints] = useState(0)
  const [videoPoints, setVideoPoints] = useState<number[]>([0, 0, 0])
  const [showVideoPlayer, setShowVideoPlayer] = useState(false)
  const [videoCompleted, setVideoCompleted] = useState(false)
  const [hasStartedWatching, setHasStartedWatching] = useState(false)
  const [showPointsPopup, setShowPointsPopup] = useState(false)
  const [earnedPoints, setEarnedPoints] = useState(0)

  const iframeRef = useRef<HTMLIFrameElement>(null)
  const watchTimeRef = useRef(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const currentVideo = VIDEOS[currentVideoIndex]

  useEffect(() => {
    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const handlePlayClick = () => {
    setShowVideoPlayer(true)
    setIsPlaying(true)
    setHasStartedWatching(true)
    setWatchedTime(0)
    watchTimeRef.current = 0

    // Start tracking watch time
    intervalRef.current = setInterval(() => {
      if (isPlaying) {
        watchTimeRef.current += 1
        setWatchedTime(watchTimeRef.current)

        // Check if video is completed (watched for full duration)
        if (watchTimeRef.current >= currentVideo.duration) {
          setVideoCompleted(true)
          setIsPlaying(false)
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
          }

          // Award points for completing the video
          const newPoints = [...videoPoints]
          newPoints[currentVideoIndex] = 2
          setVideoPoints(newPoints)
          const newTotal = newPoints.reduce((sum, points) => sum + points, 0)
          setTotalPoints(newTotal)

          // Show points popup
          setEarnedPoints(2)
          setShowPointsPopup(true)

          // Save points to localStorage immediately
          const today = new Date().toISOString().split("T")[0]
          const existingData = JSON.parse(localStorage.getItem("dailyPoints") || "{}")
          existingData[today] = (existingData[today] || 0) + 2
          localStorage.setItem("dailyPoints", JSON.stringify(existingData))
        }
      }
    }, 1000)
  }

  const handleNextVideo = () => {
    if (currentVideoIndex < VIDEOS.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1)
      setShowVideoPlayer(false)
      setIsPlaying(false)
      setVideoCompleted(false)
      setHasStartedWatching(false)
      setWatchedTime(0)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    } else {
      // All videos completed, finish challenge
      const finalPoints = videoPoints.reduce((sum, points) => sum + points, 0)
      onSuccess(finalPoints)
    }
  }

  const handleSkipVideo = () => {
    // No points awarded for skipping
    const newPoints = [...videoPoints]
    newPoints[currentVideoIndex] = 0
    setVideoPoints(newPoints)
    setTotalPoints(newPoints.reduce((sum, points) => sum + points, 0))
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    handleNextVideo()
  }

  const handleGoBack = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    onGoBack()
  }

  const progressPercentage = (watchedTime / currentVideo.duration) * 100

  const handlePointsPopupClose = () => {
    setShowPointsPopup(false)
    // Auto-advance to next video after 2 seconds
    setTimeout(() => {
      if (currentVideoIndex < VIDEOS.length - 1) {
        setCurrentVideoIndex(currentVideoIndex + 1)
        setShowVideoPlayer(false)
        setIsPlaying(false)
        setVideoCompleted(false)
        setHasStartedWatching(false)
        setWatchedTime(0)
      } else {
        // All videos completed, finish challenge
        const finalPoints = videoPoints.reduce((sum, points) => sum + points, 0)
        onSuccess(finalPoints)
      }
    }, 2000)
  }

  // Auto-close popup after 3 seconds
  useEffect(() => {
    if (showPointsPopup) {
      const timer = setTimeout(() => {
        handlePointsPopupClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showPointsPopup])

  // Points Earned Popup
  if (showPointsPopup) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Congratulations!</h2>
          <p className="text-lg text-gray-700 mb-4">You earned {earnedPoints} points!</p>
          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-green-700">Video {currentVideoIndex + 1} completed successfully</p>
            <p className="text-xs text-green-600 mt-1">
              {currentVideoIndex < VIDEOS.length - 1 ? "Proceeding to next video..." : "Challenge completed!"}
            </p>
          </div>
          <button
            onClick={handlePointsPopupClose}
            className="px-6 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700"
          >
            Continue
          </button>
        </div>
      </div>
    )
  }

  if (!showVideoPlayer) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-95 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 text-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tempted? Good. This is for you.</h2>
            <p className="text-lg text-gray-700 mb-2">Here is something special for you, open it 😏</p>
            <p className="text-sm text-gray-500 mb-4">
              Video {currentVideoIndex + 1} of {VIDEOS.length} • Watch completely to earn 2 points
            </p>

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-2">Point System:</h3>
              <ul className="text-sm space-y-1">
                <li>• Watch entire video = 2 points</li>
                <li>• Skip or go back = 0 points</li>
                <li>• Fast-forwarding detected = 0 points</li>
                <li>• Current total: {totalPoints} points</li>
              </ul>
            </div>

            <div className="mb-6">
              <h4 className="font-medium mb-2">Video Progress:</h4>
              <div className="flex justify-center gap-2">
                {VIDEOS.map((_, index) => (
                  <div
                    key={index}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium ${
                      index < currentVideoIndex
                        ? videoPoints[index] > 0
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                        : index === currentVideoIndex
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {index < currentVideoIndex ? (videoPoints[index] > 0 ? "✓" : "✗") : index + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <button
              onClick={handlePlayClick}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-full text-lg font-medium shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
              </div>
              PLAY
            </button>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={handleSkipVideo}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-400"
            >
              Skip Video (0 points)
            </button>
            <button
              onClick={handleGoBack}
              className="px-6 py-2 bg-red-300 text-red-700 rounded-md font-medium hover:bg-red-400"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="bg-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold">
            Video {currentVideoIndex + 1} of {VIDEOS.length}
          </h3>
          <div className="text-sm text-gray-600">
            {Math.floor(watchedTime / 60)}:{(watchedTime % 60).toString().padStart(2, "0")} /{" "}
            {Math.floor(currentVideo.duration / 60)}:{(currentVideo.duration % 60).toString().padStart(2, "0")}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm font-medium">Points: {totalPoints}</div>
          <button onClick={handleGoBack} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Exit (Lose Progress)
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-black">
        <div className="w-full max-w-4xl aspect-video">
          <iframe
            ref={iframeRef}
            src={`${currentVideo.url}?autoplay=1&controls=0&disablekb=1&fs=0&modestbranding=1&rel=0`}
            className="w-full h-full"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen={false}
            title={currentVideo.title}
          />
        </div>
      </div>

      <div className="bg-white p-4">
        <div className="mb-2">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          {videoCompleted ? (
            <div className="text-center">
              <p className="text-sm text-green-600 mb-2 font-medium">Video completed! +2 points earned</p>
              <p className="text-xs text-gray-500">
                {currentVideoIndex < VIDEOS.length - 1 ? "Proceeding to next video..." : "Challenge completed!"}
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Watch the complete video to earn points</p>
              <button
                onClick={handleSkipVideo}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-400"
              >
                Skip (0 points)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
