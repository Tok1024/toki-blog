'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import Image from './Image'

interface AudioPlayerProps {
  src: string
  title?: string
  artist?: string
  cover?: string
}

export default function AudioPlayer({
  src,
  title = '未知标题',
  artist = '未知艺术家',
  cover,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isExpanded, setIsExpanded] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const setAudioData = () => {
      console.log('音频时长:', audio.duration)
      setDuration(audio.duration || 0)
      setCurrentTime(audio.currentTime || 0)
    }

    const setAudioTime = () => setCurrentTime(audio.currentTime || 0)

    audio.addEventListener('loadedmetadata', setAudioData)
    audio.addEventListener('timeupdate', setAudioTime)
    audio.addEventListener('canplay', setAudioData)

    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData)
      audio.removeEventListener('timeupdate', setAudioTime)
      audio.removeEventListener('canplay', setAudioData)
    }
  }, [src])

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      try {
        await audio.play()
        setIsPlaying(true)
      } catch (error) {
        console.error('播放失败:', error)
      }
    }
  }

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = (Number(e.target.value) / 100) * (duration || 0)
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value) / 100
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0
  const primaryColor = 'var(--color-primary-500)'
  const primaryTint = 'var(--color-primary-100)'

  return (
    <div className="glass-card via-primary-50/60 ring-primary-100/70 my-8 w-full rounded-2xl bg-gradient-to-r from-white/85 to-white/85 shadow-xl dark:from-gray-900 dark:via-gray-900/60 dark:to-gray-900">
      <audio ref={audioRef} src={src} preload="metadata">
        <track kind="captions" />
      </audio>

      <div className="flex items-center gap-4 p-4">
        {cover ? (
          <div className="flex-shrink-0">
            <Image
              src={cover}
              alt={title}
              width={64}
              height={64}
              className="h-16 w-16 rounded-md object-cover"
            />
          </div>
        ) : (
          <div className="from-primary-500 to-primary-400 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br text-white shadow-inner">
            <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.803L4.766 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.766l3.617-2.803a1 1 0 011.617.076zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="text-primary-900 dark:text-primary-100 truncate font-medium">{title}</p>
          <p className="text-primary-700/80 dark:text-primary-100/80 truncate text-sm">{artist}</p>
        </div>

        <button
          onClick={togglePlay}
          className="bg-primary-600 ring-primary-200 hover:bg-primary-700 focus:ring-primary-300 dark:bg-primary-500 dark:hover:bg-primary-400 dark:ring-primary-900/40 dark:focus:ring-primary-700 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-white ring-2 transition focus:ring-4 focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-gray-900"
          aria-label={isPlaying ? '暂停' : '播放'}
        >
          {isPlaying ? (
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>

      <div className="px-4 pb-4">
        <div className="text-primary-700/80 dark:text-primary-100/70 mb-2 flex items-center justify-between text-xs">
          <span>{formatTime(currentTime)}</span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary-800 hover:text-primary-900 dark:text-primary-100 flex items-center gap-1 dark:hover:text-white"
          >
            {isExpanded ? '收起' : '展开'}
            {isExpanded ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </button>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="relative h-2">
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progressPercentage}
            onChange={handleProgressChange}
            className="absolute inset-0 h-2 w-full cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${primaryColor} 0%, ${primaryColor} ${progressPercentage}%, rgba(255,255,255,0.35) ${progressPercentage}%, rgba(255,255,255,0.35) 100%)`,
            }}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="border-primary-100/60 dark:border-primary-900/40 border-t px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-primary-800 dark:text-primary-100 text-sm">🔊</span>
            <input
              type="range"
              min="0"
              max="100"
              value={volume * 100}
              onChange={handleVolumeChange}
              className="bg-primary-50/60 h-2 w-32 cursor-pointer appearance-none rounded-lg dark:bg-white/10"
              style={{
                background: `linear-gradient(to right, ${primaryColor} 0%, ${primaryColor} ${volume * 100}%, ${primaryTint} ${volume * 100}%, ${primaryTint} 100%)`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
