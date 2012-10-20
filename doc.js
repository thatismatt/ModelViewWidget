(function() {

function isComment(l) {
    return l.trim().substring(0, 2) == '//';
}

function isTitle(l) {
    return l.indexOf('#') > -1;
}

function template(t) {
    return function(_, ctx) {
        var tmpl = t;
        for (var i in ctx) {
            tmpl = tmpl.replace('{' + i + '}', ctx[i])
        }
        return tmpl;
    };
}

var lineTemplate =
    '<div class="{cls}">' +
        '<div class="number">' +
            '{number}' +
        '</div>' +
        '<div class="content">' +
            '{content}' +
        '</div>' +
    '</div>';

$.get('mvw.js', function(raw) {
    var lines =
        $(raw.split('\n'))
            .map(function(i, l) {
                var cls = [];
                if (isComment(l)) {
                    cls.push('doc');
                    cls.push(isTitle(l) ? 'title' : 'line');
                }
                return {
                    cls: cls.join(' '),
                    content: l,
                    number: i
                };
            })
            .map(template(lineTemplate))
            .toArray();
    var html = '<pre>' + lines.join('') + '</pre>';
    $('#doc').html(html);
});

})();

