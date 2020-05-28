import { Configuration } from "./types"

const config: Configuration = {
    active: 'dev',
    configuration: [{
        name: 'dev',
        local: {
            projectRootPath: 'D:/prd/ecma-test',
            buildOutDir: 'dist',
        },
        remote: {
            // deleteBeforeDeploy: false,
            bakPath: '~/bak',
            releasePath: '/netty-socket/web',
            // releaseDir: 'dist'
        }
    }],
    global: {
        autoBuild: true,
        autoCompress: true,
        autoBak: true,
        build: {
            cmd: 'npm run build'
        },
        ssh: {
            host: "172.16.3.33",
            port: 22,
            username: "root",
            password: "root",
        }
    }
}

export = config