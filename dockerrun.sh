#!/bin/sh

docker build -t chatbot -f .docker/Dockerfile .
docker run -dt --name cb chatbot
docker exec -it cb sh -c "cd /workspaces/chatbot && npm start"
docker stop -t 0 cb
docker container rm cb