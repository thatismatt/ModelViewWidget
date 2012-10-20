
$.get('mvw.js', function (raw) {
    var lines =
        $(raw.split('\n'))
            .map(function(i, l) { if (l.length === 0) { l = ' '; } return l; })
            .toArray();
    var html =
        '<pre><div>' +
            lines.join('</div><div>') +
        '</div></pre>';
    $('#doc').html(html);
});

