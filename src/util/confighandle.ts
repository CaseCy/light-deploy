import { Configuration } from "../types";
import defaultConfig = require('../default/DefaultConfig')

function chooseConfig(config: Configuration) {
    if (!config.active) {
        throw new Error("没有指定使用的配置")
    }
    const activeConfig = config.configuration.filter(v => v.name === config.active)[0]
    if (activeConfig) {
        const { global } = config
        if (global) {
            deepCopy(defaultConfig, global);
        }
        deepCopy(defaultConfig, activeConfig);
        return defaultConfig;
    }
    throw new Error("没有找到指定的配置");
}

function deepCopy(target: Object, source: Object) {
    for (let key in source) {
        if (typeof source[key] === "object") {
            target[key]
                ? deepCopy(target[key], source[key])
                : Object.defineProperty(target, key, source[key]);
            continue;
        }
        target[key] = source[key];
    }
}

export = {
    chooseConfig
}