#!/bin/sh

cd /tmp; \
wget https://github.com/FabMo/FabMo-Engine/releases/download/v1.7.0/fabmo-consolidated-engine-1.7.0-updater-2.3.3.fmp; \
/fabmo/updater/hooks/linux/edison/do_fmu.sh /tmp/fabmo-consolidated-engine-1.7.0-updater-2.3.3.fmp

