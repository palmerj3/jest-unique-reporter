// This reporter will keep track of unique test
// names (optionally with describe blocks)
// and fail tests if duplicates are found

const chalk = require('chalk');

const rootDir = process.cwd();

const cache = new Set();

class UniqueTestNames {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = Object.assign(
      {},
      {
        global: false,
        useFullName: false
      },
      options
    );
    this._shouldFail = false;
    this._duplicates = [];
  }

  getLastError() {
    if (this._shouldFail) {
      console.log(chalk.red(chalk.underline(chalk.bold('Duplicate test names found:'))));

      this._duplicates.forEach((d) => {
        console.log(chalk.red(chalk.bold('File: '), d.filename));
        console.log(chalk.red(chalk.bold('Title: '), d.title));
      });
      return new Error('Duplicate test names found');
    }

    return false;
  }

  onRunComplete(contexts, results) {
    results.testResults.forEach((suite) => {
      // Skip over skipped suites
      if (suite.skipped) return;

      const relativeTestFilePath = suite.testFilePath.replace(rootDir, '');

      // Skip over skipped tests
      // Title is always blank for these for some reason..
      const titles = suite.testResults
        .filter((t) => t.status !== 'pending')
        .map((t) => {

        const testStruct = {
          title: t.title,
          filename: relativeTestFilePath
        };

        let key = '';
        if (this._options.global) {
          if (this._options.useFullName) {
            // Unique describe->test across all files
            key = t.fullName;
          }

          // Unique test names across all files
          key = t.title;
        } else {
          if (this._options.useFullName) {
            // Unique describe->test per file
            key = `${relativeTestFilePath}-${t.fullName}`;
          }

          // Unique test name across per file
          key = `${relativeTestFilePath}-${t.title}`;
        }

        return Object.assign(
          {},
          testStruct,
          {
            key: key
          }
        );
      });

      // Check for duplicates
      titles.forEach((t) => {
        if (cache.has(t.key)) {
          this._shouldFail = true;
          this._duplicates.push(t);
        }

        cache.add(t.key);
      });
    });
  }
}

module.exports = UniqueTestNames;
