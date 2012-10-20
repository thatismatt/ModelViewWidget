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

var docTemplate = '{content} ';

$.get('mvw.js', function(raw) {
    var lines =
        raw.split('\n')
            .map(function(l, i) {
                return {
                    content: l,
                    number: i,
                    isDoc: isDocumentation(l),
                    isTitle: isTitle(l)
                };
            })
            .reduce(function(agg, v) {
                if (agg.isDoc !== v.isDoc) {
                    var s = [];
                    s.isDoc = v.isDoc;
                    agg.sections.push(s)
                    agg.isDoc = v.isDoc;
                }
                agg.sections[agg.sections.length - 1].push(v)
                return agg;
            }, { isDoc: false, sections: [] })
            .sections
            .map(function(s) {
                // TODO: handle doc titles
                var template = s.isDoc ? docTemplate : codeTemplate;
                var tag = s.isDoc ? 'div' : 'pre';
                return '<' + tag + ' class="' + (s.isDoc ? 'doc' : 'code') + '">' +
                            s.map(render(template)).join('') +
                       '</' + tag + '>';
            });
    $('#doc').html(lines.join(''));
});

})();

