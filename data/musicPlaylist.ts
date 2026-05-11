export type MusicTrack = {
  title: string
  artist: string
  src: string
  cover?: string
}

export const musicPlaylist: MusicTrack[] = [
  {
    title: '有心论',
    artist: 'Radwimps',
    src: '/static/audio/yxl.mp3',
    cover: '/static/images/covers/yxl.jpg',
  },
  {
    title: 'Never Meant',
    artist: 'American football',
    src: '/static/audio/never-meant.mp3',
    cover: '/static/images/covers/never-meant.png',
  },
  {
    title: 'The One With The Tambourine',
    artist: 'American football',
    src: '/static/audio/tambourine.mp3',
    cover: '/static/images/covers/american-football.png',
  },
  {
    title: 'Today',
    artist: 'The Smashing Pumpkins',
    src: '/static/audio/today.mp3',
    cover: '/static/images/covers/siamese-dream.jpg',
  },
]
