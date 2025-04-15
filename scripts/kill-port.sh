#!/bin/bash

# Script to kill process using port 5173 for React/Vite
PORT=5173
echo "Checking port $PORT..."

# For Linux/Mac
if command -v lsof > /dev/null; then
  pid=$(lsof -i :$PORT -t)
  if [ -n "$pid" ]; then
    echo "Found process $pid using port $PORT. Killing it..."
    kill -9 $pid
    echo "Process killed."
  else
    echo "No process found using port $PORT."
  fi
# For Windows
elif command -v netstat > /dev/null && command -v taskkill > /dev/null; then
  pid=$(netstat -ano | grep ":$PORT" | grep "LISTENING" | awk '{print $NF}')
  if [ -n "$pid" ]; then
    echo "Found process $pid using port $PORT. Killing it..."
    taskkill /F /PID $pid
    echo "Process killed."
  else
    echo "No process found using port $PORT."
  fi
else
  echo "Could not find lsof or netstat. Please install them to use this script."
  exit 1
fi

# Wait a moment to ensure port is freed
sleep 1