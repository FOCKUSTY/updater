import Unarchiver from "./unarchiver.manager";

import https from "https";
import fs from "fs";

class Downloader {
	private readonly _url: string;
	private readonly _name: string;
	private readonly _node_path: string;

	public constructor(url: string, name: string, node_path: string) {
		this._url = url;
		this._name = name;
		this._node_path = node_path;
	}

	public execute() {
		const file = fs.createWriteStream(this._name + ".tgz");

		https.get(this._url, (res) => {
			console.log("downloading...");
			res.pipe(file);

			file.on("finish", () => {
				console.log("downloaded!");
				file.close();

				new Unarchiver(this._node_path, this._name).execute();
			});
		});
	}
}

export default Downloader;
