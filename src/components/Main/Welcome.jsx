import React from "react";
import { useSelector } from "react-redux";
import { useSpring, animated } from "react-spring";

const Welcome = () => {
  const { user } = useSelector((state) => state.auth);

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    marginTop: "20px",
  };

  const titleSpring = useSpring({ opacity: 1, from: { opacity: 0 }, delay: 500 });
  const subtitleSpring = useSpring({ opacity: 1, from: { opacity: 0 }, delay: 1000 });

  return (
    <main className='main-container'>
    <div style={containerStyle}>
      <animated.h1 className="title" style={titleSpring}>
        Dashboard
      </animated.h1>
      <animated.h2 className="subtitle" style={{ ...subtitleSpring, fontSize: "16px" }}>
       Hii, <strong>{user && user.name}.</strong> Bagaimana kabarmu?
      </animated.h2>
    </div>
    </main>
  );
};

export default Welcome;
