import React, { useState, useEffect } from "react";
import axios from "axios";
import dataTokens from "./config.json"; // Import config.json

const API_BASE_URL = "http://localhost:4000"; // Sesuaikan dengan URL backend Anda

const Token = () => {
  const [channelName, setChannelName] = useState("");
  const [prefix, setPrefix] = useState("");
  const [usedPrefix, setUsedPrefix] = useState("");
  const [previewToken, setPreviewToken] = useState("");
  const [isTokenUsed, setIsTokenUsed] = useState(false);
  const [isPrefixUsed, setIsPrefixUsed] = useState(false);
  const [notification, setNotification] = useState({
    active: false,
    message: "",
    type: "",
  });

  // Mengatur token dari config.json saat komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      if (dataTokens.prefixChannels && dataTokens.prefixChannels.length > 0) {
        const prefixFromConfig = dataTokens.prefixChannels[0].Prefix;
        setPrefix(prefixFromConfig);
        setUsedPrefix(prefixFromConfig);
        setIsPrefixUsed(true);
      }
      if (dataTokens.tokenChannels && dataTokens.tokenChannels.length > 0) {
        setPreviewToken(dataTokens.tokenChannels[0].Tokens);
        setIsTokenUsed(true);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (event) => {
    setChannelName(event.target.value);
  };

  const handlePrefixChange = (event) => {
    setPrefix(event.target.value);
  };

  const handleSavePrefix = async () => {
    if (prefix.trim() !== "") {
      try {
        // Menyimpan prefix baru ke config.json
        const newPrefix = { Prefix: prefix };
        const updatedPrefixChannels = [
          newPrefix,
          ...dataTokens.prefixChannels.slice(1),
        ];
        const updatedConfig = {
          ...dataTokens,
          prefixChannels: updatedPrefixChannels,
        };
        await axios.post(`${API_BASE_URL}/savePrefixChannels`, updatedConfig);

        console.log("Prefix saved successfully!");
        setUsedPrefix(prefix); // Mengganti input prefix dengan used prefix
        setIsPrefixUsed(true); // Menampilkan pesan "Used Prefix"
        showNotification("is-success", "Prefix saved successfully!");
      } catch (error) {
        console.error("Error saving prefix:", error);
        showNotification("is-danger", "Failed to save prefix.");
      }
    } else {
      console.error("Prefix is required.");
      showNotification("is-danger", "Prefix is required.");
    }
  };

  const handleSaveToken = async () => {
    if (channelName.trim() !== "") {
      try {
        await axios.post(`${API_BASE_URL}/saveTokenChannels`, {
          tokenChannels: [{ Tokens: channelName }],
        });
        console.log("Token saved successfully!");
        setPreviewToken(channelName); // Menampilkan token sebagai preview
        setIsTokenUsed(true); // Menampilkan pesan "Used Token"
        showNotification("is-success", "Token saved successfully!");
      } catch (error) {
        console.error("Error saving token:", error);
        showNotification("is-danger", "Failed to save token.");
      }
    } else {
      console.error("Token is required.");
      showNotification("is-danger", "Token is required.");
    }
  };

  const showNotification = (type, message) => {
    setNotification({ active: true, type, message });
    setTimeout(() => {
      setNotification({ ...notification, active: false });
    }, 3000);
  };

  return (
    <div className="container token-bot">
      <div className="box">
        <div className="field">
          <label className="label">PREFIX INPUT</label>
          <div className="control">
            <input
              type="text"
              className="input"
              placeholder="Enter prefix"
              value={prefix} // Menggunakan nilai prefix dari config.json
              onChange={handlePrefixChange}
            />
          </div>
        </div>
        <div className="field">
          <div className="control">
            <button className="button is-primary" onClick={handleSavePrefix}>
              Save Prefix
            </button>
          </div>
        </div>

        <div className="field">
          <label className="label">TOKEN INPUT</label>
          <div className="control">
            <input
              type="text"
              className="input"
              placeholder="Enter your token"
              value={channelName}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="field">
          <div className="control">
            <button className="button is-primary" onClick={handleSaveToken}>
              Save Token
            </button>
          </div>
        </div>

        <div className="field">
          <label className="label">Preview</label>
          <div className="control">
            {isPrefixUsed && <div>Used Prefix: {usedPrefix}</div>}
            {isTokenUsed ? <div>USED TOKEN</div> : <div>{previewToken}</div>}
          </div>
        </div>
      </div>
      {notification.active && (
        <div
          className={`notification ${notification.type} is-floating is-absolute`}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default Token;
