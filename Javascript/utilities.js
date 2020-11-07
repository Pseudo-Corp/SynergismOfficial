/**
 * This function calculates the smallest integer increment/decrement that can be applied to a number that is
 * guaranteed to affect the numbers value
 * @param {number} x
 * @returns {number} 1 if x < 2^53 and 2^ceil(log2(x)-53) otherwise
 */
function smallestInc(x = 0) {
    if (x < 2**53) {
        return 1;
    } else {
        return 2**Math.ceil(Math.log2(x)-53)
    }
}