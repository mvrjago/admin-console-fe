import React, { useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";

const API_BASE_URL = "http://127.0.0.1:4000";

const Planner = () => {
  const [discordData, setDiscordData] = useState([]);

  useEffect(() => {
    const fetchDiscordData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/memberCount`);
        const data = await response.json();
        setDiscordData(data);
      } catch (error) {
        console.error("Error fetching Discord data:", error);
      }
    };

    fetchDiscordData();
  }, []);

  const slideIn = useSpring({
    opacity: 1,
    transform: "translateY(0%)",
    from: { opacity: 0, transform: "translateY(50%)" },
    config: { mass: 1, tension: 120, friction: 14 },
  });

  return (
    
    <div className="columns is-multiline mt-4 is-flex is-justify-content-center">
      <animated.div style={{ ...slideIn }} 
        className="column is-three-quarters-mobile is-two-thirds-tablet is-half-desktop is-one-third-widescreen is-one-quarter-fullhd"
      >
        <div className="box has-text-centered">
          <p className="title is-4">Members</p>
          <p className="title is-2">{discordData.totalMembers}</p>
        </div>
      </animated.div>

      <animated.div style={{ ...slideIn}}
        className="column is-three-quarters-mobile is-two-thirds-tablet is-half-desktop is-one-third-widescreen is-one-quarter-fullhd"
      >
        <div className="box has-text-centered">
          <p className="title is-4">Roles</p>
          <p className="title is-2">{discordData.totalRoles}</p>
        </div>
      </animated.div>

      <animated.div style={{ ...slideIn}}
        className="column is-three-quarters-mobile is-two-thirds-tablet is-half-desktop is-one-third-widescreen is-one-quarter-fullhd"
      >
        <div className="box has-text-centered">
          <p className="title is-4">Booster</p>
          <p className="title is-2">{discordData.boosterCount}</p>
        </div>
      </animated.div>

      <animated.div style={{ ...slideIn}}
        className="column is-three-quarters-mobile is-two-thirds-tablet is-half-desktop is-one-third-widescreen is-one-quarter-fullhd"
      >
        <div className="box has-text-centered">
          <p className="title is-4">Staff</p>
          <p className="title is-2">{discordData.membersWithRole}</p>
        </div>
      </animated.div>

      <animated.div style={{ ...slideIn}}
        className="column is-three-quarters-mobile is-two-thirds-tablet is-half-desktop is-one-third-widescreen is-one-quarter-fullhd"
      >
        <div className="box has-text-centered">
          <p className="title is-4">Active Member</p>
          <p className="title is-2">{discordData.activeMembers}</p>
        </div>
      </animated.div>
    </div>
  );
};

export default Planner;
