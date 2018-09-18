#!/bin/sh

wget https://github.com/FabMo/FabMo-Engine/releases/download/v1.7.0/fabmo-consolidated-engine-1.7.0-updater-2.3.3.fmp -O /opt/fabmo/fabmo-update.fmp; 

cd /tmp

echo "Creating fmu directory..."
rm -rf ./fmu
mkdir ./fmu

echo "Entering fmu directory..."
cd ./fmu

echo "Unpacking FMU: $1"
gunzip < $1 | tar -xvf -
rm -rf /opt/fabmo/fabmo-update.fmp

echo "Applying update..."
/bin/sh ./install
