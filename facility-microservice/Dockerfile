# Stage 1
FROM node:18.17-bookworm-slim as base


WORKDIR /app

COPY package.json ./

RUN npm install 
# --omit=dev

COPY . .

# Stage 2
# FROM gcr.io/distroless/nodejs18-debian11

# WORKDIR /app
# COPY --from=base /app /app

# USER nonroot
