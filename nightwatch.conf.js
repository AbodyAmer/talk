const {
  ROOT_URL
} = require('./config');

const nightwatch_config = {
  src_folders: './test/e2e/specs/',
  output_folder: './test/e2e/tests_output',
  page_objects_path: './test/e2e/page_objects',
  globals_path: './test/e2e/globals',

  selenium : {
    start_process: false,
    host: 'hub-cloud.browserstack.com',
    port: 80
  },

  test_settings: {
    default: {
      launch_url: ROOT_URL,
      desiredCapabilities: {
        'browserstack.user': process.env.BROWSERSTACK_USER || 'coralproject2',
        'browserstack.key': process.env.BROWSERSTACK_KEY,
        'browserstack.local': true,
        'browserstack.debug': true,
        'browserstack.networkLogs': true,
        'browser': 'chrome',
      }
    }
  }
};

// Code to copy seleniumhost/port into test settings
for(const i in nightwatch_config.test_settings){
  const config = nightwatch_config.test_settings[i];
  config['selenium_host'] = nightwatch_config.selenium.host;
  config['selenium_port'] = nightwatch_config.selenium.port;
}

module.exports = nightwatch_config;
