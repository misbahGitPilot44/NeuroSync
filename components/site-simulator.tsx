"use client"

interface SiteSimulatorProps {
  sites: string[]
  onSiteClick: (site: string) => void
  currentSite: string | null
}

export function SiteSimulator({ sites, onSiteClick, currentSite }: SiteSimulatorProps) {
  const getSiteColor = (site: string) => {
    if (site.includes("instagram")) return "bg-gradient-to-r from-purple-500 to-pink-500"
    if (site.includes("youtube")) return "bg-red-600"
    if (site.includes("github")) return "bg-gray-800"
    if (site.includes("linkedin")) return "bg-blue-700"
    if (site.includes("discord")) return "bg-indigo-600"
    return "bg-gray-600"
  }

  const getSiteName = (site: string) => {
    if (site.includes("instagram")) return "Instagram"
    if (site.includes("youtube")) return "YouTube"
    if (site.includes("github")) return "GitHub"
    if (site.includes("linkedin")) return "LinkedIn"
    if (site.includes("discord")) return "Discord"
    return new URL(site).hostname
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Try accessing these sites:</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sites.map((site) => (
          <button
            key={site}
            onClick={() => onSiteClick(site)}
            className={`${getSiteColor(site)} text-white p-4 rounded-lg hover:opacity-90 transition-opacity font-medium`}
          >
            {getSiteName(site)}
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-600 mt-4">
        Click any site above to trigger the writing challenge (if enabled in settings).
      </p>
    </div>
  )
}
