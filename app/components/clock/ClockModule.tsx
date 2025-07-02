import { useEffect, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import HomeButton from '../ui/HomeButton'
import ModuleHeader from '../ui/ModuleHeader'
import PhoneFrame from '../ui/PhoneFrame'
import RealClock from './RealClock'
import Stopwatch from './Stopwatch'
import Timer from './Timer'

interface ClockModuleProps {
  onGoHome: () => void
}

export default function ClockModule({ onGoHome }: ClockModuleProps) {
  const [puzzleSolved, setPuzzleSolved] = useState(false)
  
  // Stopwatch state
  const [stopwatchTime, setStopwatchTime] = useState(0)
  const [stopwatchActive, setStopwatchActive] = useState(false)
  const [stopwatchLaps, setStopwatchLaps] = useState<number[]>([])
  const [stopwatchInterval, setStopwatchInterval] = useState<number | null>(null)

  // Timer state
  const [timerTimeLeft, setTimerTimeLeft] = useState(0)
  const [timerTotalTime, setTimerTotalTime] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const [timerInterval, setTimerInterval] = useState<number | null>(null)

  // Check for puzzle completion
  useEffect(() => {
    if (stopwatchTime >= 30000 && !puzzleSolved) { // 30 seconds
      setPuzzleSolved(true)
    }
  }, [stopwatchTime, puzzleSolved])

  // Stopwatch functions
  const toggleStopwatch = () => {
    if (stopwatchActive) {
      // Stop
      if (stopwatchInterval) {
        clearInterval(stopwatchInterval)
        setStopwatchInterval(null)
      }
      setStopwatchActive(false)
    } else {
      // Start
      const interval = setInterval(() => {
        setStopwatchTime(prev => prev + 10)
      }, 10)
      setStopwatchInterval(interval)
      setStopwatchActive(true)
    }
  }

  const resetStopwatch = () => {
    if (stopwatchInterval) {
      clearInterval(stopwatchInterval)
      setStopwatchInterval(null)
    }
    setStopwatchTime(0)
    setStopwatchActive(false)
    setStopwatchLaps([])
  }

  const lapStopwatch = () => {
    if (stopwatchActive) {
      setStopwatchLaps(prev => [...prev, stopwatchTime])
    }
  }

  // Timer functions
  const setTimerTime = (minutes: number, seconds: number) => {
    const totalMs = (minutes * 60 + seconds) * 1000
    setTimerTimeLeft(totalMs)
    setTimerTotalTime(totalMs)
    setTimerActive(false)
    if (timerInterval) {
      clearInterval(timerInterval)
      setTimerInterval(null)
    }
  }

  const toggleTimer = () => {
    if (timerActive) {
      // Pause
      if (timerInterval) {
        clearInterval(timerInterval)
        setTimerInterval(null)
      }
      setTimerActive(false)
    } else {
      // Start
      if (timerTimeLeft > 0) {
        const interval = setInterval(() => {
          setTimerTimeLeft(prev => {
            if (prev <= 10) {
              clearInterval(interval)
              setTimerInterval(null)
              setTimerActive(false)
              return 0
            }
            return prev - 10
          })
        }, 10)
        setTimerInterval(interval)
        setTimerActive(true)
      }
    }
  }

  const resetTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval)
      setTimerInterval(null)
    }
    setTimerTimeLeft(timerTotalTime)
    setTimerActive(false)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stopwatchInterval) clearInterval(stopwatchInterval)
      if (timerInterval) clearInterval(timerInterval)
    }
  }, [stopwatchInterval, timerInterval])

  return (
    <PhoneFrame>
      <View className="flex-1 bg-black">
        <View className="p-4">
          <ModuleHeader name="CLOCK" color="yellow" />
          
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="space-y-4">
              {/* Puzzle Status */}
              {!puzzleSolved && (
                <View className="bg-gray-900 p-4 rounded-lg">
                  <Text className="text-gray-400 text-sm font-mono mb-2">PUZZLE</Text>
                  <Text className="text-yellow-400 text-lg font-mono mb-2">
                    Run the stopwatch for 30 seconds to complete the challenge
                  </Text>
                  <Text className="text-gray-500 text-sm font-mono">
                    Progress: {Math.floor(stopwatchTime / 1000)}/30 seconds
                  </Text>
                </View>
              )}

              {puzzleSolved && (
                <View className="bg-green-900 p-4 rounded-lg">
                  <Text className="text-green-400 text-sm font-mono mb-2">CHALLENGE COMPLETED!</Text>
                  <Text className="text-green-400 text-lg font-mono">
                    Great job! You've completed the time challenge! 🎉
                  </Text>
                </View>
              )}

              {/* Real Clock */}
              <RealClock />
              
              {/* Stopwatch */}
              <Stopwatch
                isActive={stopwatchActive}
                onToggle={toggleStopwatch}
                onReset={resetStopwatch}
                onLap={lapStopwatch}
                time={stopwatchTime}
                laps={stopwatchLaps}
              />
              
              {/* Timer */}
              <Timer
                isActive={timerActive}
                onToggle={toggleTimer}
                onReset={resetTimer}
                onSetTime={setTimerTime}
                timeLeft={timerTimeLeft}
                totalTime={timerTotalTime}
              />
            </View>
          </ScrollView>
        </View>
        <HomeButton active={true} onPress={onGoHome} />
      </View>
    </PhoneFrame>
  )
} 