# 音频播放器使用示例

## 基础用法

在文章的MDX文件中，你可以直接使用 `<AudioPlayer>` 组件：

```mdx
<AudioPlayer
  src="/audio/sample.mp3"
  title="示例歌曲"
  artist="示例艺术家"
  cover="/images/cover.jpg"
/>
```

## 参数说明

| 参数 | 必需 | 类型 | 默认值 | 说明 |
|------|------|------|--------|------|
| `src` | ✅ | string | - | 音频文件URL或路径 |
| `title` | ❌ | string | "未知标题" | 歌曲标题 |
| `artist` | ❌ | string | "未知艺术家" | 艺术家名称 |
| `cover` | ❌ | string | - | 封面图片URL |
| `autoPlay` | ❌ | boolean | false | 是否自动播放 |

## 示例1：基本播放器

<AudioPlayer
  src="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
  title="优雅的钢琴曲"
  artist="张三"
/>

## 示例2：带封面的播放器

<AudioPlayer
  src="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
  title="夜空中最亮的星"
  artist="逃跑计划"
  cover="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80"
/>

## 示例3：自动播放播放器

<AudioPlayer
  src="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
  title="背景音乐"
  artist="背景音乐库"
  autoPlay={false}
/>

## 音频文件位置

将音频文件放在 `public/audio/` 目录下，例如：
- `public/audio/music1.mp3`
- `public/audio/music2.mp3`

然后在MDX中引用：
```mdx
<AudioPlayer
  src="/audio/music1.mp3"
  title="我的音乐"
/>
```

## 支持的音频格式

- MP3
- WAV
- OGG
- M4A
- FLAC

## 注意事项

1. **浏览器政策**：大多数浏览器不允许音频自动播放，需要用户交互才能播放
2. **文件大小**：建议音频文件小于5MB，以获得更好的加载速度
3. **版权**：确保你有使用音频文件的合法权利
4. **响应式**：播放器已适配移动端和桌面端
