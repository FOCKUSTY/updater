export type SettingsKeys = "node_dir" | "libs";

export type Settings = {
	[key: string]: string | string[];

	node_dir: string;
	libs: string[];
};
