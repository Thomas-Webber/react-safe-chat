#!/usr/bin/env bash

npm run build .env.production
scp -i ~/.ssh/pakpak.pem ./build/* Dockerfile ubuntu@ec2-35-165-24-103.us-west-2.compute.amazonaws.com:/var/www/safechat/