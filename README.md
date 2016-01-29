# event-emitter
A simple javascript event emitter for use in the browser written with commonJS

I wrote this in about an hour to get a job done, so it's not fully tested at the moment and needs a bit of refactoring.
I will come back and clean up however I thought I'd share it in the meantime :)

```
var EventEmitter = require('./index');
var emitter=new EventEmitter();
emitter.on('start', function(msg){alert(msg)};);
emitter.emit('start', 'started');
```

Below is an example of how the EventEmitter can be inherited by another class

```
var EventEmitter = require('./index');
module.exports = car;
var self;

function car() {
    self = this;
    EventEmitter.apply(this, arguments)
    //  self.events = new EventEmitter();

}
car.prototype = Object.create(EventEmitter.prototype);
car.prototype.startCar = function() {
    self.emit('starting', 'car go broom broom!');
};
```
