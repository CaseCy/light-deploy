import compress = require('../util/compress')

async function excute(compressPath: string, outPutPath: string) {
    console.log("开始执行文件压缩")
    try {
        await compress.exe(compressPath, outPutPath);
        console.log("压缩成功,文件路径", outPutPath);
    }
    catch (e) {
        console.log("压缩失败", e);
    }
}

export =  {
    excute
}