import { Controller, dateISOString, timestampDate } from "unifi-client";
import * as Fs from "fs";
import * as Path from "path";
import * as dotenv from "dotenv";

// Load .env file
dotenv.config();

interface Backup {
  controller_name: string;
  filename: string;
  type: string;
  version: string;
  time: timestampDate;
  datetime: dateISOString;
  format: string;
  days: number;
  size: number;
}
// create main function to deal with async/await
async function main() {
  const controller = new Controller({
    username: process.env.UNIFI_USERNAME || "ubnt",
    password: process.env.UNIFI_PASSWORD || "ubnt",
    url: process.env.UNIFI_URL || "https://unifi",
    strictSSL: false,
  });
  await controller.login();

  // retrieve sites
  const sites = await controller.getSites();

  //work on one site
  // select the site "default"
  const site = sites.find((site) => site.name === "default");

  //call my url
  if (site) {
    const backups = await site.getInstance().post("/cmd/backup", {
      cmd: "list-backups",
    });
    const data: Array<unknown> = backups.data.data;
    let lastBackup: Backup = {} as Backup; // TODO: brush up
    let time = 0;
    if (data.length) {
      data.forEach(function (v) {
        const backup = v as Backup;
        if (backup.time && backup.time > time) {
          lastBackup = v as Backup;
          time = backup.time;
        }
      });

      if (lastBackup) {
        console.log(`Downloading latest backup ${lastBackup.datetime}`);
        // console.log(backup);
        const path = Path.resolve(
          process.env.BACKUP_LOCATION || __dirname,
          lastBackup["filename"]
        );
        const writer = Fs.createWriteStream(path);
        const backupFile = await controller
          .getInstance()
          .get("/dl/autobackup/:backup", {
            urlParams: {
              backup: lastBackup["filename"],
            },
            responseType: "stream",
          });

        console.log(`Write backup: ${path.toString()}`);
        backupFile.data.pipe(writer);

        await new Promise((resolve, reject) => {
          writer.on("finish", resolve);
          writer.on("error", reject);
        });
      }
    }
  }
}

//just run the async main, and log error if needed
main().catch((e) => console.error(e));
