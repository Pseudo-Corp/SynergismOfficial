import { player } from './Synergism';
import { Globals as G } from './Variables';

export const calculatePlatonicBlessings = () => {
    // The visual updates are handled in visualUpdateCubes()
    const platonicArray = Object.values(player.platonicBlessings);
    const DRThreshold = [4e6, 4e6, 4e6, 8e4, 1e4, 1e4, 1e4, 1e4]
    for (let i = 0; i < platonicArray.length; i++) {
        let power = 1;
        let mult = 1;
        if (platonicArray[i] >= DRThreshold[i]) {
            power = G['platonicDRPower'][i];
            mult *= Math.pow(DRThreshold[i], (1 - G['platonicDRPower'][i]));
        }

        G['platonicBonusMultiplier'][i] = 1 + mult * G['platonicCubeBase'][i] * Math.pow(platonicArray[i], power);
    }
}
