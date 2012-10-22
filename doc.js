(function() {

function isDocumentation(l) {
    return l.substring(0, 2) == '//';
}

function isTitle(l) {
    return l.indexOf('#') > -1;
}

function render(t) {
    return function(ctx) {
        var tmpl = t;
        for (var i in ctx) {
            tmpl = tmpl.replace('{' + i + '}', ctx[i])
        }
        return tmpl;
    };
}

var codeTemplate =
    '<div class="line">' +
        '<div class="number">' +
            '{number}' +
        '</div>' +
        '<div class="content">' +
            '{content}' +
        '</div>' +
    '</div>';

function renderDocs(result, d) {
    var content = d.content.replace(/^\/\//, '');
    if (d.isTitle) {
        result += '<h3>' + content.trim().replace(/^#/, '') + '</h3>';
    } else {
        result += content;
    }
    return result;
}

function toId(filename) {
    return filename.replace(/\/|\./g, '-');
}

function parse(raw) {
    var sections = raw
        .replace(/\r\n/g,'\n').replace(/\r/g,'\n')
        .split('\n')
        .map(function(l, i) {
            return {
                content: l.replace(/\</g, '&lt;'),
                number: i,
                isDoc: isDocumentation(l),
                isTitle: isTitle(l)
            };
        })
        .reduce(function(agg, v) {
            if (agg.isFirst || (!agg.isDoc && v.isDoc)) {
                agg.isFirst = false;
                var s = { doc: [], code: [] };
                agg.sections.push(s)
            }
            agg.sections[agg.sections.length - 1][v.isDoc ? 'doc' : 'code'].push(v);
            agg.isDoc = v.isDoc;
            return agg;
        }, { isFirst: true, isDoc: false, sections: [] })
        .sections;
    return sections;
}

function renderSections(sections) {
    var lines = sections.map(function(s) {
            var doc = '<div class="doc">' + s.doc.reduce(renderDocs, '') + '</div>';
            if (s.code[s.code.length - 1].content.trim().length === 0) {
                s.code.pop();
            }
            var code = '<pre class="code">' + s.code.map(render(codeTemplate)).join('') + '</pre>';
            return '<div class="section">' + doc + code + '</div>';
        });
    return lines.join('');
}

function load(filename) {
    return $
        .get(filename)
        .then(parse)
        .then(renderSections);
}

var files = [
    { title: 'Library', files: ['mvw.js'] },
    { title: 'ToDo Example', files: ['models', 'views', 'widgets'].map(function(x) { return 'examples/todo/' + x + '.js'; }) }
];

var indexHtml = files.map(function(group) {
    return '<h3>' + group.title + '</h3>' +
        '<ul>' + group.files.map(function(f) { return '<li id="' + toId(f) + '"><a href="#">' + f + '</a></li>'; }).join('') + '</ul>';
});

var $root = $('#doc');
var $index = $('<div>')
    .html(indexHtml)
    .appendTo($root);

files.forEach(function(group) {
    group.files.forEach(function(file) {
        load(file).then(function(html) {
            var $title = $('<h3>' + file + '</h3>');
            var $nav = $('<div><a href="#">&lt; back</a></div>');
            $nav.find('a').click(function() {
                    $documentedCode.hide();
                    $index.show();
                    return false;
            });
            var $documentedCode = $('<div>')
                .append($nav)
                .append($title)
                .append(html)
                .hide()
                .appendTo($root);
            $index
                .find('#' + toId(file) + ' a')
                .click(function() {
                    $index.hide();
                    $documentedCode.show();
                    return false;
                });
        });
    });
});

})();

