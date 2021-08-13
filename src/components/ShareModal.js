import React, { useState } from "react"

const ShareModal = ({ isOpen, onClose, title, author }) => {
  const [shareLinkCopied, setShareLinkCopied] = useState(false)

  return (
    isOpen && (
      <>
        <button
          className="absolute z-40 top-0 left-0 w-screen h-screen bg-black opacity-70"
          onClick={() => {
            setShareLinkCopied(false)
            onClose()
          }}
        ></button>
        <div className="absolute left-0 right-0 top-0 bottom-0 w-5/12 h-72 m-auto bg-modal-gray z-50 rounded-xl shadow-sm text-white text-center py-5 px-10 min-w-min max-w-xl">
          <button className="absolute right-5 top-5 opacity-70 hover:opacity-100" onClick={onClose}>
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold m-3">Share Video</h1>
          <p className="opacity-70 text-sm">
            GTM Tube - {title} - {author}
          </p>
          <div className="flex justify-around text-sm m-5">
            <button
              className="flex flex-col w-32 items-center opacity-70 hover:opacity-100 m-1 focus:outline-none"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                setShareLinkCopied(true)
              }}
            >
              <div className="w-16 h-16 bg-gray-500 rounded-full flex items-center justify-center m-3">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </div>
              <p className="">Copy Link</p>
              {shareLinkCopied && <p className="text-green-500 text-xs">Link copied to clipboard</p>}
            </button>
            <a
              className="flex flex-col w-32 items-center opacity-70 hover:opacity-100 m-1 focus:outline-none"
              href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
              target="_blank"
              rel="noreferrer"
            >
              <div className="w-16 h-16 bg-facebook-blue rounded-full flex items-center justify-center m-3">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </div>
              <p className="">Share to Facebook</p>
            </a>
            <a
              className="flex flex-col w-32 items-center opacity-70 hover:opacity-100 m-1 focus:outline-none"
              href={`https://twitter.com/intent/tweet?text=${window.location.href}`}
              target="_blank"
              rel="noreferrer"
            >
              <div className="w-16 h-16 bg-twitter-blue rounded-full flex items-center justify-center m-3">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
              </div>
              <p className="">Share to Twitter</p>
            </a>
          </div>
        </div>
      </>
    )
  )
}

export default ShareModal
