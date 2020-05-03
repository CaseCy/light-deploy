module.exports = {
    active: 'dev',
    configuration: [{
        name: 'dev',
        ssh: {
            host: '172.16.21.123',
            port: 33,
            username: 'root',
            password: 'root',
        },
        autoBuild: false,
        autoCompress: true,
        autoBak: false,
        local: {
            projectRootPath: 'H:/web/ecma-test',
            buildOutDir: 'dist',
        },
        remote: {
            // deleteBeforeDeploy: false,
            bakPath: '~/bak',
            releasePath: '/netty-socket/web',
            // releaseDir: 'dist'
        }
    }],
    global: {}
}