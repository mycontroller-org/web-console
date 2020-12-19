#!/bin/bash

# build the project
yarn build

# create tar.gz file
tar czf console.tar.gz build/

# push it to remote machine
scp console.tar.gz root@mycontroller.online:/k8s-persistent-volumes/mc/mc2/

# remove it from local
rm console.tar.gz
