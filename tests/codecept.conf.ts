export const config: CodeceptJS.MainConfig = {
  tests: './*_test.ts',
  output: './output',
  helpers: {
    Puppeteer: {
      url: 'http://localhost:3010',
      show: !process.env.CI,
      windowSize: '1200x900'
    }
  },
  include: {
  },
  "gherkin": {
    "features": "./features/*.feature",
    "steps": [
      "./step_definitions/steps.ts"
    ]
  },
  name: 'tests'
}