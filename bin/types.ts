import { Options as Yargs } from "yargs";

type Key = "config" | "node_dir" | "libs";

interface Settings {
	config: boolean;
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
