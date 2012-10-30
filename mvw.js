// # Namespace declaration
var mvw = {};

// # Utils
mvw.utils = {};
// A simple function to pluralize string
mvw.utils.pluralize = function(name, count) {
    return count === 1 ? name : name + 's';
};

// # Configuration
mvw.config = {};
// Set debug to true to see log messages in the console
mvw.config.debug = true;

// A log function that obeys the config debug setting
mvw.log = function() {
    if (mvw.config.debug && window.console && window.console.log) {
        if (console.log.apply) {
            console.log.apply(console, arguments);
        } else {
            console.log(arguments);
        }
    }
};

(function() {

// # EventEmitter
// Call this function on an object to give it the bind() and
// trigger() methods. bind() is used to register a callback for
// a particular event, trigger() is used to invoke those callbacks
// for an event with an optional payload `data`.
function EventEmitter(self) {
    var events = {};

    self.trigger = function(identifier, data) {
        mvw.log('trigger', this, arguments);
        var es = events[identifier];
        if (es) {
            for (var i = 0; i < es.length; i++) {
                es[i](data);
            }
        }
    };

    self.bind = function(identifier, callback) {
        var callbacks = events[identifier] = events[identifier] || [];
        callbacks.push(callback);
    };
}

// # Collection
// A Collection is a wrapper around an array of items
// (e.g. Models or Views) that adds extra functionality.
// (`each()`, `filter()`, `map()`, `count()` and `remove()`)
function Collection(self) {
    self.each = function(userCallback, callback) {
        for (var i = 0; i < self.items.length; i++) {
            var item = self.items[i];
            var result = userCallback.call(self, item, i);
            if (callback) {
                callback(item, i, result);
            }
        }
    };

    self.filter = function(callback) {
        var results = [];
        self.each(callback, function(item, i, result) {
            if (result) {
                results.push(item);
            }
        });
        return results;
    };

    self.map = function(callback) {
        var results = [];
        self.each(callback, function(item, i, result) {
            results.push(result);
        });
        return results;
    };

    self.count = function(callback) {
        var results = 0;
        self.each(callback, function(item, i, result) {
            if (result) {
                results++;
            }
        });
        return results;
    };

    self.remove = function(itemToRemove) {
        self.items = self.filter(function(item) {
            return itemToRemove !== item;
        });
    };
}

// # Observable
// An Observable represents a function that wraps a value,
// you an retrieve the value by invoking the function with
// no arguments, or you can the value by invoking the function
// with the new value. `subscribe()` can be used to register
// a callback that will called with the new value when it changes.
function Observable(initialValue) {
    var subscriptions = [];
    var observable = function(val) {
        if (val === undefined) {
            // get
            mvw.log('observable', 'get', observable.value);
            return observable.value;
        } else {
            // set
            mvw.log('observable', 'set', val);
            observable.value = val;
            for (var i = 0; i < subscriptions.length; i++) {
                subscriptions[i](val);
            }
        }
    };
    observable.subscribe = function(callback) {
        subscriptions.push(callback);
        callback(observable.value);
    };
    observable(initialValue);
    return observable;
};

// # Model
// A model is just an EventEmitter.
function Model(self) {
    EventEmitter(self);
}

// # ModelCollection
// A ModelCollection is a collection of Models.
function ModelCollection(self) {
    Model(self);
    Collection(self);
}

// # View
// There is nothing special about a View.
function View(self) {
}

// # ViewCollection
// A ViewCollection is a collection of Views.
function ViewCollection(self) {
    View(self);
    Collection(self);
}

// # Widget
// A Widget is just an EventEmitter.
function Widget(self) {
    EventEmitter(self);
}

// Expose the public API
mvw.Model = Model;
mvw.ModelCollection = ModelCollection;
mvw.View = View;
mvw.ViewCollection = ViewCollection;
mvw.Widget = Widget;
mvw.Observable = Observable;

})();
