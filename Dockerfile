FROM node:alpine3.16

RUN apk update && apk add ffmpeg

RUN mkdir /work

WORKDIR /work

COPY api/build ./api

COPY web/build ./api/public

WORKDIR /work/api