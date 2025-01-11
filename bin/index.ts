#!/usr/bin/env node
import yargs from "yargs";

import ConfigCommand from "./commands/config";
import Start from "./commands/libs";

import type { AllOptions, Options, Key, Settings } from "./types";

const usage = '\nUsage: fockupdater update --libs "a,b,c" to update';

const keys: Key[] = ["config", "libs", "node_dir", "package_path"];

const options: AllOptions<Options> = {
	"package_path": {
		name: "P",
		alias: "package_path",
		describe: "path of package.json",
		boolean: false,
		default: "./package.json"
	},
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
		default: ""
	},
	"config": {
		name: "c",
		alias: "config",
		describe: "config create",
		boolean: true,
		default: false
	}
};

const settings: any = yargs
	.usage(usage)
	.version()
	.command("update", "start updating", (argv) => {
		argv
			.option(options.package_path.name, options.package_path)
			.option(options.libs.name, options.libs)
			.option(options.node_dir.name, options.node_dir);

		const ops: Settings = {
			package_path: (argv.argv as any).package_path || options.package_path.default,
			config: (argv.argv as any).config || options.config.default,
			node_dir: (argv.argv as any).node_dir || options.node_dir.default,
			libs: (argv.argv as any).libs || options.libs.default
		};

		new Start().execute(ops);

		return argv;
	})
	.option(options.config.name, options.config)
	.parse();

class Listener {
	private readonly _options: Settings = {
		package_path: options.package_path.default,
		config: options.config.default,
		node_dir: options.node_dir.default,
		libs: options.libs.default
	};

	private readonly _start: boolean;

	public constructor(start: boolean=true) {
		this._start = start;
		this.init();
	}

	private readonly init = () => {
		for (const key of keys) {
			(this._options as any)[key] = settings[key] || options[key].default;
		};

		if (this._start) this.execute();
	};

	private readonly execute = () => {
		if (this._options.config) {
			return new ConfigCommand().execute();
		}
	};

	public get options(): Settings {
		return this._options;
	}
}

(() => {
	new Listener();
})();
