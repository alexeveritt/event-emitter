module.exports = EventEmitter;

function EventEmitter() {
    this.events = [];

    this.findEvent = (key)=> {
        let foundItem = null;
        this.events.forEach(function(itm) {
            if (itm.key === key) {
                foundItem = itm;
            }
        });

        return foundItem;
    };

    this.removeEvents = (key, func)=> {
        let evts = this.events;
        if (typeof key === 'undefined') {
            // remove all the events
            return evts.splice(0, evts.length);
        }

        if (!func) {
            // remove all items associated with key
            for (let i = evts.length; i > -1; i--) {
                if (evts[i].key === key) {
                    evts.splice(i, 1);
                }
            }
        }

        let evt = this.findEvent(key);
        if (evt) {
            for (let i = evt.length - 1; i > -1; i--) {
                if (evt[i].func === func) {
                    evt.splice(i, 1);
                }
            }
        }
    };

    this.addEvent = (key, func, count) => {
        let evt = this.findEvent(key);
        if (!evt) {
            evt = {key: key, funcs: [], count: count};
            this.events.push(evt);
        } else {
            for (let i = 0; i < evt.funcs.length; i++) {
                if (evt.funcs[i].func === func) {
                    return;
                }
            }
        }

        evt.funcs.push(func);
    };
}

EventEmitter.prototype.on = function(key, func) {
    this.addEvent(key, func, 0);
};

EventEmitter.prototype.once = function(key, func) {
    this.addEvent(key, func, 1);
};

EventEmitter.prototype.many = function(key, func, count) {
    this.addEvent(key, func, count);
};

EventEmitter.prototype.emit = function(key) {
    let evt = this.findEvent(key);

    if (evt) {
        let args = null;
        if (arguments.length > 1) {
            args = [].splice.call(arguments, 0);
            args = args.splice(1);
        }

        for (let i = 0; i < evt.funcs.length; i++) {
            evt.funcs[i].apply(this, args);
        }

        if (evt.count > 0 && --evt.count === 0) {
            // remove event
            this.removeEvents(key);
        }
    }
};

EventEmitter.prototype.off = function(key, func) {
    this.removeEvents(key, func);
};

EventEmitter.prototype.offAll = function() {
    this.removeEvents();
};

EventEmitter.prototype.offKey = function(key) {
    this.removeEvents(key);
};
