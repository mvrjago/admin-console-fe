import React, { useState, useEffect } from "react";
import axios from "axios";
import dataChannels from "./channels.json";

const API_BASE_URL = "http://127.0.0.1:4000";

const ModeratorLog = () => {
  const [enabled, setEnabled] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState("");
  const [discordData, setDiscordData] = useState({ channels: [] });
  const [isSaving, setIsSaving] = useState(false);
  const [selectedChannelsToSave, setSelectedChannelsToSave] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [moderatorLogChannels, setModeratorLogChannels] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const channelsResponse = await fetch(`${API_BASE_URL}/guildChannels`);
        if (!channelsResponse.ok) {
          throw new Error(`HTTP error! Status: ${channelsResponse.status}`);
        }
        const channelsData = await channelsResponse.json();
        console.log("Discord Channels Data:", channelsData);
        setDiscordData({ channels: channelsData.channels });
      } catch (error) {
        console.error("Error fetching Discord data:", error.message);
      }
    };

    fetchData();

    const moderatorLogChannelsData =
      dataChannels && dataChannels.moderatorLogChannels
        ? dataChannels.moderatorLogChannels
        : [];
    setModeratorLogChannels(moderatorLogChannelsData);
  }, []);

  const handleEnable = async () => {
    setIsSaving(true);
    try {
      setEnabled(true);
      await saveChannelsToServer(true);
      console.log("Channels enabled successfully!");
      setShowPopup(true);
    } catch (error) {
      console.error("Error enabling channels:", error);
    }
    setIsSaving(false);
  };

  const handleDisable = async () => {
    setIsSaving(true);
    try {
      setEnabled(false);
      await saveChannelsToServer(false);
      console.log("Channels disabled successfully!");
      setShowPopup(true);
    } catch (error) {
      console.error("Error disabling channels:", error);
    }
    setIsSaving(false);
  };

  const saveChannelsToServer = async (enabledValue) => {
    if (!selectedChannelsToSave.length) {
      console.error("No channels selected for saving!");
      return;
    }
    const channelsToSave = selectedChannelsToSave.map((channelId) => {
      const selectedChannel = discordData.channels.find(
        (channel) => channel.id === channelId
      );
      return {
        id: selectedChannel.id,
        name: selectedChannel.name,
        enabled: enabledValue,
      };
    });
    await axios.post(`${API_BASE_URL}/saveModeratorLogChannels`, {
      moderatorLogChannels: channelsToSave,
    });
  };

  const handleSelectChannel = (e) => {
    const channelId = e.target.value;
    setSelectedChannel(channelId);
    if (!selectedChannelsToSave.includes(channelId)) {
      setSelectedChannelsToSave([...selectedChannelsToSave, channelId]);
    } else {
      setSelectedChannelsToSave(
        selectedChannelsToSave.filter((id) => id !== channelId)
      );
    }
  };

  return (
    <div className="container-log">
      <div className="box has-text-centered">
        <div className="column">
          <label className="label">Moderator Log</label>
          <div className="field">
            <button
              className={`button is-small ${
                enabled ? "is-primary" : "is-danger"
              }`}
              onClick={handleEnable}
              disabled={enabled || isSaving}
            >
              Enable
            </button>
            <button
              className={`button is-small ${
                !enabled ? "is-primary" : "is-danger"
              } ${isSaving ? "is-loading" : ""}`}
              onClick={handleDisable}
              disabled={!enabled || isSaving}
            >
              Disable
            </button>
          </div>
          <div className="field">
            <label className="label">Select Channel:</label>
            <div className="control">
              <div className="select">
                <select
                  value={selectedChannel}
                  onChange={(e) => handleSelectChannel(e)}
                >
                  <option value="" disabled>
                    Select channel
                  </option>
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
            <div className="box">
              <div className="field">
                <label className="label">Channel :</label>
                {/* Tampilkan nama channel yang akan dikick */}
                <ul>
                  {moderatorLogChannels.map((channel, index) => (
                    <li key={index}>
                      {channel.name}, {channel.enabled ? "enabled" : "disabled"}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          {showPopup && (
            <div className="notification is-success">
              <button
                className="delete"
                onClick={() => setShowPopup(false)}
              ></button>
              Saved
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModeratorLog;
