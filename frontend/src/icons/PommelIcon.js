import React from "react";

const PommelIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100"
    height="100"
    viewBox="0 0 100 100"
  >
    {/* Main rectangular body of the pommel horse */}
    <rect x="20" y="30" width="60" height="20" fill="var(--hover-color)" />

    {/* Two handles on top of the body */}
    <rect x="35" y="20" width="5" height="10" fill="var(--hover-color)" />
    <rect x="60" y="20" width="5" height="10" fill="var(--hover-color)" />

    {/* Diagonal legs */}
    <polygon points="25,50 35,50 30,70 20,70" fill="var(--hover-color)" />
    <polygon points="65,50 75,50 80,70 70,70" fill="var(--hover-color)" />
  </svg>
);

export default PommelIcon;
