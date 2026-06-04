// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular/cli'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular/cli/plugins/karma')
    ],
    client:{
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, 'coverage'),
      reports: [ 'html', 'lcovonly', 'text-summary' ],
      fixWebpackSourcePaths: true,
      // Declarative/config files carry framework metadata, not testable logic,
      // so they are kept out of the coverage denominator.
      'report-config': {
        html: { subdir: 'html' }
      },
      thresholds: {
        emitWarning: false,
        global: {
          statements: 90,
          lines: 90,
          branches: 90,
          functions: 90
        }
      }
    },
    angularCli: {
      environment: 'dev'
    },
    // 'kjhtml' (jasmine HTML reporter) is intentionally omitted: it manipulates the
    // live DOM and throws under headless Chrome. Use the interactive `ng test` for it.
    reporters: ['progress', 'coverage-istanbul'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu']
      }
    },
    singleRun: false
  });
};
