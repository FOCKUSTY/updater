import yargs from "yargs";

import path from "path";
import fs from "fs";

import type {
    AllOptions,
    Command,
    Options,
    Key,
    Settings
} from "./types";

const usage = "\nUsage: fockupdater --node_dir \"./node_modules\" --libs [] to update";

const keys: Key[] = [
    "config",
    "libs",
    "node_dir"
];

const options: AllOptions<Options> = {
	"node_dir": {
		name: "D",
		alias: "node_dir",
		describe: "dir of node_modules",
		boolean: false,
		default: "./node_modules"
	},
	"libs": {
		name: "L",
		alias: "libs",
		describe: "your libs to update",
		boolean: false,
		default: "a,b,c"
	},
	"config": {
		name: "C",
		alias: "config",
		describe: "Config create",
		boolean: true,
		default: false
	}
};

const settings: any = yargs
	.usage(usage)
    .option(options.libs.name, options.libs)
    .option(options.node_dir.name, options.node_dir)
	.option(options.config.name, options.config)
    .argv;

class Listener {
	private readonly options: Settings = {
        config: options.config.default,
        node_dir: options.node_dir.default,
        libs: options.libs.default
    };

	public constructor() {
		this.init();
	}

	private readonly init = () => {
		for (const key of keys)
            (this.options as any)[key] = settings[key];

		this.execute();
	};

	private readonly execute = () => {
		const folderPath = path.join(__dirname, "commands");
		const folder = fs.readdirSync(folderPath);

		for (const fileName of folder) {
			const filePath = path.join(folderPath, fileName);
			const name = path.parse(filePath).name as Key;

			if (this.options.config && name !== "config") continue;

			const command: Command = new (require(`${filePath}`).default)();

			command.execute(this.options);
		}
	};
}

(() => {
	new Listener();
})();