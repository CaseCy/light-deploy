import { DeployConfig } from "../types"

const defaltConfig: DeployConfig = {
    name: "dev",
    ssh: {
        host: "127.0.0.1",
        username: "root"
    },
    build: {
        cmd: 'npm run build',
        path: undefined
    },
    autoBuild: false,
    autoCompress: false,
    autoBak: false,
    local: {
        projectRootPath: undefined,
        buildOutDir: 'dist',
    },
    remote: {
        // deleteBeforeDeploy: false,
        bakPath: undefined,
        releasePath: undefined,
        // releaseDir: 'dist'
    }
}

export = defaltConfig