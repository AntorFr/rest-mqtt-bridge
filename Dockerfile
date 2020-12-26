FROM node:alpine

ENV TZ Europe/Paris
RUN apk update
RUN apk upgrade
RUN apk add ca-certificates && update-ca-certificates
# Change TimeZone
RUN apk add --no-cache --update tzdata

RUN apk add --no-cache --update \
    git \
    ca-certificates

# Clean APK cache
RUN rm -rf /var/cache/apk/*

# Home directory for mqtt application source code.
RUN mkdir -p /usr/src/node

WORKDIR /usr/src/mqtt

# Add node user so we aren't running as root.
RUN adduser -h /usr/src/mqtt -D -H mqtt \
    && chown -R mqtt:mqtt /usr/src/mqtt

USER mqtt

ADD https://api.github.com/repos/AntorFR/rest-mqtt-bridge/git/refs/heads/master version.json
RUN git clone git://github.com/AntorFr/rest-mqtt-bridge.git
COPY config.json /usr/src/mqtt/rest-mqtt-bridge/mqtt/

WORKDIR /usr/src/mqtt/rest-mqtt-bridge

RUN npm install

CMD ["npm", "start"]

#---------





