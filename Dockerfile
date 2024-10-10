# Use the lightweight node:18-alpine image
FROM node:18-alpine

# Install pnpm globally
RUN npm install -g pnpm

# Set the working directory
WORKDIR /usr/src/app

# Copy the project files into the container
COPY . .

# Install dependencies using pnpm
RUN pnpm install

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["pnpm", "start", "--", "--config", "./scripts/knexpresso.test.json", "--port", "3000"]
