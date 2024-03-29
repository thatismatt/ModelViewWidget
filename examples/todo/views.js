function TodoListView($el, model) {
    var self = this;
    mvw.ViewCollection(self);
    self.items = model.items;
    self.each(function(model) {
        new TodoItemView($el, model);
    });
    model.bind('add', function(item) {
        new TodoItemView($el, item);
    });
}

function TodoItemView($el, model) {
    mvw.View(this);
    var widget = new CrossOutableItem(model.isDone, model.title);
    $el.append(widget.$el);
    model.bind('destroy', function() {
        widget.$el.remove();
    });
    widget.bind('destroy', model.destroy);
}

function CreateView($el, model) {
    mvw.View(this);
    var widget = new AutoSubmitTextInput();
    widget.bind('submit', function(name) {
        model.add(new TodoItem(name));
    });
    $el.append(widget.$el);
}

function StatsView($el, model) {
    mvw.View(this);
    var widget = new StatsWidget(model.total, model.totalCompleted);
    widget.bind('delete-completed', model.deleteCompleted);
    $el.append(widget.$el);
}

function ActionsView($el, model) {
    mvw.View(this);
    var widget = new ActionsWidget();
    widget.bind('mark-all', function(action) {
        var isDone = action === 'completed';
        model.each(function(m) { m.isDone(isDone); });
    });
    $el.append(widget.$el);
}
