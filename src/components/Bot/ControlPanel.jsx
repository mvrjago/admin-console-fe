import React, { useState } from "react";
import axios from "axios";

const ControlPanel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scripts = [
    "AvatarLog.py",
    "DeleteMessage.py",
    "LeaveLog.py",
    "ModeratorLog.py",
    "Portal.py",
    "RoleLog.py",
  ];

  const handleAction = async (scriptName, action) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://127.0.0.1:5000/control", {
        scriptName,
        action,
      });
      console.log(`${action} action sent for ${scriptName}:`, response.data);
    } catch (error) {
      console.error(`Error performing ${action} on ${scriptName}`, error);
      setError(`Failed to ${action} ${scriptName}.`);
    }
    setLoading(false);
  };

  return (
    <div className="bot-layout">
      {scripts.map((script) => (
        <div key={script} className="box container-box">
          <div className="title-bot">
            {script}
            <div className="buttons">
              <button
                onClick={() => handleAction(script, "start")}
                disabled={loading}
              >
                Start
              </button>
              <button
                onClick={() => handleAction(script, "restart")}
                disabled={loading}
              >
                Restart
              </button>
              <button
                onClick={() => handleAction(script, "stop")}
                disabled={loading}
              >
                Stop
              </button>
            </div>
          </div>
        </div>
      ))}
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ControlPanel;
