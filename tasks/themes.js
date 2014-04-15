'use strict';


function trim(str) {
    return str.replace(/(^\s+|\s+$)/g, '').replace(/(\r\n|\n|\r)/g, '');
}


module.exports = function (grunt) {

    var src = 'dist/minicart.js';

    var tokens = {
        template: '$TEMPLATE$',
        styles: '$STYLES$'
    };

    grunt.registerTask('themify', 'Bundle the theme files into the JavaScript.', function () {
        var code, theme, template, styles, out, dest;

        code = grunt.file.read(src);
        theme = grunt.option('theme') || 'default';
        template = trim(grunt.file.read('src/themes/' + theme + '/index.html'));
        styles = trim(grunt.file.read('src/themes/' + theme + '/styles.css'));

        out = code.replace(tokens.template, template);
        out = out.replace(tokens.styles, styles);

        dest = (theme === 'default') ? src : 'dist/minicart.' + theme + '.js';

        grunt.file.write(dest, out);
        grunt.log.ok('Theme applied to ' + dest);
    });

};
