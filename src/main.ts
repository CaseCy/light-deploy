import config = require('./config')
import path = require('path')
import SSH = require('./util/ssh')
import configHandle = require('./util/confighandle')
import buildFlow = require('./flow/build-flow')
import compressFlow = require('./flow/compress-flow')
import moment = require('moment');
let ext = ".tar.gz"

let buildConfig = {
    cmd: 'npm run build',
    path: ""
}

async function main() {
    let sshServer: SSH
    try {
        //变量初始化
        const activeConfig = configHandle.chooseConfig(config);
        const local = activeConfig.local
        const remote = activeConfig.remote;
        const build = activeConfig.build;
        //打包文件所在目录
        let outPutPath = path.join(local.projectRootPath, local.buildOutDir);
        buildConfig.path = local.projectRootPath;
        //项目编译，打包
        if (activeConfig.autoBuild) {
            local.buildCmdExePath ? buildConfig.path = local.buildCmdExePath : "";
            build ? Object.assign(buildConfig, build) : "";
            await buildFlow.excute(buildConfig)
        }

        //文件压缩
        if (activeConfig.autoCompress) {
            const compressPath = path.join(buildConfig.path, activeConfig.local.buildOutDir);
            outPutPath = compressPath + ext;
            await compressFlow.excute(compressPath, outPutPath);
        }

        //连接服务器
        sshServer = new SSH({
            ...activeConfig.ssh
        })
        await sshServer.connect();
        //文件上传
        const remoteAddr = path.basename(outPutPath);
        console.log("开始上传文件，本地地址：", outPutPath, "远程地址：~/" + remoteAddr)
        await sshServer.uploadFile(outPutPath, remoteAddr)
        //自动备份
        if (activeConfig.autoBak) {
            console.log("开始自动备份,备份目录", remote.bakPath)
            await sshServer.exeCommand(`cp -r ${remoteAddr} ${reName(remote.bakPath, remoteAddr)}`).then(() => {
                console.log("备份成功")
            })
        }
        //部署
        if (activeConfig.autoCompress) {
            //压缩文件
            await sshServer.exeCommand(`tar -zxf ${remoteAddr} -C ${remote.releasePath}`).then(() => {
                console.log("部署成功")
            }).catch(e => {
                console.log("部署时出错", e)
            })
        } else {
            //文件夹
            await sshServer.exeCommand(`cp -r ${remoteAddr} ${path.posix.join(remote.releasePath, remoteAddr)}`).then(() => {
                console.log("部署成功")
            }).catch(e => {
                console.log("部署时出错", e)
            })
        }
    } catch (e) {
        console.log("构建时异常：", e);
    } finally {
        sshServer.disConnect();
    }
}

function reName(remotePath, fileName) {
    fileName = fileName + moment().format('YYYY_MM_DD_HH_mm_ss');
    console.log(remotePath, fileName)
    return path.posix.join(remotePath, fileName);
}

main();