

var path = require('path');

function getChromeOptions() {
    var chromeOptions = {
        args: ['--no-sandbox']
    };

    if (process.env.CHROME_BIN) {
        chromeOptions.binary = process.env.CHROME_BIN;
    }

    return chromeOptions;
}

var config = {
    allScriptsTimeout: 34000,
    baseUrl: 'http://localhost:9000',
    params: {
        baseBackendUrl: 'http://localhost:5000/api/',
        username: 'admin',
        password: 'admin'
    },

    suites: {
        a: path.join(__dirname, '/spec/**/[a-f]*[Ss]pec.js'),
        b: path.join(__dirname, '/spec/**/[g-m]*[Ss]pec.js'),
        c: path.join(__dirname, '/spec/**/[n-z]*[Ss]pec.js')
    },

    framework: 'jasmine2',
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 200000
    },

    capabilities: {
        browserName: 'chrome',
        chromeOptions: getChromeOptions()
    },

    directConnect: true,

    onPrepare: function() {
        require('./spec/helpers/setup')({fixture_profile: 'app_prepopulate_data'});

        // so it can be used without import in tests
        // useful when debugging on CI server
        browser.screenshot = require('./spec/helpers/utils').screenshot;

        var reporters = require('jasmine-reporters');

        jasmine.getEnv().addReporter(
            new reporters.JUnitXmlReporter({
                savePath: 'e2e-test-results',
                consolidateAll: true
            })
        );
        function CustomReporter() {
            this.specDone = function(result) {
                if (result.failedExpectations.length > 0) {
                    browser.screenshot(result.fullName.replace(/[^\w]+/g, '-'));
                }
            };
        }
        jasmine.getEnv().addReporter(new CustomReporter());
    }
};

exports.config = config;
