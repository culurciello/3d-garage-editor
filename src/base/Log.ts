import { Game } from "@/Scenes/Game";

export default class Log {

    constructor(game: Game, enabled = true) {
        this.currentID = 0;
        this.logs = [];
        this.enabled = enabled;
    }

    push(log = {}) {
        if(!this.enabled) return;

        log.ID = ++this.currentID;
        this.logs.push(log);
    }

    /**
     * Simple log method to show what something is doing at moment
     * @param {*} what 
     */
    doing(what = '') {
        this.push({
            'doing': what
        });
    }

    getLast(quantity = 1) {
        return this.logs.slice(-quantity);
    }

    logLast(quantity = 1) {
        console.log(this.getLast(quantity));
    }

    get() {
        return this.logs;
    }

    log() {
        console.log(this.logs);
    }

    debug(data) {
        if(this.game.options.debugMode) {
            console.log('DEBUG LOG: ' + data);
        }
    }

    debugWarning(data) {
        if(this.game.options.debugMode) {
            console.warn('DEBUG LOG: ' + data);
        }
    }

    debugError(data) {
        if(this.game.options.debugMode) {
            console.error('DEBUG LOG: ' + data);
        }
    }

}