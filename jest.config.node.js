module.exports = {
    ...require('./jest.config'),
        testEnvironment: "node",
    testRegex: '/test/unit_n/.*\\.test\\.ts$',
}
/**
 * Setting the test env in the file did not work.
 * For now we use a separate config.
 * https://jestjs.io/docs/configuration#testenvironment-string
 */
