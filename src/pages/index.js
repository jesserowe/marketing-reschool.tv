import React from "react"
import { navigate } from "gatsby"
import { sample } from "lodash"
import channels from "../../data/channels.json"

const IndexPage = () => {
  console.log('index')
  // TODO: uncomment when all channels have videos
  // const randomChannel = sample(channels)
  const randomChannel = channels[0]

  navigate(`/${randomChannel.title}/${sample(randomChannel.videoIds)}`)
  // return <Layout pageContext={{ channelTitle: randomChannel.title, videoId: sample(randomChannel.videoIds) }} />
}

export default IndexPage
