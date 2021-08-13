const axios = require("axios")

// call createPage for every single video with info about videoId and title
exports.createPages = async ({ actions: { createPage } }) => {
  // build data structure with info about avery video and playlist
  // [{id, title, description, icon, background, videos: [{id, title, author}, ...]}, ...]
  const playlists = await Promise.all(
    await require("./data/channels.json")
      .filter(({ playlistId }) => playlistId)
      .map(async ({ playlistId, description, icon, background }) => {
        const playlistData = await axios.get(
          `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
        )

        const playlistItems = await axios.get(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
        )

        return {
          id: playlistId,
          title: playlistData.data.items[0].snippet.title,
          description,
          icon,
          background,
          videos: playlistItems.data.items.map(({ snippet }) => {
            return {
              id: snippet.resourceId.videoId,
              title: snippet.title,
              author: snippet.videoOwnerChannelTitle,
            }
          }),
        }
      })
  )

  // for keeping track of available pages as they are created
  let pages = []

  // create a page for each video
  playlists.forEach(({ id: playlistId, videos }) => {
    videos.forEach(({ id: videoId }) => {
      console.log(`creating page: /${playlistId}/${videoId}`)
      pages.push(`/${playlistId}/${videoId}`)
      createPage({
        path: `/${playlistId}/${videoId}`,
        component: require.resolve("./src/templates/video-template.js"),
        context: { playlistId, videoId, playlists },
      })
    })
  })

  // when a user visits marketing-reschool directly, they get redirected to one of the created pages
  createPage({ path: "/", component: require.resolve("./src/templates/redirect.js"), context: { pages } })
}
