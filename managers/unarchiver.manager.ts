import { join, parse } from "path";
import fs from "fs";

import tar from "tar-stream";
import zlib from "zlib";

class Unarchiver {
	private readonly _name: string;
	private readonly _path: string;

	public constructor(folder: string, name: string) {
		this._path = join(folder);
		this._name = name;
	}

	private readonly Delete = (path: string) => {
		const p = join(path);

		if (fs.statSync(p).isDirectory()) {
			const files = fs.readdirSync(p);

			for (const file of files) {
				this.Delete(join(p, file));
			}

			fs.rmdirSync(p);
		} else {
			fs.unlinkSync(p);
		}
	};

	private readonly CreateFile = (
		path: string,
		buffer: any,
		type: "file" | "folder" | "any" = "any"
	) => {
		if (parse(path).ext === "" && type !== "file") {
			if (fs.existsSync(path)) return;
			fs.mkdirSync(path);
		} else {
			fs.writeFileSync(path, buffer);
		}
	};

	public execute() {
		const folderPath = join(this._path, this._name);

		if (fs.existsSync(folderPath)) {
			this.Delete(folderPath);
		}

		fs.mkdirSync(folderPath);

		const extract = tar.extract();

		let latestFile: [string, string] = [ "", "" ];
		const datas: { [key: string]: string } = {};

		extract.on("entry", (data, stream, cb) => {
			stream.on("data", (buffer) => {
				const path = join(data.name.replace("package/", ""));
				const file = buffer.toString();
				
				if (latestFile[0] === path) {
					datas[path] += file;
				} else {
					datas[path] = file;
				};

				latestFile = [path, file];
			});

			stream.on("end", () => {
				cb();
			});

			stream.resume();
		});

		extract.on('finish', () => {
			for (const path in datas) {
				const file = datas[path];
				
				if (path.includes("\\")) {
					let fullPath = folderPath;
					const folders = path.split("\\");

					for (const folder of folders) {
						fullPath = join(fullPath, folder);
						this.CreateFile(fullPath, file);
					}
				} else {
					this.CreateFile(join(folderPath, path), file, "file");
				};
			};
		});

		setTimeout(() => {
			fs.createReadStream(join("./", this._name + ".tgz"))
				.pipe(zlib.createGunzip())
				.pipe(extract);
		}, 500);
	}
}

export default Unarchiver;
