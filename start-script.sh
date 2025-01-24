#!/bin/bash

yarn docker:up

npm install && cd frontend && npm install --legacy-peer-deps && wait-on tcp:3306 && yarn dev & 
frontend_pid=$!

npm install && cd backend && npm install --legacy-peer-deps && wait-on tcp:3306 && yarn dev & 
backend_pid=$!

wait $frontend_pid
wait $backend_pid

yarn docker:down
