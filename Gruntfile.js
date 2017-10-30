module.exports = function(grunt) {
  grunt.initConfig({
    eslint: {
      options: {
        configFile: './eslintrc.json'
      },
      all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
    },

    exec: {
      jasmine_ts: 'npm test'
    },

    express: {
      dev: {
        options: {
          script: './bin/www'
        }
      }
    },

    watch: {
      domain: {
        files: ['spec/**', 'src/**'],
        tasks: ['exec:jasmine_ts']
      }
    }
  });

  grunt.loadNpmTasks('gruntify-eslint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('default', ['watch:domain']);
};
