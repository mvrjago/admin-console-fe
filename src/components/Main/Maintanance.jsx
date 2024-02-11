import React from "react";
import { useSpring, animated } from "react-spring";

const Maintanance = () => {

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    marginTop: "20px",
  };

  const titleSpring = useSpring({ opacity: 1, from: { opacity: 0 }, delay: 500 });

  return (
    <main className='main-container'>
    <div style={containerStyle}>
      <animated.h1 className="title" style={titleSpring}>
        UNDER MAINTANANCE
      </animated.h1>
    </div>
    </main>
  );
};

export default Maintanance;
