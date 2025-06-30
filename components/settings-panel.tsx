"use client"

import type React from "react"
import { PointsDashboard } from "./points-dashboard"
import { useState } from "react"
import type { Settings } from "@/types/settings"
import { GoalManager } from "./goal-manager"
import { ProgressDashboard } from "./progress-dashboard"

interface SettingsPanelProps {
  settings: Settings
  onSettingsChange: (settings: Settings) => void
}

export function SettingsPanel({ settings, onSettingsChange }: SettingsPanelProps) {
  const [newSiteUrl, setNewSiteUrl] = useState("")
  const [newSiteDelay, setNewSiteDelay] = useState(30)
  const [activeTab, setActiveTab] = useState("general")

  const handleToggleEnabled = () => {
    onSettingsChange({
      ...settings,
      enabled: !settings.enabled,
    })
  }

  const handleMinDelayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    onSettingsChange({
      ...settings,
      minDelay: value,
    })
  }

  const handleMaxDelayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    onSettingsChange({
      ...settings,
      maxDelay: value,
    })
  }

  const handleAddSite = () => {
    if (!newSiteUrl.trim()) return

    onSettingsChange({
      ...settings,
      sites: [...settings.sites, { url: newSiteUrl, baseDelay: newSiteDelay }],
    })

    setNewSiteUrl("")
    setNewSiteDelay(30)
  }

  const handleRemoveSite = (index: number) => {
    const newSites = [...settings.sites]
    newSites.splice(index, 1)
    onSettingsChange({
      ...settings,
      sites: newSites,
    })
  }

  const handleSiteDelayChange = (index: number, delay: number) => {
    const newSites = [...settings.sites]
    newSites[index] = { ...newSites[index], baseDelay: delay }
    onSettingsChange({
      ...settings,
      sites: newSites,
    })
  }

  const handleToggleReflection = () => {
    onSettingsChange({
      ...settings,
      showReflectionPrompts: !settings.showReflectionPrompts,
    })
  }

  const handleToggleInspiration = () => {
    onSettingsChange({
      ...settings,
      showInspirationalContent: !settings.showInspirationalContent,
    })
  }

  const handleToggleGoalReminders = () => {
    onSettingsChange({
      ...settings,
      showGoalReminders: !settings.showGoalReminders,
    })
  }

  const handleGoalsChange = (goals: any) => {
    onSettingsChange({
      ...settings,
      goals,
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Settings</h2>

      <div className="mb-6 border-b">
        <div className="flex space-x-4">
          <button
            className={`pb-2 px-1 ${
              activeTab === "general"
                ? "border-b-2 border-indigo-600 text-indigo-600 font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("general")}
          >
            General
          </button>
          <button
            className={`pb-2 px-1 ${
              activeTab === "websites"
                ? "border-b-2 border-indigo-600 text-indigo-600 font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("websites")}
          >
            Websites
          </button>
          <button
            className={`pb-2 px-1 ${
              activeTab === "content"
                ? "border-b-2 border-indigo-600 text-indigo-600 font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("content")}
          >
            Content
          </button>
          <button
            className={`pb-2 px-1 ${
              activeTab === "goals"
                ? "border-b-2 border-indigo-600 text-indigo-600 font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("goals")}
          >
            Goals
          </button>
          <button
            className={`pb-2 px-1 ${
              activeTab === "progress"
                ? "border-b-2 border-indigo-600 text-indigo-600 font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("progress")}
          >
            Progress
          </button>
          <button
            className={`pb-2 px-1 ${
              activeTab === "points"
                ? "border-b-2 border-indigo-600 text-indigo-600 font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("points")}
          >
            Points
          </button>
        </div>
      </div>

      {activeTab === "general" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="font-medium">Enable Dopamine Delay</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={handleToggleEnabled}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div>
            <label className="block mb-2 font-medium">Minimum Delay (seconds)</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="5"
                max="60"
                value={settings.minDelay}
                onChange={handleMinDelayChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="w-10 text-center">{settings.minDelay}</span>
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium">Maximum Delay (seconds)</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="30"
                max="300"
                value={settings.maxDelay}
                onChange={handleMaxDelayChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="w-10 text-center">{settings.maxDelay}</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === "websites" && (
        <div>
          <h3 className="font-medium mb-3">Websites</h3>
          <div className="space-y-2 mb-4">
            {settings.sites.map((site, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="flex-1">{site.url}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="5"
                    value={site.baseDelay}
                    onChange={(e) => handleSiteDelayChange(index, Number.parseInt(e.target.value))}
                    className="w-16 p-1 border rounded"
                  />
                  <span className="text-sm text-gray-500">sec</span>
                  <button onClick={() => handleRemoveSite(index)} className="p-1 text-red-600 hover:text-red-800">
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newSiteUrl}
              onChange={(e) => setNewSiteUrl(e.target.value)}
              placeholder="example.com"
              className="flex-1 p-2 border rounded"
            />
            <input
              type="number"
              min="5"
              value={newSiteDelay}
              onChange={(e) => setNewSiteDelay(Number.parseInt(e.target.value))}
              className="w-16 p-2 border rounded"
            />
            <button onClick={handleAddSite} className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
              Add
            </button>
          </div>
        </div>
      )}

      {activeTab === "content" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Show Reflection Prompts</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showReflectionPrompts}
                onChange={handleToggleReflection}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <span>Show Inspirational Content</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showInspirationalContent}
                onChange={handleToggleInspiration}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <span>Show Goal Reminders</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showGoalReminders}
                onChange={handleToggleGoalReminders}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      )}

      {activeTab === "goals" && <GoalManager goals={settings.goals || []} onGoalsChange={handleGoalsChange} />}

      {activeTab === "progress" && <ProgressDashboard goals={settings.goals || []} />}

      {activeTab === "points" && <PointsDashboard />}
    </div>
  )
}
