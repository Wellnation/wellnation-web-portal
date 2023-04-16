FROM node:14-alpine as build

RUN apk update
RUN apk --no-cache --virtual build-dependencies add \
  jpeg-dev \
  cairo-dev \
  giflib-dev \
  pango-dev \
  python3 \
  make \
  g++

WORKDIR /app

COPY . /app

RUN npm ci

RUN npm run build

FROM node:14-alpine AS runner

WORKDIR /app

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=build /app/next.config.js ./
COPY --from=build /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

ENV NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAj4ZrCjW4dadI3C3NqThB8PoYYEf74B6Q
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=wellnation-cc1b2.firebaseapp.com
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=wellnation-cc1b2
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=wellnation-cc1b2.appspot.com
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=311280251000
ENV NEXT_PUBLIC_FIREBASE_APP_ID=1:311280251000:web:7dd143d1dd4d48b0993d8d
ENV NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-3X5JZR2CW6

USER root

EXPOSE 3000

CMD ["npm", "run", "start"]