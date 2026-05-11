'use client'

import {
  BackwardIcon,
  ForwardIcon,
  PauseIcon,
  PlayIcon,
  QueueListIcon,
  SpeakerWaveIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid'
import Image from './Image'
import { useMusicPlayer } from './MusicPlayerProvider'

export default function FloatingMusicPlayer() {
  const {
    currentTime,
    currentTrack,
    duration,
    isExpanded,
    isPlaying,
    playlist,
    playNext,
    playPrev,
    playTrackAtIndex,
    safeTrackIndex,
    seekTo,
    setIsExpanded,
    setVolume,
    togglePlay,
    volume,
  } = useMusicPlayer()

  if (!currentTrack) {
    return null
  }

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextTime = (Number(event.target.value) / 100) * duration
    seekTo(nextTime)
  }

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(event.target.value) / 100)
  }

  const formatTime = (time: number) => {
    if (!Number.isFinite(time) || time <= 0) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-60 sm:right-6 sm:bottom-6">
      <div className="pointer-events-auto w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-white/70 bg-white/95 shadow-[0_16px_40px_rgba(15,23,42,0.12)] backdrop-blur dark:border-gray-800 dark:bg-gray-950/95">
        <div className="px-3 pt-3 pb-2 sm:px-4 sm:pt-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary-100 relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl dark:bg-gray-800">
              {currentTrack.cover ? (
                <Image
                  src={currentTrack.cover}
                  alt={currentTrack.title}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              ) : (
                <div className="bg-primary-100 text-primary-700 dark:text-primary-200 flex h-full w-full items-center justify-center dark:bg-gray-800">
                  <SpeakerWaveIcon className="h-5 w-5" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-950 dark:text-white">
                {currentTrack.title}
              </p>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                {currentTrack.artist}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition"
              aria-label={isExpanded ? '收起播放列表' : '展开播放列表'}
            >
              {isExpanded ? <XMarkIcon className="h-4 w-4" /> : <QueueListIcon className="h-4 w-4" />}
            </button>
          </div>

          <div className="mt-3">
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={progress}
              onChange={handleSeek}
              className="bg-gray-200 accent-gray-900 dark:accent-white h-1 w-full cursor-pointer rounded-full dark:bg-gray-800"
              aria-label="播放进度"
            />
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={playPrev}
              className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white flex h-9 w-9 items-center justify-center rounded-full transition disabled:opacity-40"
              disabled={playlist.length <= 1}
              aria-label="上一首"
            >
              <BackwardIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => void togglePlay()}
              className="bg-gray-950 text-white dark:bg-white dark:text-gray-950 flex h-10 w-10 items-center justify-center rounded-full transition"
              aria-label={isPlaying ? '暂停' : '播放'}
            >
              {isPlaying ? (
                <PauseIcon className="h-4 w-4" />
              ) : (
                <PlayIcon className="h-4 w-4 pl-0.5" />
              )}
            </button>
            <button
              type="button"
              onClick={playNext}
              className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white flex h-9 w-9 items-center justify-center rounded-full transition disabled:opacity-40"
              disabled={playlist.length <= 1}
              aria-label="下一首"
            >
              <ForwardIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="border-t border-gray-200/80 px-2 pb-2 dark:border-gray-800">
            <div className="px-2 pt-2 pb-1 text-[11px] font-medium tracking-[0.14em] text-gray-400 uppercase dark:text-gray-500">
              Up Next
            </div>
            <div className="max-h-64 space-y-1 overflow-y-auto pb-1">
              {playlist.map((track, index) => {
                const isActive = index === safeTrackIndex

                return (
                  <button
                    key={`${track.title}-${track.artist}-${index}`}
                    type="button"
                    onClick={() => playTrackAtIndex(index)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left transition ${
                      isActive
                        ? 'bg-gray-100 text-gray-950 dark:bg-gray-900 dark:text-white'
                        : 'text-gray-600 hover:bg-gray-100/80 dark:text-gray-300 dark:hover:bg-gray-900/80'
                    }`}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <div className="bg-primary-100 relative h-10 w-10 shrink-0 overflow-hidden rounded-xl dark:bg-gray-800">
                        {track.cover ? (
                          <Image
                            src={track.cover}
                            alt={track.title}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="bg-primary-100 text-primary-700 dark:text-primary-200 flex h-full w-full items-center justify-center dark:bg-gray-800">
                            <SpeakerWaveIcon className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{track.title}</p>
                        <p className="truncate text-xs text-gray-400 dark:text-gray-500">
                          {track.artist}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 text-[11px] text-gray-400 dark:text-gray-500">
                      {isActive ? (isPlaying ? 'Playing' : 'Paused') : index + 1}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="px-2 pt-1 pb-2">
              <div className="flex items-center gap-2 text-[11px] text-gray-400 dark:text-gray-500">
                <SpeakerWaveIcon className="h-3.5 w-3.5 shrink-0" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={Math.round(volume * 100)}
                  onChange={handleVolumeChange}
                  className="bg-gray-200 accent-gray-700 dark:accent-gray-300 h-1 w-full cursor-pointer rounded-full dark:bg-gray-800"
                  aria-label="音量"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
