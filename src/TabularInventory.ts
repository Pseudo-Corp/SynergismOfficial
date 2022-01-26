/* June 05 2021
    To whomever is reading this:
        I'm experimenting with a form of 'inventory' system that may or may
        not be needed in singularity update. I might even need it in this update
        though unlikely.
        
    
    The specs of the tabular inventory are as follows 
        **Object oriented, and preferably boilerplate minimal
        -The tabular inventory should display (row * columns) different items at once, which may or may not be empty
        -Instances of 'items' should populate the top leftmost cell, and if the inventory is full trash the item
        -Ability to delete items, while keeping every other item in place.
        -Ideally, a way to 'sort' inventory which uses some priority (to be specified) and moves all
            items to the top left*/

// Current ideas:
//  For implementing items, it should be a separate class that is accepted by TabularInventory funcs 
//  We can actually make population an O(n) worst case task through ordering the inventory and tracking the lowest
//      unpopulated cell


export class TabularInventory {
    // Potential Idea: dynamic inventory size based on row, column var defined ?
    rows = 3;
    columns = 10;
    items: TabularItem[] = [];
    lowestPopulated = -1;

    constructor(preset?: [TabularItem]){
        let start = 0
        // If we're given a preset, of arbitrary length, set the first R*C items as preset value
        if (preset) {
            for (let i = 0; i < Math.min(this.rows * this.columns, preset.length); i++) {
                start += 1;
                this.items[i] = preset[i];
                if (preset[i] == NullItem && this.lowestPopulated === -1)
                    this.lowestPopulated = i;
            }
        }
        // If preset is shorter than rows * columns then you want to populate the rest with empty
        // I'm making this design ahead of time in case the inventory size changes.
        for (let i = start; i < this.rows * this.columns; i++) {
            if (this.lowestPopulated === -1)
                this.lowestPopulated = start;
            this.items[i] = NullItem;
        }
    }

    /**Deletes an instance of TabularItem from inventory at slot i, leaving behind a Null
     * Item which is not functional.
    */
    delete = (i: number) => {
        this.lowestPopulated = Math.min(this.lowestPopulated, i)
        this.items[i] = NullItem
    }

    /**If you have inventory space, create an instance of TabularItem to inventory at slot i, and determine
     * The next available space for later.
     */
    populate = (item: TabularItem) => {
        if (this.lowestPopulated < this.rows * this.columns)
            this.items[this.lowestPopulated] = item;
        
        let updatedPopulated = false;
        
        //We want to find the next lowest item that can be populated later.
        //(Note: this may be able to be made into O(1) though I'm insure -Platonic)
        for (let i = this.lowestPopulated + 1; i < this.rows * this.columns; i++) {
            if (this.items[i] == NullItem) {
                updatedPopulated = true;
                this.lowestPopulated = i;
                break;
            }
        }

        if (!updatedPopulated)
            this.lowestPopulated = this.rows * this.columns
    }

}

/* === Item properties ===
    Type: probably a number or string val
    Description: string lol
*/

export class TabularItem {
    type: number;
    description: string;
    constructor(type: number, description: string){
        this.type = type;
        this.description = description
    }
}

export const NullItem = new TabularItem(
    999,
    '')
