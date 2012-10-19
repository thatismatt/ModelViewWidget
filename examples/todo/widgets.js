function CrossOutableItem(crossedOut, text) {
    var self = this;

    mvw.Widget(self);

    self.$el = $('<div class="todo-item">');

    var editableText = new EditableText(text);

    var destroy = new ImageButton('destroy');
    destroy.bind('click', function() { self.trigger('destroy'); });

    var $checkbox = $('<input type="checkbox">');
    $checkbox.click(function() { crossedOut(!crossedOut()); });

    crossedOut.subscribe(function(isCrossedOut) {
        $checkbox.attr('checked', isCrossedOut);
        if (isCrossedOut) {
            self.$el.addClass('crossed-out');
        } else {
            self.$el.removeClass('crossed-out');
        }
    });

    self.$el.append($checkbox, editableText.$el, destroy.$el);
}

function AutoSubmitTextInput() {
    var self = this;

    mvw.Widget(self);

    self.$el = $('<form>');
    self.$el.css('display', 'inline');

    var $input = $('<input type="text"/>');

    self.$el.submit(function() {
        var val = $input.val();
        $input.val('');
        if (val.length > 0) {
            self.trigger('submit', val);
        }
        return false;
    });

    $input.keyup(function(evt) {
        if (evt.keyCode === 27) {
            self.trigger('cancel');
        }
    });

    $input.blur(function() {
        self.trigger('cancel');
    });

    self.text = function(val) {
        $input.val(val);
    };

    self.focus = function() {
        $input.focus();
    };

    self.$el.append($input, $('<input type="submit">').hide());
}

function EditableText(text) {
    var self = this;

    self.$el = $('<span>');

    var $text = $('<a>');

    var input = new AutoSubmitTextInput();

    input.$el.hide();

    input.bind('submit', function(val) {
        text(val);
        input.$el.hide();
        $text.show();
    });

    input.bind('cancel', function() {
        input.$el.hide();
        $text.show();
    });

    self.$el.dblclick(function() {
        input.text(text());
        $text.hide();
        input.$el.css('display', 'inline'); // can't use $().show() as that sets display to block which screws up our layout
        input.focus();
    });

    text.subscribe(function(val) {
        $text.text(val);
    });

    self.$el.append($text, input.$el);
}

function StatsWidget(total, totalCompleted) {
    var self = this;

    mvw.Widget(self);

    self.$el = $('<div>');

    var $total = $('<span id="total">');

    var $totalCompleted = $('<a id="total-completed">');

    total.subscribe(function(data) {
        $total.text(data + ' ' + mvw.utils.pluralize('task', data));
    });

    totalCompleted.subscribe(function(data) {
        $totalCompleted.text('Clear ' + data + ' completed ' + mvw.utils.pluralize('task', data) + '.');
        if (data > 0) {
            $totalCompleted.show();
        } else {
            $totalCompleted.hide();
        }
    });

    $totalCompleted.click(function() { self.trigger('delete-completed'); });

    self.$el.append($total, $totalCompleted);
}

function ActionsWidget() {
    var self = this;

    mvw.Widget(self);

    self.$el = $('<div>');

    var $markAllCompleted =
        $('<button>')
            .text('Completed')
            .click(function() { self.trigger('mark-all', 'completed'); });

    var $markAllUncompleted =
        $('<button>')
            .text('Uncompleted')
            .click(function() { self.trigger('mark-all', 'uncompleted'); });

    self.$el.append('Mark all: ', $markAllCompleted, $markAllUncompleted);
}

function ImageButton(cssClass) {
    var self = this;

    mvw.Widget(self);

    self.$el = $('<button>').addClass(cssClass);

    self.$el.click(function() {
        self.trigger('click');
    });
}
