
function isComment(l) {
    return l.trim().substring(0, 2) == '//';
}

$.get('mvw.js', function (raw) {
    var lines =
        $(raw.split('\n'))
            .map(function(i, l) { return l.length === 0 ? ' ' : l; })
            .map(function(i, l) { return isComment(l) ? '<div class="doc-line">' + l + '</div>' : l; })
            .toArray();
    var html =
        '<pre><div>' +
            lines.join('</div><div>') +
        '</div></pre>';
    $('#doc').html(html);
});

