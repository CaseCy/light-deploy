const config = require('../config')
const path = require('path')
const SSH = require('./util/ssh')
const configHandle = require('./util/confighandle')
const projectBuild = require('./util/projectBuild')
const compress = require('./util/compress')
const moment = require('moment');
let ext = ".tar.gz"

const buildConfig = {
    cmd: 'npm run build',
    path: ""
}

async function main() {
    let sshServer
    try {
        //变量初始化
        const activeConfig = configHandle.chooseConfig(config);
        const localConfig = activeConfig.local
        let outPutPath = path.join(localConfig.projectRootPath, localConfig.buildOutDir);
        buildConfig.path = activeConfig.local.projectRootPath;
        //项目编译，打包
        if (activeConfig.autoBuild) {
            if (activeConfig.local.buildCmdExePath) {
                buildConfig.path = activeConfig.local.buildCmdExePath;
            }
            console.log("开始进行项目构建，构建路径：", buildConfig.path, "执行的命令：", buildConfig.cmd)
            await projectBuild.build(buildConfig).then(({
                err,
                stdout,
            }) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log("构建结果：", stdout);
                console.log("构建结束")
            })
        }

        //文件压缩
        if (activeConfig.autoCompress) {
            console.log("开始执行文件压缩")
            const compressPath = path.join(buildConfig.path, activeConfig.local.buildOutDir);
            outPutPath = compressPath + ext;
            await compress.exe(compressPath, outPutPath).then(() => {
                console.log("压缩成功,文件路径");
            }).catch((e) => {
                console.log("压缩失败", e)
            });
        }

        //连接服务器
        sshServer = new SSH(activeConfig)
        await sshServer.connect();
        //文件上传
        const remoteAddr = path.basename(outPutPath);
        console.log("开始上传文件，本地地址：", outPutPath, "远程地址：~/" + remoteAddr)
        await sshServer.uploadFile(outPutPath, remoteAddr)
        //自动备份
        const remote = activeConfig.remote;
        if (activeConfig.autoBak) {
            console.log("开始自动备份,备份目录", remote.bakPath)
            await sshServer.exeCommand(`cp -r ${remoteAddr} ${reName(remote.bakPath,remoteAddr)}`).then(() => {
                console.log("备份成功")
            })
        }
        //部署
        if (activeConfig.autoCompress) {
            // await sshServer.exeCommand(`unzip -o -d ${remote.releasePath} ${remoteAddr} `).then(() => {
            //     console.log("部署成功")
            // }).catch(e => {
            //     console.log("部署时出错", e)
            // })
            await sshServer.exeCommand(`tar -zxf ${remoteAddr} -C ${remote.releasePath}`).then(() => {
                console.log("部署成功")
            }).catch(e => {
                console.log("部署时出错", e)
            })
        } else {
            await sshServer.exeCommand(`cp -r ${remoteAddr} ${path.posix.join(remote.releasePath,remoteAddr)}`, ).then(() => {
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