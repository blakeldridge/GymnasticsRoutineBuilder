import React from "react";

import FloorIcon from '../icons/Floor.png';
import PommelIcon from '../icons/PommelHorse.png';
import RingsIcon from '../icons/Rings.png';
import VaultIcon from '../icons/Vault.png';
import PbarIcon from '../icons/ParallelBars.png';
import HbarIcon from '../icons/Hbar.png';

const getApparatusIcon = (apparatus, style) => {
    switch (apparatus) {
        case "Floor":
            return <img className={style} src={FloorIcon} />;
        case "Pommel Horse":
            return <img className={style} src={PommelIcon} />;
        case "Rings":
            return <img className={style} src={RingsIcon} />;
        case "Vault":
            return <img className={style} src={VaultIcon} />;
        case "Parallel Bars":
            return <img className={style} src={PbarIcon} />;
        case "High Bar":
            return <img className={style} src={HbarIcon} />;
        default:
            return null;
    }
};

export default getApparatusIcon;