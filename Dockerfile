FROM node:10-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache yarn

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV HOST 0.0.0.0

ARG BRANCH
ENV NODE_ENV $BRANCH

COPY . .
RUN yarn
RUN yarn build:ci
RUN rm -rf node_modules
RUN npm install --production
RUN echo $NODE_ENV

EXPOSE 3000

# start command
CMD [ "yarn", "start" ]
