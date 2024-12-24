import React from "react";

const VaultIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100"
    height="100"
    viewBox="0 0 100 100"
  >
    {/* Vault body */}
    <rect x="30" y="30" width="40" height="20" fill="var(--hover-color)" />

    {/* Legs */}
    <rect x="35" y="50" width="5" height="20" fill="var(--hover-color)" />
    <rect x="60" y="50" width="5" height="20" fill="var(--hover-color)" />
  </svg>
);

export default VaultIcon;
