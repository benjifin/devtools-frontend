// Copyright 2019 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

const path = require('path');

// true by default
const COVERAGE_ENABLED = !process.env['NOCOVERAGE'];
const TEXT_COVERAGE_ENABLED = COVERAGE_ENABLED && !process.env['NO_TEXT_COVERAGE'];

// false by default
const DEBUG_ENABLED = !!process.env['DEBUG'];

const GEN_DIRECTORY = path.join(__dirname, '..', '..', '..');
const ROOT_DIRECTORY = path.join(GEN_DIRECTORY, '..', '..', '..');

const browsers = DEBUG_ENABLED ? ['Chrome'] : ['ChromeHeadless'];

const coverageReporters = COVERAGE_ENABLED ? ['coverage'] : [];
const coveragePreprocessors = COVERAGE_ENABLED ? ['coverage'] : [];
const commonIstanbulReporters = [{type: 'html'}, {type: 'json-summary'}];
const istanbulReportOutputs = TEXT_COVERAGE_ENABLED ? [{type: 'text'}, ...commonIstanbulReporters] : commonIstanbulReporters;

module.exports = function(config) {
  const options = {
    basePath: ROOT_DIRECTORY,

    files: [
      {pattern: path.join(__dirname, '**/*_test.js'), type: 'module'},
      {pattern: path.join(__dirname, '**/*_test.js.map'), served: true, included: false},
      {pattern: path.join(ROOT_DIRECTORY, 'test/unittests/**/*_test.ts'), served: true, included: false},
      {pattern: path.join(GEN_DIRECTORY, 'front_end/**/*.js'), served: true, included: false},
      {pattern: path.join(GEN_DIRECTORY, 'front_end/**/*.js.map'), served: true, included: false},
      {pattern: path.join(ROOT_DIRECTORY, 'front_end/**/*.ts'), served: true, included: false},
    ],

    reporters: [
      'dots',
      ...coverageReporters,
    ],

    browsers,

    frameworks: ['mocha', 'chai'],

    plugins: [
      require('karma-chrome-launcher'),
      require('karma-mocha'),
      require('karma-chai'),
      require('karma-sourcemap-loader'),
      require('karma-coverage'),
    ],

    preprocessors: {
      '**/*.js': ['sourcemap'],
      [path.join(GEN_DIRECTORY, 'front_end/**/*.js')]: [...coveragePreprocessors],
    },

    coverageReporter: {
      dir: 'karma-coverage',
      reporters: istanbulReportOutputs,
    },

    singleRun: !DEBUG_ENABLED,
  };

  config.set(options);
};
