module.exports = function(grunt) {
  grunt.initConfig({
    eslint: {
      options: {
        configFile: './eslintrc.json'
      },
      all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
    },

    env: {
      test: {
        SRC: __dirname + '\\src'
      }
    },

    jasmine_nodejs: {
      options: {
        useHelpers: true,
        // global helpers, available to all task targets. accepts globs..
        helpers: [],
        random: false,
        seed: null,
        defaultTimeout: null, // defaults to 5000
        stopOnFailure: false,
        traceFatal: true,
        // configure one or more built-in reporters
        reporters: {
          console: {
            colors: true, // (0|false)|(1|true)|2
            cleanStack: 1, // (0|false)|(1|true)|2|3
            verbosity: 4, // (0|false)|1|2|3|(4|true)
            listStyle: 'indent', // "flat"|"indent"
            activity: false
          }
        },
        customReporters: []
      },
      test: {
        options: {
          useHelpers: true
        },
        specs: ['test/**/*.spec.js'],
        helpers: ['test/helpers/**/*.helper.js']
      }
    },

    watch: {
      all: {
        files: ['test/**', 'src/**'],
        tasks: ['eslint', 'env', 'jasmine_nodejs']
      }
    }
  });

  grunt.loadNpmTasks('gruntify-eslint');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-jasmine-nodejs');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('test', ['eslint', 'env', 'jasmine_nodejs']);
  grunt.registerTask('default', ['watch']);
};
