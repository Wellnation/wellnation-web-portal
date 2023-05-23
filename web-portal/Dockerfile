FROM node:14-alpine AS build

WORKDIR /app

COPY package.json ./package.json

RUN yarn install

COPY . /app

RUN yarn build

FROM node:14-alpine

WORKDIR /app

COPY --from=build /app/next.config.js ./
COPY --from=build /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next ./.next

COPY package*.json ./

RUN yarn install

ENV NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAj4ZrCjW4dadI3C3NqThB8PoYYEf74B6Q
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=wellnation-cc1b2.firebaseapp.com
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=wellnation-cc1b2
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=wellnation-cc1b2.appspot.com
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=311280251000
ENV NEXT_PUBLIC_FIREBASE_APP_ID=1:311280251000:web:7dd143d1dd4d48b0993d8d
ENV NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-3X5JZR2CW6
ENV NEXT_PUBLIC_FIREBASE_VAPID_KEY=BKIAhdxklewjAc294u-S6ny64gx2ivyWoeTDmiTE_XamlFqlILjyxmYJCAT3VIwJeDzd7YYZhUU0_1i9WRvfZZc
ENV NEXT_PUBLIC_GOOGLE_MAPS_KEY=AIzaSyAOjr36nWK1pfruFvU8w49Pb_BKZSmWlYk

USER root

EXPOSE 3000

CMD ["yarn", "start"]