import SSH = require("node-ssh");

interface Configuration {
    active: string;
    configuration: Array<DeployConfig>
}

interface DeployConfig {
    name: string;
    ssh: SSH.ConfigGiven;
    build?: BuildConfig;
    autoBuild: boolean;
    autoCompress: boolean;
    autoBak: boolean;
    local: LocalConfig;
    remote: RemoteConfig
}

interface BuildConfig {
    cmd?: string;
    path?: string
}

interface LocalConfig {
    buildCmdExePath?:string;
    projectRootPath: string;
    buildOutDir: string;
}

interface RemoteConfig {
    // deleteBeforeDeploy: false;
    bakPath: string;
    releasePath: string;
    // releaseDir: 'dist'
}