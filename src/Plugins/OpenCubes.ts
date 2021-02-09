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
    Object.defineProperty(window, 'openHypercube', {
        value: openHypercube
    });
    Object.defineProperty(window, 'openPlatonic', {
        value: openPlatonic
    });
    Object.defineProperty(window, 'openTeseract', {
        value: openTesseract
    });
    Object.defineProperty(window, 'openCube', {
        value: openCube
    });
}