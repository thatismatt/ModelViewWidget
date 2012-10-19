var mvw = {};

mvw.utils = {};
mvw.utils.pluralize = function(name, count) {
    return count === 1 ? name : name + 's';
};
mvw.utils.each = function(items, callback) {
    for (var i = 0; i < items.length; i++) {
        callback(items[i]);
    }
};

mvw.config = {};
mvw.config.debug = true;

mvw.log = function() {
    if (mvw.config.debug && console && console.log) {
        console.log.apply(console, arguments);
    }
};

function EventEmitter(self) {
    var events = {};

    self.trigger = function(identifier, data) {
        var es = events[identifier];
        mvw.log('trigger', this, arguments, es);
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

function Model(self) {
    EventEmitter(self);

    self.observable = function(initialValue) {
        var subscriptions = [];
        var observable = function(val) {
            if (val === undefined) {
                // get
                return observable.value;
            } else {
                // set
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
}

function CollectionModel(self) {
    Model(self);
    Collection(self);
}

function View(self) {
}

function ViewCollection(self) {
    View(self);
    Collection(self);
}

function Widget(self) {
    EventEmitter(self);
}

