# Description: Dockerfile for the WellNation web app

# Use the official Node.js 14.15.4 alpine3.12 image as a parent image
FROM node:14.15.4-alpine3.12

# debian image without node
# FROM debian:buster-slim

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Set environment variables
ENV NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAj4ZrCjW4dadI3C3NqThB8PoYYEf74B6Q
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=wellnation-cc1b2.firebaseapp.com
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=wellnation-cc1b2
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=wellnation-cc1b2.appspot.com
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=311280251000
ENV NEXT_PUBLIC_FIREBASE_APP_ID=1:311280251000:web:7dd143d1dd4d48b0993d8d
ENV NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-3X5JZR2CW6

# Expose port 3000
EXPOSE 3000

# Run the app
CMD [ "npm", "run", "build" ]