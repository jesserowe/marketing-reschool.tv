const axios = require("axios")

exports.createPages = async ({ actions: { createPage } }) => {
  // call createPage for every single video with info about videoId and title
  const channels = await require("./data/channels.json").filter(({ playlistId }) => playlistId)
  await Promise.all(channels.map(async ({ playlistId }) => {
      const playlistData = await (
        await axios.get(
          `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
        )
      ).data
      // console.log(playlistData.items[0].snippet)
      const channelTitle = playlistData.items[0].snippet.title

      // get the videoIds of the videos in the channel/playlist
      const { items } = (
        await axios.get(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
        )
      ).data


       items.forEach(({ snippet }) => {
        const videoId = snippet.resourceId.videoId
        const videoTitle = snippet.title
        createPage({
          path: `/${playlistId}/${videoId}`,
          component: require.resolve("./src/templates/video-template.js"),
          context: { channelTitle, videoId, videoTitle, playlistId, channelVideoIds: items.map(item => item.snippet.resourceId.videoId)},
        })
      })
    }))
}
