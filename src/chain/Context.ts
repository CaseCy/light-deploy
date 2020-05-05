import { Configuration, DeployConfig } from "../types/Configuration";
import SshServer = require("../util/ssh");

export class Context {
    config: Configuration;
    activeConfig: DeployConfig;
    sshServer: SshServer;
    outPutPath: string;
    remoteAddr: string;
}