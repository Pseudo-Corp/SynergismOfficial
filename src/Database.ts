import Dexie, { Table } from 'dexie';
import { player } from './Synergism';

interface SynSave {
    id?: number
    name: string
    date: Date
    save: string
}

class SynergismDB {
    DB = new Dexie('SynergismSaves');
    // https://dexie.org/docs/Dexie/Dexie.table()
    // storing a reference is alright
    TABLE: Table<SynSave>;

    constructor() {
        // https://dexie.org/docs/Version/Version.stores()
        // "A rule of thumb: Are you going to put your property in a where(‘…’) clause? If yes, index it, if not, dont"
        this.DB.version(1).stores({
            saves: '++id, name, date'
        });
        
        this.TABLE = this.DB.table('saves');
    }   

    /**
     * Migrates save from localStorage to IndexedDB
     */
    async migrate() {
        const item = localStorage.getItem('Synergysave2');
        if (!item) {
            console.log('All good; migrated');
            return true;
        }

        this.insert({
            name: player.saveString,
            date: new Date(),
            save: item
        });

        localStorage.setItem('migratedv2.5.0', item);
        localStorage.removeItem('Synergysave2');
    }

    /** Insert a save into the DB */
    async insert(save?: Omit<SynSave, 'id'>) {
        if (!save) {
            const p = { ...player, codes: Array.from(player.codes) };

            save ??= {
                name: p.saveString,
                date: new Date(),
                save: btoa(JSON.stringify(p))
            };
        }

        const idx = await this.TABLE.add(save);
        await this.removeOld(idx as number);
        return idx;
    }

    /*** Remove old saves (max: 20) */
    async removeOld(id: number) {
        const toDelete = await this.TABLE
            .where('id')
            .below(id - 20)
            .keys();

        return this.TABLE.bulkDelete(toDelete);
    }

    /** Remove all saves */
    async deleteAll() {
        const t = (await this.TABLE.toArray()).map(({ id }) => id);
        return this.TABLE.bulkDelete(t);
    }

    async getLatest() {
        return this.TABLE
            .limit(1)
            .last();
    }
}

export const db = new SynergismDB();

Object.defineProperty(window, 'db', { value: db });