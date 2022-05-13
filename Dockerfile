FROM node:16-alpine

COPY . /code
WORKDIR /code

RUN mkdir /root/.config

ENTRYPOINT ["ash"]
