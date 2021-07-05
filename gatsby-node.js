const axios = require('axios');

exports.createPages = async ( actions: { { createPage } }) => {
    const allPlaylists = []
    require("./data/channels.json").forEach(({ playlistId, index }) => {
        
        await axios.get(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`).then(playlistData => allPlaylists[index] = {
            title: playlistData.items[0].snippet.localized.title,
            playlistId
        })

        await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`).then(playlistItems => {
            allPlaylists[index].items = playlistItems.items.map(item => ({
                videoId: item.id,
                title: item.snippet.title
            }))
    })

    createPage({
        path: $ `/${playlistId}/${videoId}`,
        component: require.resolve("./src/templates/video-template.js"),
        context: allPlaylists
    })   
}