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
        GOOGLE_CLIENT_ID: ' x ',
        GOOGLE_CLIENT_SECRET: ' x ',
        DEBUG: 'eventer:log eventer:debug',
        PORT: 3000
      },
      unit: {
        DB_URL: 'mongodb://localhost:27017/eventer_unit_test',
        NODE_ENV: 'unit-test'
      },
      integration: {
        NODE_ENV: 'integration-test',
        DB: 'mongo',
        DEBUG: 'eventer:log eventer:debug',
        EVENTER_URL: 'http://eventer.lexlabs.com:3000',
        DB_URL: 'mongodb://localhost:27017/eventer_integration_test'
      }
    },

    exec: {
      unit_test: 'npm test',
      integration_test: 'npm run-script integration-test',
      cover: 'npm run-script coverage',
      compile: 'tsc',
      start: 'npm start',
      db_cleanup: 'ts-node spec/integration/db.cleanup.ts'
    },

    express: {
      integration: {
        options: {
          script: './bin/www'
        }
      }
    },

    watch: {
      domain: {
        files: ['spec/**', 'src/**'],
        tasks: ['env:dev', 'env:unit', 'exec:unit_test', 'exec:compile']
      }
    }
  });

  grunt.registerTask('mongod', function() {
    const done = this.async();
    const mongodCmd = grunt.util.spawn(
      {
        cmd: 'mongod',
        args: ['--dbpath=data']
      },
      () => {}
    );
    mongodCmd.stdout.on('data', data => {
      if (data.toString().indexOf('waiting for connections') > 0) {
        grunt.log.write('> Started mongod and waiting for connections.\n');
        done();
      }
    });
  });

  grunt.loadNpmTasks('gruntify-eslint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-express-server');

  grunt.registerTask('unit_test', [
    'env:dev',
    'env:unit',
    'mongod',
    'exec:unit_test',
    'exec:db_cleanup'
  ]);
  grunt.registerTask('integration_test', [
    'env:dev',
    'env:integration',
    'mongod',
    'express:integration',
    'exec:integration_test',
    'exec:db_cleanup'
  ]);
  grunt.registerTask('integration_start', [
    'env:dev',
    'env:integration',
    'exec:start'
  ]);

  grunt.registerTask('cover', ['env:dev', 'exec:cover']);

  grunt.registerTask('default', ['mongod', 'watch:domain']);
};
