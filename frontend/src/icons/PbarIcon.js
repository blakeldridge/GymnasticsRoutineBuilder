import React from "react";

const PBarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100"
    height="100"
    viewBox="0 0 100 100"
  >
    {/* Two horizontal bars */}
    <rect x="20" y="30" width="60" height="5" fill="var(--hover-color)" />
    <rect x="20" y="50" width="60" height="5" fill="var(--hover-color)" />

    {/* Vertical posts */}
    <rect x="25" y="35" width="5" height="30" fill="var(--hover-color)" />
    <rect x="70" y="35" width="5" height="30" fill="var(--hover-color)" />
  </svg>
);

export default PBarIcon;