# UniFi Controller Backup Downloader

BEhind every new project there's a story. In this case, a user of a UniFi UDM (not me) managed to completely reset their UniFi Controller during an internet outage. As nobody (including myself) had cared to manually download at least the latest backup, many hours of configuration were lost.

Thus the idea to create a simple script to download UniFi Backups was born. And as most solutions proposed invoke SSH access to UDM or worse, I set out to create a solution that could -- eventually -- simply be run as a Docker container.
