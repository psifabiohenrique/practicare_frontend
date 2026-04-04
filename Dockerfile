FROM node:20-alpine

WORKDIR /frontend

# Copy package files first for better layering
COPY package.json package-lock.json ./

# Install dependencies inside the container
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the default Vite port
EXPOSE 5173

# Start the dev server with --host to allow network access
CMD ["npm", "run", "dev", "--", "--host"]
