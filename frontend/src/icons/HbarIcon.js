import React from "react";

const HBarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100"
    height="100"
    viewBox="0 0 100 100"
  >
    {/* Horizontal high bar */}
    <rect x="25" y="20" width="50" height="5" fill="var(--hover-color)" />

    {/* Vertical posts */}
    <rect x="30" y="25" width="5" height="50" fill="var(--hover-color)" />
    <rect x="65" y="25" width="5" height="50" fill="var(--hover-color)" />
  </svg>
);

export default HBarIcon;
