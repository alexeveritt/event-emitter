var self;

module.exports = EventEmitter;

function EventEmitter() {
    self = this;
    self.events = [];
}

EventEmitter.prototype.on = function(key, func) {
    addEvent(key, func, 0);
};

EventEmitter.prototype.once = function(key, func) {
    addEvent(key, func, 1);
};

EventEmitter.prototype.many = function(key, func, count) {
    addEvent(key, func, count);
};

EventEmitter.prototype.emit = function(key, data) {
    var evt = findEvent(key);

    if (typeof evt !== 'undefined') {
        var args;
        if (arguments.length > 1) {
            args = [].splice.call(arguments, 0);
            args = args.splice(1);
        }

        for (var i = 0; i < evt.funcs.length; i++) {
            var func = evt.funcs[i];
            func.apply(self,args);
        }
        if (evt.count > 0 && --evt.count === 0) {
            // remove event
            removeEvents(key);
        }
    }
};

EventEmitter.prototype.off = function(key, func) {
    removeEvents(key, func);
};

EventEmitter.prototype.offAll = function() {
    removeEvents();
};

EventEmitter.prototype.offKey = function(key) {
    removeEvents(key);
};

function findEvent(key) {
    var foundItem;
    self.events.forEach(function(itm) {
        if (itm.key === key) {
            foundItem = itm;
        }
    });
    return foundItem;
}

function removeEvents(key, func) {
    var evts = self.events;
    if (typeof key === 'undefined') {
        // remove all the events
        return evts.splice(0, evts.length);
    }

    if (typeof func === 'undefined') {
        // remove all items associated with key
        for (var i = evts.length; i > -1; i--) {
            if (evts[i].key === key) {
                evts.splice(i, 1);
            }
        }
    }

    var evt = findEvent(key);
    if (typeof evt !== 'undefined') {
        for (var i = evt.length - 1; i > -1; i--) {
            if (evt[i].func === func) {
                evt.splice(i, 1);
            }
        }
    }
}

function addEvent(key, func, count) {
    var evt = findEvent(key);
    if (typeof evt === 'undefined') {
        evt = {key: key, funcs: [], count: count};
        self.events.push(evt);
    }
    else {
        for (var i = 0; i < evt.funcs.length; i++) {
            if (evt.funcs[i].func === func) {
                return;
            }
        }
    }

    evt.funcs.push(func);
}
