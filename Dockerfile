FROM node:10-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache yarn

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV HOST 0.0.0.0

ARG BRANCH
ENV NODE_ENV $BRANCH

RUN cd /usr/src/app/
COPY . .
RUN yarn
RUN cd components/AddToCalendar/src && npm install --production
RUN cd components/Calender && npm install --production
RUN cd components/conference-cal && npm install --production



RUN yarn build:ci
RUN rm -rf node_modules
RUN npm install --production


EXPOSE 3000

# start command
CMD [ "yarn", "start" ]
