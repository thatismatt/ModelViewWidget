function TodoItems(items) {
    var self = this;

    mvw.ModelCollection(self);

    self.items = [];

    self.add = function(item) {
        item.isDone.subscribe(function(isDone) {
            self.trigger('item-done');
        });
        item.bind('destroy', function(item) {
            self.remove(item);
            self.trigger('remove');
        });
        self.items.push(item);
        self.trigger('add', item);
    };

    self.deleteCompleted = function() {
        self.each(function(model) {
            if (model.isDone()) {
                // asynchronously destroy the individual items
                setTimeout(model.destroy, 0);
            }
        });
    };

    function countTotalCompleted() {
        return self.count(function(model) { return model.isDone(); });
    }

    self.total = mvw.Observable(self.items.length);

    self.totalCompleted = mvw.Observable(countTotalCompleted());

    var updateTotal = function() {
        self.total(self.items.length);
    };

    var updateTotalCompleted = function() {
        self.totalCompleted(countTotalCompleted());
    }; 

    self.bind('add', updateTotal);
    self.bind('remove', updateTotal);
    self.bind('remove', updateTotalCompleted);
    self.bind('item-done', updateTotalCompleted);

    (function initialise() {
        mvw.utils.each(items, self.add);
    })();
}

function TodoItem(title, isDone) {
    var self = this;

    mvw.Model(self);

    self.isDone = mvw.Observable(!!isDone);
    self.title = mvw.Observable(title);

    self.destroy = function() {
        self.trigger('destroy', self);
    };
}

