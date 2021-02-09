import { openHypercube } from '../Hypercubes';
import { openPlatonic } from '../PlatonicCubes';
import { openTesseract } from '../Tesseracts';
import { openCube } from '../Cubes';

/**
 * Exposes to the global scope.
 *      @see {openHypercube} 
 *      @see {openPlatonic}
 *      @see {openTesseract} 
 *      @see {openCube}
 */
export const main = () => {
    Object.defineProperties(window, {
        'openHypercube': {
            value: openHypercube
        },
        'openPlatonic': {
            value: openPlatonic
        },
        'openTeseract': {
            value: openTesseract
        },
        'openCube': {
            value: openCube
        }
    });
}
