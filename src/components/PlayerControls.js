import React, { useRef, useState, useEffect } from "react"
import { throttle, clamp } from "lodash"

const PlayerControls = ({
  controls,
  onNext,
  onPrev,
  title,
  author,
  sidePannelShowing,
  setSidePannelShowing,
  isMuted,
  setIsMuted,
  setShareModalOpen,
}) => {
  const progressBar = useRef()
  const volumeSlideBar = useRef()

  const [youtubeLinkShowing, setYoutubeLinkShowing] = useState(false)
  const [volumeControlOpen, setVolumeControlOpen] = useState(false)
  const [volumeChanging, setVolumeChanging] = useState(false)
  const [volume, setVolume] = useState(0)
  useEffect(() => {
    controls && setVolume(controls.getVolume())
  }, [controls && controls.getVolume()])

  const [progressChanging, setProgressChanging] = useState(false)
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (controls && !progressChanging) {
        setProgress((controls.playerInfo.currentTime / controls.getDuration()) * 100)
      }
    }, 50)
    return () => clearTimeout(intervalId)
  })

  const [isFullscreen, setIsFullScreen] = useState(false)

  const remainingSeconds = controls ? Math.floor(controls.getDuration() - controls.playerInfo.currentTime) : 0
  const remainingMinutes = Math.floor(remainingSeconds / 60)

  const updateVolume = throttle(e => {
    if (!volumeSlideBar.current) {
      return
    }
    const newVolume = clamp(Math.round(volumeSlideBar.current.getBoundingClientRect().bottom - e.pageY) + 6, 0, 100)
    setVolume(newVolume)
    controls.setVolume(newVolume)
  }, 30)

  return (
    <>
      <div className="absolute bottom-0 w-full h-40 bg-black">
        <div className="absolute bottom-0 left-0 right-0 m-3 rounded-lg bg-gray-1000 opacity-90 text-white p-2">
          {youtubeLinkShowing && ( // youtube link
            <div className="absolute bg-submenu-gray w-60 top-4 right-4 rounded-md p-4 text-sm z-10">
              <a
                className="opacity-70 hover:opacity-100"
                href={controls.getVideoUrl()}
                target="_blank"
                rel="noreferrer"
              >
                Watch on YouTube
              </a>
            </div>
          )}
          <div className="flex justify-between">
            <div>
              <p className="font-bold p-1 h-8">GTM Tube - {title}</p>
              <p className="p-1 h-8">{author}</p>
            </div>
            <button
              className="flex w-20 mx-5 justify-around items-center opacity-70 hover:opacity-100 focus:outline-none"
              onClick={() => {
                controls.pauseVideo()
                setShareModalOpen(true)
              }}
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              Share
            </button>
          </div>
          <div className="flex p-1 items-center">
            <button className="w-10 h-10 opacity-70 hover:opacity-100 focus:outline-none" onClick={onPrev}>
              <svg className="fill-current w-7 h-7" viewBox="0 0 24 24">
                <path d="M7 6c.55 0 1 .45 1 1v10c0 .55-.45 1-1 1s-1-.45-1-1V7c0-.55.45-1 1-1zm3.66 6.82l5.77 4.07c.66.47 1.58-.01 1.58-.82V7.93c0-.81-.91-1.28-1.58-.82l-5.77 4.07a1 1 0 000 1.64z" />
              </svg>
            </button>
            <button
              className="w-10 h-10 opacity-70 hover:opacity-100 focus:outline-none"
              onClick={() =>
                controls && controls.getPlayerState() === 1 ? controls.pauseVideo() : controls.playVideo()
              }
            >
              <svg className="fill-current w-7 h-7" viewBox="0 0 24 24">
                {controls && controls.getPlayerState() === 1 ? (
                  <path d="M8 19c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2v10c0 1.1.9 2 2 2zm6-12v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2z" />
                ) : (
                  <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18a1 1 0 000-1.69L9.54 5.98A.998.998 0 008 6.82z" />
                )}
              </svg>
            </button>
            <button className="w-10 h-10 opacity-70 hover:opacity-100 focus:outline-none" onClick={onNext}>
              <svg className="fill-current w-7 h-7" viewBox="0 0 24 24">
                <path d="M7.58 16.89l5.77-4.07c.56-.4.56-1.24 0-1.63L7.58 7.11C6.91 6.65 6 7.12 6 7.93v8.14c0 .81.91 1.28 1.58.82zM16 7v10c0 .55.45 1 1 1s1-.45 1-1V7c0-.55-.45-1-1-1s-1 .45-1 1z" />
              </svg>
            </button>
            <div
              className="relative"
              onMouseEnter={() => setVolumeControlOpen(true)}
              onMouseLeave={() => setVolumeControlOpen(false)}
            >
              {volumeControlOpen && (
                <button
                  className="absolute bottom-full left-0 h-28 w-7 bg-submenu-gray rounded-md focus:outline-none"
                  onMouseUp={() => setVolumeChanging(false)}
                  onMouseLeave={() => setVolumeChanging(false)}
                  onMouseDown={() => setVolumeChanging(true)}
                  onClick={e => updateVolume(e)}
                  onMouseMove={e => volumeChanging && updateVolume(e)}
                >
                  <div
                    ref={volumeSlideBar}
                    className="w-1 h-4/6 m-auto bg-volume-slider-gray relative focus:outline-none"
                  >
                    <div
                      className={`absolute w-1 left-0 bottom-0 bg-white ${
                        volumeChanging ? "" : "transition-height duration-300"
                      }`}
                      style={{ height: `${isMuted ? 0 : volume}%` }}
                    />
                    <span
                      className={`absolute h-3 w-3 rounded-lg bg-white -right-1 ${
                        volumeChanging ? "" : "transition-bottom duration-300"
                      }`}
                      style={{ bottom: `${isMuted ? 0 : volume}%` }}
                    />
                  </div>
                </button>
              )}
              <button
                className="w-10 h-10 opacity-70 hover:opacity-100 focus:outline-none"
                onClick={() => setIsMuted(!isMuted)}
              >
                <svg className="fill-current w-7 h-7" viewBox="0 0 24 24">
                  {isMuted ? (
                    <path d="M3.63 3.63a.996.996 0 000 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.55-.77 2.22-1.31l1.34 1.34a.996.996 0 101.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-3.83-2.4-7.11-5.78-8.4-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12zm-8.71-6.29l-.17.17L12 7.76V6.41c0-.89-1.08-1.33-1.71-.7zM16.5 12A4.5 4.5 0 0014 7.97v1.79l2.48 2.48c.01-.08.02-.16.02-.24z" />
                  ) : (
                    <path d="M3 10v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71V6.41c0-.89-1.08-1.34-1.71-.71L7 9H4c-.55 0-1 .45-1 1zm13.5 2A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 4.45v.2c0 .38.25.71.6.85C17.18 6.53 19 9.06 19 12s-1.82 5.47-4.4 6.5c-.36.14-.6.47-.6.85v.2c0 .63.63 1.07 1.21.85C18.6 19.11 21 15.84 21 12s-2.4-7.11-5.79-8.4c-.58-.23-1.21.22-1.21.85z" />
                  )}
                </svg>
              </button>
            </div>
            <button
              ref={progressBar}
              className="flex-grow h-10 focus:outline-none"
              onMouseDown={() => setProgressChanging(true)}
              onMouseUp={() => setProgressChanging(false)}
              onMouseLeave={e => {
                if (progressChanging) {
                  const { left, width } = progressBar.current.getBoundingClientRect()
                  setProgressChanging(clamp(Math.round(((e.clientX - left) / width) * 100), 0, 100))
                  controls.seekTo(Math.round(((e.clientX - left) / width) * controls.getDuration()))
                  setProgressChanging(false)
                }
              }}
              onMouseMove={e => {
                if (progressChanging) {
                  const { left, width } = progressBar.current.getBoundingClientRect()
                  setProgressChanging(clamp(Math.round(((e.clientX - left) / width) * 100), 0, 100))
                }
              }}
              onClick={e => {
                const { left, width } = progressBar.current.getBoundingClientRect()
                controls.seekTo(Math.round(((e.clientX - left) / width) * controls.getDuration()))
              }}
            >
              <div className="relative bg-progress-bar-gray h-1 w-full m-auto">
                <div className="absolute h-1 top-0 left-0 bg-white" style={{ width: `${progress}%` }} />
                <span
                  className="absolute h-3 w-3 rounded-lg bg-white -top-1"
                  style={{ left: `calc(${progress}% - 0.375rem)` }}
                />
              </div>
            </button>
            <p className="m-4 opacity-70 text-sm">
              {remainingMinutes}:
              {(remainingSeconds - remainingMinutes * 60).toLocaleString("en-US", {
                minimumIntegerDigits: 2,
                useGrouping: false,
              })}
            </p>
            <button
              className="w-10 h-10 opacity-70 hover:opacity-100 focus:outline-none"
              onClick={() => setSidePannelShowing(!sidePannelShowing)}
            >
              <svg className="fill-current w-7 h-7" viewBox="0 0 24 24">
                <path d="M0 0h24v24H0V0z" fill="none" />
                {sidePannelShowing ? (
                  <path d="M19 5H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-1 12H6c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v8c0 .55-.45 1-1 1z" />
                ) : (
                  <path d="M19 5H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-1 2c.55 0 1 .45 1 1v8c0 .55-.45 1-1 1h-3V7h3zm-5 10H6c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1h7v10z" />
                )}
              </svg>
            </button>
            <button
              className="w-10 h-10 opacity-70 hover:opacity-100 focus:outline-none"
              onClick={() => {
                isFullscreen ? document.exitFullscreen() : document.getElementById("video-player").requestFullscreen()
                setIsFullScreen(!isFullscreen)
              }}
            >
              <svg className="fill-current w-7 h-7" viewBox="0 0 24 24">
                {isFullscreen ? (
                  <>
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path d="M6 16h2v2c0 .55.45 1 1 1s1-.45 1-1v-3c0-.55-.45-1-1-1H6c-.55 0-1 .45-1 1s.45 1 1 1zm2-8H6c-.55 0-1 .45-1 1s.45 1 1 1h3c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1s-1 .45-1 1v2zm7 11c.55 0 1-.45 1-1v-2h2c.55 0 1-.45 1-1s-.45-1-1-1h-3c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1zm1-11V6c0-.55-.45-1-1-1s-1 .45-1 1v3c0 .55.45 1 1 1h3c.55 0 1-.45 1-1s-.45-1-1-1h-2z" />
                  </>
                ) : (
                  <>
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path d="M6 14c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1h3c.55 0 1-.45 1-1s-.45-1-1-1H7v-2c0-.55-.45-1-1-1zm0-4c.55 0 1-.45 1-1V7h2c.55 0 1-.45 1-1s-.45-1-1-1H6c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1zm11 7h-2c-.55 0-1 .45-1 1s.45 1 1 1h3c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1s-1 .45-1 1v2zM14 6c0 .55.45 1 1 1h2v2c0 .55.45 1 1 1s1-.45 1-1V6c0-.55-.45-1-1-1h-3c-.55 0-1 .45-1 1z" />
                  </>
                )}
              </svg>
            </button>
            <button
              className="w-10 h-10 opacity-70 hover:opacity-100 focus:outline-none"
              onClick={() => setYoutubeLinkShowing(!youtubeLinkShowing)}
            >
              <svg className="fill-current w-7 h-7" viewBox="0 0 24 24">
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default React.memo(PlayerControls)
