FROM node:18-alpine

# 1. Install OpenSSL (Required for Prisma to run on Alpine Linux)
RUN apk add --no-cache openssl

WORKDIR /app

# 2. Copy dependency files
COPY package*.json ./
COPY prisma ./prisma/ 

# 3. Install dependencies
RUN npm install

# 4. Generate Prisma Client 
# This creates the correct Linux-compatible binary inside the container
# RUN npx prisma generate

# 5. Copy source code
COPY . .

RUN npm run build

EXPOSE 4000

# Use a shell script or '&&' to run migrations before starting
CMD ["npm", "run", "start:dev"]