// # Namespace declaration
var mvw = {};

// # Utils
mvw.utils = {};
mvw.utils.pluralize = function(name, count) {
    return count === 1 ? name : name + 's';
};

// # Configuration
mvw.config = {};
// Set debug to true to see log messages in the console
mvw.config.debug = true;

// A log function that obeys the config debug setting
mvw.log = function() {
    if (mvw.config.debug && console && console.log) {
        console.log.apply(console, arguments);
    }
};

(function() {

// EventEmitter
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

// Collection
function Collection(self) {
    var each = function(userCallback, callback) {
        for (var i = 0; i < self.items.length; i++) {
            var item = self.items[i];
            var result = userCallback.call(self, item, i);
            if (callback) {
                callback(item, i, result);
            }
        }
    };

    self.each = each;

    self.filter = function(callback) {
        var results = [];
        each(callback, function(item, i, result) {
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

// Observable
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

// Model
function Model(self) {
    EventEmitter(self);
}

// ModelCollection
function ModelCollection(self) {
    Model(self);
    Collection(self);
}

// View
function View(self) {
}

// ViewCollection
function ViewCollection(self) {
    View(self);
    Collection(self);
}

// Widget
function Widget(self) {
    EventEmitter(self);
}

// Expose
mvw.Model = Model;
mvw.ModelCollection = ModelCollection;
mvw.View = View;
mvw.ViewCollection = ViewCollection;
mvw.Widget = Widget;
mvw.Observable = Observable;

})();
