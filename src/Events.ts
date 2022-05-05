// EventTarget is lacking.
import EventEmitter from 'eventemitter3';
import type { SynergismEvents } from './types/Synergism';

export const Synergism = new EventEmitter<SynergismEvents>();