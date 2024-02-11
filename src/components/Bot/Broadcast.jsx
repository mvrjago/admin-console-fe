import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";

const API_BASE_URL = "http://127.0.0.1:4000";

const Message = ({ content, sender, timestamp }) => (
  <div className="message">
    <div className="message-sender">{sender}</div>
    <div className="message-content">{content}</div>
    <div className="message-timestamp">{timestamp}</div>
  </div>
);

const Broadcast = () => {
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [discordData, setDiscordData] = useState({ channels: [], roles: [] });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("");
  const [messages, setMessages] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const channelsResponse = await fetch(`${API_BASE_URL}/guildChannels`);
        const rolesResponse = await fetch(`${API_BASE_URL}/guildRoles`);

        if (!channelsResponse.ok || !rolesResponse.ok) {
          throw new Error(`HTTP error! Status: ${channelsResponse.status}`);
        }

        const channelsData = await channelsResponse.json();
        const rolesData = await rolesResponse.json();

        console.log("Discord Channels Data:", channelsData);
        console.log("Discord Roles Data:", rolesData);

        setDiscordData({ channels: channelsData.channels, roles: rolesData.roles });
      } catch (error) {
        console.error("Error fetching Discord data:", error.message);
      }
    };

    fetchData();
  }, []);

  const handleEnterKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setMessage((prevMessage) => prevMessage + "\n");
      setDescription((prevDescription) => prevDescription + "\n");
    }
  };

  const handleTagSelection = (tagName) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tagName)
        ? prevTags.filter((tag) => tag !== tagName)
        : [...prevTags, tagName]
    );
  };

  const handleSendMessage = async () => {
    console.log("Selected Channel ID:", selectedChannel);

    try {
      const formattedMessage = `**${title}**\n\n${description}\n\n**Tags:** ${selectedTags
        .map((tag) => `<@&${discordData.roles.find((role) => role.name === tag)?.id}>`)
        .join(', ')}\n\n${message}`;

      const response = await fetch(`${API_BASE_URL}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: formattedMessage,
          channelId: selectedChannel,
          tags: selectedTags,
          imageUrl: imageUrl,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Message sent successfully");
        const newMessage = {
          content: formattedMessage,
          sender: "You",
          timestamp: new Date().toLocaleTimeString(),
          imageUrl: imageUrl,
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setMessage("");
        setTitle("");
        setDescription("");
        setSelectedTags([]);
        setImageUrl("");
      } else {
        console.error("Failed to send message:", data.error);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleReset = () => {
    setMessage("");
    setImageUrl("");
    setSearchTerm("");
    setSelectedChannel("");
    setMessages([]);
    setTitle("");
    setDescription("");
    setSelectedTags([]);
    
  };
  const renderRoles = () => {
    return discordData.roles
      .filter((role) => role.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 5) 
      .map((role) => (
        <label key={role.id} className="checkbox">
          <input
            type="checkbox"
            value={role.name}
            checked={selectedTags.includes(role.name)}
            onChange={() => handleTagSelection(role.name)}
          />
          {role.name}
        </label>
      ));
  };

  const slideIn = useSpring({
    opacity: 1,
    transform: "translateY(0%)",
    from: { opacity: 0, transform: "translateY(50%)" },
    config: { mass: 1, tension: 120, friction: 14 },
  });

  const renderMessages = () => {
    return messages.map((msg, index) => (
      <div key={index} className="message">
        <Message content={msg.content} sender={msg.sender} timestamp={msg.timestamp} />
        {msg.imageUrl && <img src={msg.imageUrl} alt="Attachment" className="message-image" />}
      </div>
    ));
  };

  return (
    <div className="columns is-multiline mt-4 is-flex is-justify-content-center">
      <animated.div style={{ ...slideIn}} 
        className="column is-three-quarters-mobile is-two-thirds-tablet is-half-desktop is-one-third-widescreen is-one-quarter-fullhd"
      >
        <div className="box has-text-centered">
          <p className="title is-4">Broadcast</p>
          <div className="field">
            <label className="label">Select Channel:</label>
            <div className="control">
              <div className="select">
                <select
                  value={selectedChannel}
                  onChange={(e) => setSelectedChannel(e.target.value)}
                >
                  <option value="" disabled>Select channel</option>
                  {discordData.channels &&
                    discordData.channels.map((channel) => (
                      <option key={channel.id} value={channel.id}>
                        {channel.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
          <div className="field">
            <label className="label">Title:</label>
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="Enter the title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Description:</label>
            <div className="control">
              <textarea
                className="textarea"
                placeholder="Enter the description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={handleEnterKeyPress}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Tags:</label>
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="Search roles"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="control role-search-results">
              {renderRoles()}
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button className="button is-primary" onClick={handleSendMessage}>
                Send Broadcast
              </button>
            </div>
          </div>
          <div className="field">
            <div className="control">
                <button className="button is-danger" onClick={handleReset}>
                Reset
                </button>
            </div>
          </div>
          <div className="message-container">
            {renderMessages()}
          </div>
        </div>
      </animated.div>
    </div>
  );
};

export default Broadcast;
