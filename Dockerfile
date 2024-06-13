FROM ubuntu:latest
LABEL authors="Daniil"

ENTRYPOINT ["top", "-b"]

# Use official Node.js image to build the Angular app
FROM node:14 as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["ng", "serve"]

