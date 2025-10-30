"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AppContextType {
  isOnline: boolean
  isVoiceActive: boolean
  setIsVoiceActive: (active: boolean) => void
  showNotification: (message: string, type: "success" | "error" | "info") => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(true)
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const [notification, setNotification] = useState<{ message: string; type: string } | null>(null)

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine)

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true)
      showNotification("You're back online", "success")
    }

    const handleOffline = () => {
      setIsOnline(false)
      showNotification("You're offline - All features still work!", "info")
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const showNotification = (message: string, type: "success" | "error" | "info") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  return (
    <AppContext.Provider value={{ isOnline, isVoiceActive, setIsVoiceActive, showNotification }}>
      {children}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            notification.type === "success"
              ? "bg-green-500"
              : notification.type === "error"
                ? "bg-red-500"
                : "bg-blue-500"
          } text-white`}
        >
          {notification.message}
        </div>
      )}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
