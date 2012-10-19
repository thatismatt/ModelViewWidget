function TodoItems(items) {
    var self = this;

    CollectionModel(self);

    self.items = items || [];

    self.each(function(item) {
        item.isDone.subscribe(function(isDone) {
            self.trigger('item-done');
        });
        item.bind('destroy', function(item) {
            self.remove(item);
            self.trigger('remove');
        });
    });

    self.add = function(name) {
        var item = new TodoItem(name);
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

    self.total = self.observable(self.items.length);

    self.totalCompleted = self.observable(countTotalCompleted());

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
}

function TodoItem(title, isDone) {
    var self = this;

    Model(self);

    self.isDone = self.observable(!!isDone);
    self.title = self.observable(title);

    self.destroy = function() {
        self.trigger('destroy', self);
    };
}
