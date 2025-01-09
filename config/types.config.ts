export type SettingsKeys = "package_path" | "node_dir" | "libs";

export type Settings = {
	[key: string]: string | string[];

	package_path: string;
	node_dir: string;
	libs: string[];
};
