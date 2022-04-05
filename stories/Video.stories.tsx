import { Video } from "../src"

export default { title: 'Video' }

export const Basic = () => {
  return(
    <Video
    sources={[
      {
        source: "https://kodepanda.com/assets/480p.mp4",
        type: "video/mp4",
        resolution: "480"
      },
      {
        source: "https://kodepanda.com/assets/720p.mp4",
        type: "video/mp4",
        resolution: "720"
      },
      {
        source: "https://kodepanda.com/assets/1080p.mp4",
        type: "video/mp4",
        resolution: "1080",
        default: true
      }
    ]}
    subtitles={[
      {
        label: "English",
        lang: "en",
        source: "https://kodepanda.com/assets/sintel_en.vtt",
        default: true
      }, {
        label: "Bahasa Indonesia",
        lang: "id",
        source: "https://kodepanda.com/assets/sintel_id.vtt",
        default: false
      }
    ]}
    previews={[
      {
        source: "https://kodepanda.com/assets/sintel-thumbnail/5s.png",
        time: "0:05"
      },
      {
        source: "https://kodepanda.com/assets/sintel-thumbnail/10s.png",
        time: "0:10"
      },
      {
        source: "https://kodepanda.com/assets/sintel-thumbnail/15s.png",
        time: "0:15"
      },
      {
        source: "https://kodepanda.com/assets/sintel-thumbnail/20s.png",
        time: "0:20"
      },
      {
        source: "https://kodepanda.com/assets/sintel-thumbnail/25s.png",
        time: "0:25"
      },
      {
        source: "https://kodepanda.com/assets/sintel-thumbnail/30s.png",
        time: "0:30"
      },
      {
        source: "https://kodepanda.com/assets/sintel-thumbnail/35s.png",
        time: "0:35"
      },
      {
        source: "https://kodepanda.com/assets/sintel-thumbnail/40s.png",
        time: "0:40"
      },
      {
        source: "https://kodepanda.com/assets/sintel-thumbnail/45s.png",
        time: "0:45"
      },
      {
        source: "https://kodepanda.com/assets/sintel-thumbnail/50s.png",
        time: "0:50"
      }
    ]}
    poster="https://kodepanda.com/assets/cover.png" />
  )
}

export const Color = () => {
  return(
    <Video
    color="red"
    colorContrast={600}
    sources={[
      {
        source: "https://kodepanda.com/assets/720p.mp4",
        type: "video/mp4",
        resolution: "720"
      },
    ]}
    poster="https://kodepanda.com/assets/cover.png" />
  )
}

export const NoSubtitle = () => {
  return(
    <Video
    sources={[
      {
        source: "https://kodepanda.com/assets/720p.mp4",
        type: "video/mp4",
        resolution: "720"
      },
    ]}
    poster="https://kodepanda.com/assets/cover.png" />
  )
}

export const Error = () => {
  return(
    <Video
    sources={[
      {
        source: "./aaa.mp4",
        type: "video/mp4",
        resolution: "720"
      }
    ]}
    poster="./aaa.png" />
  )
}
