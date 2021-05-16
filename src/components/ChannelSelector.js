import React from "react"
import channels from "../../data/channels.json"

const NarrowTile = ({ outlined, channel, onClick }) => (
  <button
    className={`rounded-lg m-2 text-center flex items-center text-white flex-col justify-center h-48 border-white focus:outline-none ${
      outlined ? "border-2" : ""
    }`}
    style={{ background: channel.background }}
    onClick={onClick}
  >
    {channel.icon && <img className="w-14 h-14" src={`/${channel.icon}`} alt="" />}
    {channel.title && <p className="font-bold m-1 w-10/12">{channel.title}</p>}
    {channel.description && <p className="text-xs w-11/12 opacity-70">{channel.description}</p>}
  </button>
)

const WideTile = ({ outlined, channel, onClick }) => (
  <button
    className={`rounded-lg m-2 flex items-center text-white col-span-3 h-36 relative overflow-hidden border-white focus:outline-none ${
      outlined ? "border-2" : ""
    }`}
    style={{ background: channel.background }}
    onClick={onClick}
  >
    <div className="text-left w-8/12 m-5">
      {channel.title && <p className="font-bold m-1 text-xl">{channel.title}</p>}
      {channel.description && <p className="text-sm opacity-70">{channel.description}</p>}
    </div>
    {channel.icon && <img className="w-36 h-36 absolute -bottom-1/8 right-0" src={`/${channel.icon}`} alt="" />}
  </button>
)

const ChannelSelector = ({ activeChannel, onChannelSelected }) => {
  return (
    <div className="grid grid-cols-3 mt-24">
      {channels.map((channel, index) =>
        (index - 3) % 7 === 0 ? (
          <WideTile
            key={channel.title}
            outlined={channel.title === activeChannel.title}
            channel={channel}
            onClick={() => onChannelSelected(channel)}
          />
        ) : (
          <NarrowTile
            key={channel.title}
            outlined={channel.title === activeChannel.title}
            channel={channel}
            onClick={() => onChannelSelected(channel)}
          />
        )
      )}
    </div>
  )
}

export default ChannelSelector
