### 基于node的轻量级自动部署发布工具
已经加入vscode扩展，在vscode里搜索light-deploy，或者点击[这里]（https://marketplace.visualstudio.com/items?itemName=CononYc.Light-deploy）
## 使用方法
首先按照下文中的配置详情修改`config.ts`为自己的配置

如果没有安装typescript，先安装typescript
```npm
npm install -g typescript
```
安装依赖
```
npm install
```
将typescript编译为js，在vscode中也可以按ctrl+shift+b快速执行（ps：最好是鼠标选中左边的资源管理器再按，要不出来的是表情选择😂）
```
tsc -p .
```
执行
```
npm run deploy
```
## 目前支持的功能
- 自动构建
- 自动压缩（压缩方式tar.gz）
- 自动上传服务器备份（linux）
- 自动发布

## 目前支持配置
```json
{
	//开启的配置（和name对应）
	active: "dev",
	configuration: [{
		//配置名称
		name: "dev",
		//服务器连接配置（使用node-ssh），详细配置可以参看node-ssh配置，见附录
		ssh: {
			host: "172.16.5.33",
			port: 22,
			username: "root",
			password: "root",
		},
		//是否自动构建
		autoBuild: true,
		//构建配置
		build: {
			//执行的命令,默认是npm run build
			cmd: "npm run build",
			//默认是构建路径，如配置，优于构建路径
			path: ""
		},
		//是否自动压缩
		autoCompress: true,
		//是否自动备份
		autoBak: true,
		//本地配置
		local: {
			//构建输出的文件夹，相对于构建路径
			buildOutDir: "dist",
			//构建路径，可不填，默认是右键选择的地址，如果填了，优于右键选择地址
			projectRootPath: "",
		},
		//远程配置
		remote: {
			//备份路径
			bakPath: "~/bak",
			//发布路径
			releasePath: "/netty-socket/web",
		}
	}]
}
```
关于配置的几项说明
- 构建路径：构建开始的路径，默认使用projectRootPath，如果配置了build.path则优先
- 文件上传位置：目前默认是linux登录用户的个人文件夹，即`~`
## 附录
- ssh工具 [node-ssh](https://www.npmjs.com/package/node-ssh)
- 压缩工具 [archiver](https://www.npmjs.com/package/archiver)
- 时间格式化 [moment](https://www.npmjs.com/package/moment)