# Use an official Node.js runtime as the base image
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci --production

# Copy the entire app to the working directory
COPY . .

# Expose the port on which your React app runs (default is 3000)
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]
