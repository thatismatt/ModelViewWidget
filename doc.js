(function() {

function isComment(l) {
    return l.trim().substring(0, 2) == '//';
}

function isTitle(l) {
    return l.indexOf('#') > -1;
}

$.get('mvw.js', function (raw) {
    var lines =
        $(raw.split('\n'))
            .map(function(i, l) {
                var type = isTitle(l) ? 'title' : 'line';
                return isComment(l)
                    ? '<div class="doc ' + type + '">' + l + '</div>'
                    : l;
            })
            .toArray();
    var html =
        '<pre><div>' +
            lines.join('</div><div>') +
        '</div></pre>';
    $('#doc').html(html);
});

})();

