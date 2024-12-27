export type SettingsKeys = "node_dir"|"name";

export type Settings = {
    [key: string]: string,
  
    node_dir: string,
    name: string
};