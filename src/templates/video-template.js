import React, { useState, useEffect } from "react"
import { navigate } from "gatsby"
import { Helmet } from "react-helmet"
import YouTube from "react-youtube"
import ShareModal from "../components/ShareModal"
import ChannelSelector from "../components/ChannelSelector"
import logo from "../images/logo.png"
import PlayerControls from "../components/PlayerControls"
import { sample } from "lodash"
import "tailwindcss/tailwind.css"

const VideoTemplate = ({ pageContext }) => {
  const { playlistId, videoId, playlists } = pageContext
  const playlist = playlists.find(playlist => playlist.id === playlistId)
  const video = playlist.videos.find(video => video.id === videoId)
  const currentVideoIndex = playlist.videos.findIndex(video => video.id === videoId)

  const [controls, setControls] = useState()
  const [isPlaying, setIsPlaying] = useState(true)
  const [sidePannelShowing, setSidePannelShowing] = useState(true)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [isMuted, setIsMuted] = useState(true)

  useEffect(() => {
    controls && (isMuted ? controls.mute() : controls.unMute())
  }, [isMuted])

  const navigateToNextVideo = () => {
    navigate(`/${playlistId}/${playlist.videos[(currentVideoIndex + 1) % playlist.videos.length].id}`)
  }

  const navigateToPreviousVideo = () => {
    navigate(
      `/${playlistId}/${playlist.videos[currentVideoIndex === 0 ? playlist.videos.length : currentVideoIndex - 1].id}`
    )
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{video.title}</title>
        <meta name="og:title" content={video.title} />
        <meta name="og:image" content={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} />
        <meta name="twitter:title" content={video.title} />
        <meta name="twitter:image" content={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} />

        {/* privy widget */}
        <script type="text/javascript">{`var _d_site = _d_site || '04E7E23B6DE4DEC6E6B4AA43';`}</script>
        <script src="https://widget.privy.com/assets/widget.js"></script>
      </Helmet>
      <ShareModal
        isOpen={shareModalOpen}
        title={video.title}
        author={video.author}
        onClose={() => setShareModalOpen(false)}
      />
      <div className="absolute z-0 flex w-screen h-screen text-center bg-near-black lg:hidden">
        <p className="w-11/12 max-w-xl m-auto text-xl text-white">
          Unfortunately, Marketing TV isn't optimized for mobile viewing just yet. Please revisit from a desktop
          browser.
        </p>
      </div>
      <div className="hidden w-screen lg:flex">
        {sidePannelShowing && (
          <div className="flex-shrink-0 h-screen overflow-auto w-480 bg-near-black">
            <div className="fixed z-10 flex items-center bg-near-black w-480">
              <img className="w-11/12 m-auto my-5" src={logo} alt="logo" />
            </div>
            <ChannelSelector
              channels={playlists}
              active={playlist}
              onChannelSelected={playlist => navigate(`/${playlist.id}/${sample(playlist.videos).id}`)}
            />
          </div>
        )}
        <div id="video-player" className="relative flex-grow flex-shrink h-screen">
          <div className="absolute w-full h-24 bg-black">
            {isMuted && (
              <button
                className="flex items-center w-48 h-12 m-5 font-bold bg-white rounded-md justify-evenly"
                onClick={() => setIsMuted(false)}
              >
                <svg viewBox="0 0 24 24" height="24" width="24">
                  <path d="M3.63 3.63a.996.996 0 000 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.55-.77 2.22-1.31l1.34 1.34a.996.996 0 101.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-3.83-2.4-7.11-5.78-8.4-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12zm-8.71-6.29l-.17.17L12 7.76V6.41c0-.89-1.08-1.33-1.71-.7zM16.5 12A4.5 4.5 0 0014 7.97v1.79l2.48 2.48c.01-.08.02-.16.02-.24z" />
                </svg>
                Click to unmute
              </button>
            )}
          </div>
          <YouTube
            key={videoId}
            containerClassName="w-full h-full"
            className="w-full h-full"
            videoId={videoId}
            opts={{ playerVars: { autoplay: 1, mute: 1, controls: 0 } }}
            onEnd={navigateToNextVideo}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onReady={({ target }) => setControls(target)}
          />
          <PlayerControls
            controls={controls}
            title={video.title}
            author={video.author}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            isPlaying={isPlaying}
            onPrev={navigateToPreviousVideo}
            onNext={navigateToNextVideo}
            sidePannelShowing={sidePannelShowing}
            setSidePannelShowing={setSidePannelShowing}
            shareModalOpen={shareModalOpen}
            setShareModalOpen={setShareModalOpen}
          />
        </div>
      </div>
    </>
  )
}

export default VideoTemplate
