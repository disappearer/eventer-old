module.exports = function(grunt) {
  grunt.initConfig({
    eslint: {
      options: {
        configFile: './eslintrc.json'
      },
      all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
    },

    env: {
      dev: {
        GOOGLE_CLIENT_ID: 'x'
      }
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
        tasks: ['env', 'exec:jasmine_ts']
      }
    }
  });

  grunt.loadNpmTasks('gruntify-eslint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('default', ['env', 'watch:domain']);
};
