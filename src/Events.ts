// EventTarget is lacking.
import EventEmitter from 'eventemitter3';
import { SynergismEvents } from './types/Synergism';

export const Synergism = new EventEmitter<SynergismEvents>();