# UniFi Controller Backup Downloader

Behind every new project there's a story. In this case, a user of a UniFi UDM (not me) managed to completely reset their UniFi Controller during an internet outage. As nobody (including myself) had cared to manually download at least the latest backup, many hours of configuration were lost.

## Why this project

Thus the idea to create a simple script to download UniFi Backups was born. And as most solutions proposed invoke SSH access to UDM or require you to hand over UniFi Controller Administrator credentials, I set out to create a solution that could -- eventually -- simply be run as a Docker container.

## Prerequsites on your UniFi Controller

In order for the script to be successful, you must either have or create a user with Administrator rights as only admins can download the Backup files. Furthermore, you have either manual backups or automatic backups configured.

## How to run

There are two ways to run this project:

- download locally, build with `yarn`, set the environment and just run it, or
- use the Docker container from the GitHub Docker registry.

### Run locally

First, checkout the code, and define your credentials in a `.env` file:

```lang=env
# .env file
UNIFI_USERNAME=<username> 
UNIFI_PASSWORD=<password> 
UNIFI_URL=<your_unifi_controller> 
# Set the backup location if needed (otehrwise, it's the current directory)
# BACKUP_LOCATION=<path for backup files>
```

Then, build it as follows:

```lang=bash
yarn install && yarn build && yarn node dist/index.js 
```

The script will either load the `.env` file or the environment variables from the environment.

### Docker

To run it with Docker is as easy as follows (I might add support for secrets at some point, at least by mapping one `secrets` file to the `.env` file in the container):

```lang=bash
docker run -e UNIFI_USERNAME=<username> -e UNIFI_PASSWORD=<password> -e UNIFI_URL=<your_unifi_controller> -v ./backups:/backups ghcr.io/johannrichard/unifi-backup/unifi-controller-backup
```

If successful, the script will download the latest Controller Backup file and store it in the location you mapped to `/backups`.

### Caveats

Your UniFi Controller most probably lives on a different port than the standard HTTPS one (`443`). It is therefore necessary to specify the full URL, including the port for `UNIFI_URL`:

```lang=shell
UNIFI_URL=https://my-unifi:8443
```

### Credits

Big thanks to `@thib3113` for his wonderful [`unifi-client`](https://github.com/thib3113/unifi-client) `node.js` library. With it, programming this was a breeze. It took me longer to create a proper build system and the Dockerfile than to write the code itself.
