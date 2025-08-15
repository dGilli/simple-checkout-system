FROM node AS dev
WORKDIR /usr/src/app
COPY . .
RUN echo '#!/bin/sh\n\
    npm install; npm run -- dev --host "0.0.0.0" --port $1' > /usr/local/bin/dev \
    && chmod +x /usr/local/bin/dev

FROM dev AS build
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

