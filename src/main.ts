import config = require('./config')
import path = require('path')
import SSH = require('./util/ssh')
import configHandle = require('./util/confighandle')
import { Context } from './chain/Context';
import { Deploychain } from './chain/DeployChain';
import { BuildExcutor, CompressExcutor, FileUploadExcutor, PublishExcutor, SSHConnectExcutor, BakExcutor } from './chain/Excutor'


async function run() {
    let sshServer: SSH;
    try {
        //初始化环境
        const activeConfig = configHandle.chooseConfig(config);
        const { local, ssh, autoBak, autoBuild, autoCompress } = activeConfig
        const outPutPath = path.join(local.projectRootPath, local.buildOutDir);
        const remoteAddr = path.basename(outPutPath);
        sshServer = new SSH({
            ...ssh
        })
        const context: Context = { activeConfig, config, sshServer, outPutPath, remoteAddr }
        await sshServer.connect();
        //执行链
        const deployChain = new Deploychain(context);
        autoBuild ? deployChain.addExcutor(new BuildExcutor()) : "";
        autoCompress ? deployChain.addExcutor(new CompressExcutor()) : "";
        deployChain.addExcutor(new SSHConnectExcutor());
        deployChain.addExcutor(new FileUploadExcutor());
        autoBak ? deployChain.addExcutor(new BakExcutor()) : "";
        deployChain.addExcutor(new PublishExcutor());
        await deployChain.run();
    } catch (e) {
        console.log("构建时异常：", e);
    } finally {
        if (sshServer) {
            sshServer.disConnect();
            console.log("ssh连接断开");
        }
    }

}

run();