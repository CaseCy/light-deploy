import projectBuild = require('../util/projectBuild')
import { BuildConfig } from '../types/Configuration';

function excute(buildConfig: BuildConfig) {
    console.log("开始进行项目构建，构建路径：", buildConfig.path, "执行的命令：", buildConfig.cmd)
    return projectBuild.build(buildConfig).then(({
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

export = {
    excute
}