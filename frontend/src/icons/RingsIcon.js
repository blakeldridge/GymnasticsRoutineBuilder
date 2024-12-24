import React from "react";

const RingsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100"
    height="100"
    viewBox="0 0 100 100"
  >
    {/* Two hanging ropes */}
    <rect x="35" y="10" width="5" height="30" fill="var(--hover-color)" />
    <rect x="60" y="10" width="5" height="30" fill="var(--hover-color)" />

    {/* Rings */}
    <circle cx="37.5" cy="50" r="10" fill="none" stroke="var(--hover-color)" strokeWidth="5" />
    <circle cx="62.5" cy="50" r="10" fill="none" stroke="var(--hover-color)" strokeWidth="5" />
  </svg>
);

export default RingsIcon;
