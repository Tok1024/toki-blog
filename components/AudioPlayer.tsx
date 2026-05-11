'use client'

import { PlayIcon, QueueListIcon } from '@heroicons/react/24/solid'
import Image from './Image'
import { useMusicPlayer } from './MusicPlayerProvider'

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
  const { currentTrack, isPlaying, playTrack, setIsExpanded } = useMusicPlayer()

  const isCurrentTrack = currentTrack?.src === src

  return (
    <div className="glass-card border-primary-100/90 my-6 w-full overflow-hidden rounded-2xl bg-white/92 dark:border-gray-800 dark:bg-gray-900/92">
      <div className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
        {cover ? (
          <div className="shrink-0 overflow-hidden rounded-xl">
            <Image
              src={cover}
              alt={title}
              width={56}
              height={56}
              className="h-14 w-14 object-cover"
            />
          </div>
        ) : (
          <div className="bg-primary-100 text-primary-700 dark:text-primary-200 flex h-14 w-14 shrink-0 items-center justify-center rounded-xl dark:bg-gray-800">
            <QueueListIcon className="h-5 w-5" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-950 dark:text-white">{title}</p>
          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="truncate">{artist}</span>
            {isCurrentTrack ? (
              <>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <span>{isPlaying ? '正在全局播放器中播放' : '已载入全局播放器'}</span>
              </>
            ) : null}
          </div>
        </div>

        <button
          onClick={() => {
            playTrack({ src, title, artist, cover })
            setIsExpanded(true)
          }}
          className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400 inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm text-white transition"
          aria-label={`在全局播放器中播放 ${title}`}
        >
          <PlayIcon className="h-4 w-4" />
          <span>{isCurrentTrack ? '继续播放' : '加入播放'}</span>
        </button>
      </div>
    </div>
  )
}
