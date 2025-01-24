#!/bin/bash

cleanup() {
  echo "Stopping the Docker container..."
  npm run docker:down
  kill $frontend_pid $backend_pid 2>/dev/null
  exit
}

# Trap SIGINT (Ctrl+C) and call the cleanup function
trap cleanup SIGINT

npm run docker:up

npm install && cd frontend && npm install --legacy-peer-deps && wait-on tcp:3306 && npm run dev & 
frontend_pid=$!

npm install && cd backend && npm install --legacy-peer-deps && wait-on tcp:3306 && npm run dev & 
backend_pid=$!

wait $frontend_pid
wait $backend_pid

cleanup
