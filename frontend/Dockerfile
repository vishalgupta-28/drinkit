FROM node:20-alpine

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

# Install deps first so this layer caches across source changes
COPY package.json package-lock.json* ./
RUN npm install

COPY . .

# NEXT_PUBLIC_* vars are inlined at build time, so they must be present here
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_WS_URL
ARG NEXT_PUBLIC_GOOGLE_MAPS_KEY
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_WS_URL=$NEXT_PUBLIC_WS_URL \
    NEXT_PUBLIC_GOOGLE_MAPS_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_KEY

RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start"]
