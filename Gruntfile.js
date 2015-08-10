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
                        'manifest.json',
                        'popup.html'
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
