import React, { useEffect, useState, useRef } from 'react'
import YouTube from 'react-youtube'
import channels from './channels.json'
import logo from './images/logo.png'
import throttle from 'lodash/throttle'

function App() {
  const progressBar = useRef()
  const volumeSlideBar = useRef()

  const [videoControls, setVideoControls] = useState() // mute, unMute, isMuted, getVolume, playVideo, pauseVideo, getDuration, playerInfo
  const [activeChannel, setActiveChannel] = useState(0)
  const [videoIndex, setVideoIndex] = useState(Math.floor(Math.random() * channels[activeChannel].videoIds.length))
  const [videoId, setVideoId] = useState(channels[activeChannel].videoIds[videoIndex])
  const [videoData, setVideoData] = useState()
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const [videoProgress, setVideoProgress] = useState(0)
  // const [videoProgressChanging, setVideoProgressChanging] = useState(false)
  const [sidePannelShowing, setSidePannelShowing] = useState(true)
  const [youtubeLinkShowing, setYoutubeLinkShowing] = useState(false)
  const [volumeControlOpen, setVolumeControlOpen] = useState(false)
  const [volume, setVolume] = useState(0)
  const [volumeChanging, setVolumeChanging] = useState(false)

  useEffect(() => { // update the progressBar progress every 50 ms
    const intervalId = setInterval(() => {
      videoControls && setVideoProgress(videoControls.playerInfo.currentTime / videoControls.getDuration() * 100)
    }, 50)
    return () => clearTimeout(intervalId)
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => videoControls && setVideoData(videoControls.getVideoData()), [videoControls && videoControls.getVideoData()])

  useEffect(() => { // start playing videos from random index when channel is changed
    setVideoIndex(Math.floor(Math.random() * channels[activeChannel].videoIds.length))
    setIsPlaying(true)
  }, [activeChannel])

  useEffect(() => setVideoId(channels[activeChannel].videoIds[videoIndex]), [videoIndex, activeChannel])

  useEffect(() => videoControls && (isMuted ? videoControls.mute() : videoControls.unMute()), [videoControls, isMuted])

  const nextVideo = () => setVideoIndex((videoIndex + 1) % channels[activeChannel].videoIds.length)
  const prevVideo = () => setVideoIndex(videoIndex === 0 ? channels[activeChannel].videoIds.length : videoIndex - 1)

  const remainingSeconds = videoControls ? Math.floor(videoControls.getDuration() - videoControls.playerInfo.currentTime) : 0

  const remainingMinutes = Math.floor(remainingSeconds / 60)

  const updateVolume = throttle((pageY) => {
    const { bottom } = volumeSlideBar.current.getBoundingClientRect()
    const newVolume = Math.max(Math.min(Math.round(bottom - pageY), 100), 0)
    videoControls.setVolume(newVolume)
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }, 50)

  return (
    <div className='flex w-screen'>
      {/* video player */}
      <div id='video-player' className='relative flex-grow flex-shrink h-screen'>
        {/* mute button container */}
        <div className='absolute w-full h-24 bg-black'>
          {videoControls && isMuted && (
            <button
              className='bg-white rounded-md w-48 h-12 m-5 flex items-center justify-evenly font-bold'
              onClick={() => videoControls.unMute() && setIsMuted(false)}
            >
              <svg viewBox='0 0 24 24' height='24' width='24'><path d='M3.63 3.63a.996.996 0 000 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.55-.77 2.22-1.31l1.34 1.34a.996.996 0 101.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-3.83-2.4-7.11-5.78-8.4-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12zm-8.71-6.29l-.17.17L12 7.76V6.41c0-.89-1.08-1.33-1.71-.7zM16.5 12A4.5 4.5 0 0014 7.97v1.79l2.48 2.48c.01-.08.02-.16.02-.24z'></path></svg>
              Click to unmute
            </button>
          )}
        </div>
        <YouTube
          key={videoId}
          containerClassName='w-full h-full'
          className='w-full h-full'
          videoId={videoId}
          opts={{ playerVars: { autoplay: 1, mute: 1, controls: 0 } }}
          onEnd={nextVideo}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onReady={({ target }) => setVideoControls(target)}
        />
        {/* player controls */}
        <div className='absolute bottom-0 w-full h-40 bg-black'>
          {videoControls && <div className='absolute bottom-0 left-0 right-0 m-3 rounded-lg bg-gray-1000 text-white p-2'>
            {youtubeLinkShowing && ( // youtube link
              <div className='absolute bg-submenu-gray w-60 top-4 right-4 rounded-md p-4 text-sm'>
                <a href={`https://www.youtube.com/watch?v=${videoId}`} target='_blank' rel='noreferrer' className='opacity-70 hover:opacity-100'>Watch on YouTube</a>
              </div>
            )}
            <p className='font-bold p-1 h-8'>{videoData && videoData.author}</p>
            <p className='p-1 h-8'>{videoData && videoData.title}</p>
            <div className='flex p-1 items-center'>
              <button className='w-10 h-10 opacity-70 hover:opacity-100 focus:outline-none' onClick={prevVideo}> {/* back button */}
                <svg className='fill-current w-7 h-7' viewBox="0 0 24 24"><path d="M7 6c.55 0 1 .45 1 1v10c0 .55-.45 1-1 1s-1-.45-1-1V7c0-.55.45-1 1-1zm3.66 6.82l5.77 4.07c.66.47 1.58-.01 1.58-.82V7.93c0-.81-.91-1.28-1.58-.82l-5.77 4.07a1 1 0 000 1.64z" /></svg>
              </button>
              <button
                className='w-10 h-10 opacity-70 hover:opacity-100 focus:outline-none'
                onClick={() => {
                  isPlaying ? videoControls.pauseVideo() : videoControls.playVideo()
                  setIsPlaying(!isPlaying)
                }}
              > {/* play/pause button */}
                <svg className='fill-current w-7 h-7' viewBox="0 0 24 24">
                  {isPlaying
                    ? <path d="M8 19c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2v10c0 1.1.9 2 2 2zm6-12v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2z" />
                    : <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18a1 1 0 000-1.69L9.54 5.98A.998.998 0 008 6.82z" />
                  }
                </svg>
              </button>
              <button className='w-10 h-10 opacity-70 hover:opacity-100 focus:outline-none' onClick={nextVideo}> {/* next button */}
                <svg className='fill-current w-7 h-7' viewBox="0 0 24 24"><path d="M7.58 16.89l5.77-4.07c.56-.4.56-1.24 0-1.63L7.58 7.11C6.91 6.65 6 7.12 6 7.93v8.14c0 .81.91 1.28 1.58.82zM16 7v10c0 .55.45 1 1 1s1-.45 1-1V7c0-.55-.45-1-1-1s-1 .45-1 1z" /></svg>
              </button>
              <div
                className='relative'
                onMouseEnter={() => setVolumeControlOpen(true)}
                onMouseLeave={() => setVolumeControlOpen(false)}
              > {/* volume button */}
                {volumeControlOpen && (
                  <button
                    className='absolute bottom-full left-0 h-28 w-7 bg-submenu-gray rounded-md focus:outline-none'
                    onMouseUp={(e) => setVolumeChanging(false)}
                    onMouseLeave={(e) => setVolumeChanging(false)}
                    onMouseDown={(e) => setVolumeChanging(true)}
                    onClick={(e) => updateVolume(e.pageY)}
                    onMouseMove={(e) => volumeChanging && updateVolume(e.pageY)}
                  >
                    <div ref={volumeSlideBar} className='w-1 h-4/6 m-auto bg-volume-slider-gray relative focus:outline-none'>
                      <div className={`absolute w-1 left-0 bottom-0 bg-white transition-height ${volumeChanging ? '' : 'duration-500'}`} style={{ height: `${volume}%` }} />
                      <span className={`absolute h-3 w-3 rounded-lg bg-white -right-1 transition-bottom ${volumeChanging ? '' : 'duration-500'}`} style={{ bottom: `${volume}%` }} />
                    </div>
                  </button>
                )}
                <button
                  className='w-10 h-10 opacity-70 hover:opacity-100 focus:outline-none'
                  onClick={() => {
                    isMuted ? videoControls.unMute() : videoControls.mute()
                    isMuted ? setVolume(videoControls.getVolume()) : setVolume(0)
                    setIsMuted(!isMuted)
                  }}
                >
                  <svg className='fill-current w-7 h-7' viewBox="0 0 24 24">
                    {isMuted
                      ? <path d="M3.63 3.63a.996.996 0 000 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.55-.77 2.22-1.31l1.34 1.34a.996.996 0 101.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-3.83-2.4-7.11-5.78-8.4-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12zm-8.71-6.29l-.17.17L12 7.76V6.41c0-.89-1.08-1.33-1.71-.7zM16.5 12A4.5 4.5 0 0014 7.97v1.79l2.48 2.48c.01-.08.02-.16.02-.24z" />
                      : <path d="M3 10v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71V6.41c0-.89-1.08-1.34-1.71-.71L7 9H4c-.55 0-1 .45-1 1zm13.5 2A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 4.45v.2c0 .38.25.71.6.85C17.18 6.53 19 9.06 19 12s-1.82 5.47-4.4 6.5c-.36.14-.6.47-.6.85v.2c0 .63.63 1.07 1.21.85C18.6 19.11 21 15.84 21 12s-2.4-7.11-5.79-8.4c-.58-.23-1.21.22-1.21.85z" />
                    }
                  </svg>
                </button>
              </div>
              <button
                ref={progressBar}
                className='flex-grow relative bg-progress-bar-gray h-1 focus:outline-none'
                onClick={(e) => {
                  // TODO: figure out why the target's bounding rectangle changes each time this is triggered
                  const { left, width } = progressBar.current.getBoundingClientRect()
                  videoControls.seekTo((e.clientX - left) / width * videoControls.getDuration())
                }}
              > {/* progress bar button */}
                <div className='absolute h-1 top-0 left-0 bg-white' style={{ width: `${videoProgress}%` }}></div>
                <span className='absolute h-3 w-3 rounded-lg bg-white -top-1' style={{ left: `calc(${videoProgress}% - 0.375rem)` }}></span>
              </button>
              <p className='m-4 opacity-70 text-sm'>
                {remainingMinutes}:{(remainingSeconds - (remainingMinutes * 60)).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}
              </p>
              <button className='w-10 h-10 opacity-70 hover:opacity-100 focus:outline-none' onClick={() => setSidePannelShowing(!sidePannelShowing)}>
                <svg className='fill-current w-7 h-7' viewBox="0 0 24 24"><path d="M0 0h24v24H0V0z" fill="none" />
                  {sidePannelShowing
                    ? <path d="M19 5H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-1 12H6c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v8c0 .55-.45 1-1 1z" />
                    : <path d="M19 5H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-1 2c.55 0 1 .45 1 1v8c0 .55-.45 1-1 1h-3V7h3zm-5 10H6c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1h7v10z" />
                  }
                </svg>
              </button>
              <button
                className='w-10 h-10 opacity-70 hover:opacity-100 focus:outline-none'
                onClick={() => document.fullscreenElement ? document.exitFullscreen() : document.getElementById('video-player').requestFullscreen()}
              >
                <svg className='fill-current w-7 h-7' viewBox="0 0 24 24">
                  {document.fullscreenElement
                    ? <><path d="M0 0h24v24H0V0z" fill="none" /><path d="M6 16h2v2c0 .55.45 1 1 1s1-.45 1-1v-3c0-.55-.45-1-1-1H6c-.55 0-1 .45-1 1s.45 1 1 1zm2-8H6c-.55 0-1 .45-1 1s.45 1 1 1h3c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1s-1 .45-1 1v2zm7 11c.55 0 1-.45 1-1v-2h2c.55 0 1-.45 1-1s-.45-1-1-1h-3c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1zm1-11V6c0-.55-.45-1-1-1s-1 .45-1 1v3c0 .55.45 1 1 1h3c.55 0 1-.45 1-1s-.45-1-1-1h-2z" /></>
                    : <><path d="M0 0h24v24H0V0z" fill="none" /><path d="M6 14c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1h3c.55 0 1-.45 1-1s-.45-1-1-1H7v-2c0-.55-.45-1-1-1zm0-4c.55 0 1-.45 1-1V7h2c.55 0 1-.45 1-1s-.45-1-1-1H6c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1zm11 7h-2c-.55 0-1 .45-1 1s.45 1 1 1h3c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1s-1 .45-1 1v2zM14 6c0 .55.45 1 1 1h2v2c0 .55.45 1 1 1s1-.45 1-1V6c0-.55-.45-1-1-1h-3c-.55 0-1 .45-1 1z" /></>
                  }
                </svg>
              </button>
              <button className='w-10 h-10 opacity-70 hover:opacity-100 focus:outline-none' onClick={() => setYoutubeLinkShowing(!youtubeLinkShowing)}>
                <svg className='fill-current w-7 h-7' viewBox="0 0 24 24" ><path d="M0 0h24v24H0V0z" fill="none" /><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>
              </button>
            </div>
          </div>}
        </div>
      </div>
      {/* side panel */}
      {sidePannelShowing && <div className='w-480 h-screen flex-shrink-0 bg-near-black overflow-auto'>
        {/* logo and future login controls */}
        <div className='flex items-center fixed bg-near-black z-10'>
          <img className='w-11/12 m-auto my-5' src={logo} alt='logo' />
        </div>
        {/* buttons panel */}
        <div className='grid grid-cols-3 mt-24'>
          {channels.map(({ title, background, icon, description }, index) => (
            (index - 3) % 7 === 0
              ? ( // wide button
                <button
                  key={index}
                  className={`rounded-lg m-2 flex items-center text-white col-span-3 h-36 relative overflow-hidden border-white focus:outline-none ${index === activeChannel ? 'border-2' : ''}`}
                  style={{ background }}
                  onClick={() => setActiveChannel(index)}
                >
                  <div className='text-left w-8/12 m-5'>
                    {title && <p className='font-bold m-1 text-xl'>{title}</p>}
                    {description && <p className='text-sm opacity-70'>{description}</p>}
                  </div>
                  {icon && <img className='w-44 h-44 absolute -bottom-1/4 -right-1/8' src={`${process.env.PUBLIC_URL}/assets/${icon}`} alt='' />}
                </button>
              )
              : ( // narrow button
                <button
                  key={index}
                  className={`rounded-lg m-2 text-center flex items-center text-white flex-col justify-center h-48 border-white focus:outline-none ${index === activeChannel ? 'border-2' : ''}`}
                  style={{ background }}
                  onClick={() => setActiveChannel(index)}
                >
                  {icon && <img className='w-14 h-14' src={`${process.env.PUBLIC_URL}/assets/${icon}`} alt='' />}
                  {title && <p className='font-bold m-1 w-10/12'>{title}</p>}
                  {description && <p className='text-xs w-11/12 opacity-70'>{description}</p>}
                </button>
              )
          ))}
        </div>
      </div>}
    </div >
  );
}

export default App;
