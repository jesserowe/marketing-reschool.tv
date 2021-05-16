/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */

// You can delete this file if you're not using it
// import channels from "./data/channels.json"

exports.createPages = async ({ actions: { createPage } }) => {
  require("./data/channels.json").forEach(channel => {
    channel.videoIds.forEach(videoId => {
      createPage({
        path: `/${channel.title}/${videoId}`,
        component: require.resolve("./src/templates/video-template.js"),
        context: { channelTitle: channel.title, videoId },
      })
    })
  })
}
