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
                if (!agg.isDoc && v.isDoc) {
                    var s = { doc: [], code: [] };
                    agg.sections.push(s)
                }
                agg.sections[agg.sections.length - 1][v.isDoc ? 'doc' : 'code'].push(v)
                agg.isDoc = v.isDoc;
                return agg;
            }, { isDoc: false, sections: [] })
            .sections
            .map(function(s) {
                var doc = '<div class="doc">' + s.doc.reduce(renderDocs, '') + '</div>';
                // TODO: Remove empty trailing lines from code blocks
                var code = '<pre class="code">' + s.code.map(render(codeTemplate)).join('') + '</pre>';
                return '<div class="section">' + doc + code + '</div>';
            });
    $('#doc').html(lines.join(''));
});

})();

