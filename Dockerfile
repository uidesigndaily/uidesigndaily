# Base image
FROM node:14

# Work directory
WORKDIR /usr/uidesigndaily

# Install dependencies
COPY ./package*.json ./

RUN npm install

# Copy app source code
COPY ./ ./

RUN mkdir -p ./uploads/temp

# Set environment variables
ENV ENV_DOCKER='true'

ENV API_BASE='/api/v1/'

ENV DEFAULT_TIMEZONE='Europe/Helsinki'

ENV DATETIME_FORMAT='YYYY-MM-DDTHH:mm:ssZ'
ENV DATE_FORMAT='YYYY-MM-DD'
ENV TIME_FORMAT='HH:mm:ss'

ENV JWT_CONFIG_SESSION='false'
ENV JWT_CONFIG_SESSION_FAILWITHERROR='true'


ENV APP_DOMAIN='https://uidesigndaily.com'

# Start command
CMD [ "npm", "run", "start-server" ]

