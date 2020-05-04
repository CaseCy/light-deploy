import { Configuration } from "./types/Configuration"

const config: Configuration = {
    active: 'dev',
    configuration: [{
        name: 'dev',
        ssh: {
            host: "120.77.81.112",
            port: 33,
            username: "root",
            password: "qwer!@34",
        },
        build: {
            cmd: 'npm run build'
        },
        autoBuild: true,
        autoCompress: true,
        autoBak: true,
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
    }]
}

export = config