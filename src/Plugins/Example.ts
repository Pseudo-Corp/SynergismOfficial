import { resetGame } from '../ImportExport';

/**
 * Exposes @see {resetGame} to the global scope.
 * <p>
 * This is an example plugin. If you are writing your own plugin, a function named ``main`` must be exported!
 * You can call other functions; modify variables; make style changes, etc.
 */
export const main = () => {
    Object.defineProperty(window, 'resetGame', {
        value: resetGame
    });
}