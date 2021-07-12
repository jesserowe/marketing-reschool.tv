import React from "react"
import { navigate } from "gatsby"
import { sample } from "lodash"
import channels from "../../data/channels.json"

const isBrowser = typeof window !== "undefined"

const IndexPage = () => {
  console.log("index")
  // TODO: uncomment when all channels have videos
  // const randomChannel = sample(channels)
  const randomChannel = channels[0]

  isBrowser && navigate(`/${randomChannel.playlistId}/${sample(randomChannel.videoIds)}`)

  return <div>should redirect to a video page</div>
}

export default IndexPage
