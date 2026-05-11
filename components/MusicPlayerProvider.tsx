'use client'

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { MusicTrack } from '@/data/musicPlaylist'

interface MusicPlayerContextValue {
  currentTime: number
  currentTrack: MusicTrack | null
  duration: number
  isExpanded: boolean
  isPlaying: boolean
  playlist: MusicTrack[]
  safeTrackIndex: number
  seekTo: (time: number) => void
  setCurrentTime: (time: number) => void
  setIsExpanded: (expanded: boolean) => void
  setVolume: (volume: number) => void
  togglePlay: () => Promise<void>
  playTrack: (track: MusicTrack) => void
  playTrackAtIndex: (index: number) => void
  playNext: () => void
  playPrev: () => void
  volume: number
}

const STORAGE_KEYS = {
  expanded: 'toki-music-player-expanded',
  trackIndex: 'toki-music-player-track-index',
  volume: 'toki-music-player-volume',
} as const

const MusicPlayerContext = createContext<MusicPlayerContextValue | null>(null)

export function MusicPlayerProvider({
  children,
  initialPlaylist,
}: {
  children: ReactNode
  initialPlaylist: MusicTrack[]
}) {
  const [playlist, setPlaylist] = useState<MusicTrack[]>(initialPlaylist)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.72)
  const audioRef = useRef<HTMLAudioElement>(null)
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || process.env.BASE_PATH || ''

  const safeTrackIndex =
    playlist.length === 0 ? 0 : Math.min(currentTrackIndex, playlist.length - 1)
  const currentTrack = playlist[safeTrackIndex] ?? null

  const playNext = useCallback(() => {
    if (playlist.length <= 1) return
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length)
  }, [playlist.length])

  const playPrev = useCallback(() => {
    if (playlist.length <= 1) return
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length)
  }, [playlist.length])

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return

    if (isPlaying) {
      audio.pause()
      return
    }

    try {
      await audio.play()
      setIsPlaying(true)
    } catch {
      setIsPlaying(false)
    }
  }, [currentTrack, isPlaying])

  const playTrackAtIndex = useCallback(
    (index: number) => {
      if (index < 0 || index >= playlist.length) return
      setCurrentTrackIndex(index)
      setIsPlaying(true)
      setIsExpanded(true)
    },
    [playlist.length]
  )

  const playTrack = useCallback((track: MusicTrack) => {
    setPlaylist((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.src === track.src && item.title === track.title && item.artist === track.artist
      )

      if (existingIndex >= 0) {
        setCurrentTrackIndex(existingIndex)
        return prev
      }

      const nextPlaylist = [...prev, track]
      setCurrentTrackIndex(nextPlaylist.length - 1)
      return nextPlaylist
    })

    setIsExpanded(true)
    setIsPlaying(true)
  }, [])

  const seekTo = useCallback((time: number) => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = time
    setCurrentTime(time)
  }, [])

  useEffect(() => {
    const savedExpanded = window.localStorage.getItem(STORAGE_KEYS.expanded)
    const savedTrackIndex = window.localStorage.getItem(STORAGE_KEYS.trackIndex)
    const savedVolume = window.localStorage.getItem(STORAGE_KEYS.volume)

    if (savedExpanded === 'true') {
      setIsExpanded(true)
    }

    if (savedTrackIndex) {
      const parsedIndex = Number(savedTrackIndex)
      if (!Number.isNaN(parsedIndex) && parsedIndex >= 0 && parsedIndex < initialPlaylist.length) {
        setCurrentTrackIndex(parsedIndex)
      }
    }

    if (savedVolume) {
      const parsedVolume = Number(savedVolume)
      if (!Number.isNaN(parsedVolume) && parsedVolume >= 0 && parsedVolume <= 1) {
        setVolume(parsedVolume)
      }
    }
  }, [initialPlaylist.length])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.expanded, String(isExpanded))
  }, [isExpanded])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.trackIndex, String(safeTrackIndex))
  }, [safeTrackIndex])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.volume, String(volume))
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0)
      setCurrentTime(audio.currentTime || 0)
    }
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime || 0)
    const handleEnded = () => playNext()
    const handlePause = () => setIsPlaying(false)
    const handlePlay = () => setIsPlaying(true)

    audio.volume = volume
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('play', handlePlay)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('play', handlePlay)
    }
  }, [playNext, volume])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return

    audio.load()
    setCurrentTime(0)
    setDuration(0)

    if (!isPlaying) return

    void audio.play().catch(() => {
      setIsPlaying(false)
    })
  }, [currentTrack, isPlaying])

  const value = useMemo(
    () => ({
      currentTime,
      currentTrack,
      duration,
      isExpanded,
      isPlaying,
      playlist,
      safeTrackIndex,
      setCurrentTime,
      setIsExpanded,
      setVolume,
      seekTo,
      togglePlay,
      playTrack,
      playTrackAtIndex,
      playNext,
      playPrev,
      volume,
    }),
    [
      currentTime,
      currentTrack,
      duration,
      isExpanded,
      isPlaying,
      playlist,
      safeTrackIndex,
      seekTo,
      togglePlay,
      playTrack,
      playTrackAtIndex,
      playNext,
      playPrev,
      volume,
    ]
  )

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
      <audio ref={audioRef} preload="metadata">
        {currentTrack ? <source src={`${basePath}${currentTrack.src}`} /> : null}
        <track kind="captions" />
      </audio>
    </MusicPlayerContext.Provider>
  )
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext)

  if (!context) {
    throw new Error('useMusicPlayer must be used within MusicPlayerProvider')
  }

  return context
}
