module.exports = {
    default: {
        requireModule: ['ts-node/register'],
        require: ['features/step_definitions/**/*.ts', 'features/support/**/*.ts'],
        format: [
            'progress-bar',
            'summary',
            'progress',
            'html:reports/cucumber-report.html'
        ],
        paths: ['features/**/*.feature'],
        defaultTimeout: 30000
    }
}
