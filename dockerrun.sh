#!/bin/sh

docker build -t wilson -f .docker/Dockerfile .
docker run -dt --name cb wilson
docker exec -it cb sh -c "cd /workspaces/wilson && npm start"
docker stop -t 0 cb
docker container rm cb