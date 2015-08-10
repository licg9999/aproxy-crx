module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        src: 'src',
        tar: 'build',

        clean: ['<%=tar%>/'],

        copy: {
            build: {
                files: [{
                    expand: true,
                    cwd: '<%=src%>',
                    src: [
                        'libs/**/*', 
                        'imgs/**/*',
                        '**/*.html',
                        'manifest.json',
                        '!bower_components/**/*'
                    ],
                    dest: '<%=tar%>'
                }]
            }
        },

        cssmin: {
            build: {
                files: [{
                    expand: true,
                    cwd: '<%=src%>',
                    src: [
                        '**/*.css',
                        '!libs/**/*',
                        '!bower_components/**/*'
                    ],
                    dest: '<%=tar%>'
                }]
            }
        },

        uglify: {
            build: {
                files: [{
                    expand: true,
                    cwd: '<%=src%>',
                    src: [
                        '**/*.js',
                        '!libs/**/*',
                        '!bower_components/**/*'
                    ],
                    dest: '<%=tar%>'
                }]
            }
        },

        watch: {
            js: {
                files: ['<%=src%>/**/*.js'],
                tasks: ['uglify']
            },
            css: {
                files: ['<%=src%>/**/*.css'],
                tasks: ['cssmin']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['copy', 'cssmin', 'uglify']);

    grunt.registerTask('debug', ['default', 'watch']);
};
