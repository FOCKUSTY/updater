import { Options as Yargs } from "yargs";

type Key = "config" | "node_dir" | "libs" | "package_path";

interface Settings {
	config: boolean;
	package_path: string;
	node_dir: string;
	libs: string[];
}
interface Options extends Yargs {
	name: string;
}
type AllOptions<data extends any = boolean | string | string[]> = Record<Key, data>;
interface Command {
	execute: (data: Settings) => void;
}

export { Options, AllOptions, Command, Key, Settings };
