FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json yarn.lock ./

RUN yarn install --pure-lockfile


# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . ./
RUN yarn babel ./src --out-dir ./dist --copy-files

ENV DBS_URL="http://localhost"
ENV DBS_PING_IN_MINUTES="1"
ENV LOCATION_URL="127.0.0.1"
ENV PRIVATE_KEY="8837837383"
ENV LIGHTHOUSE_API_TOKEN="xyv02u242vfvvdgdv24874nnnnndg"
ENV DB_TYPE="sqlite"
ENV DB_STORAGE="/usr/src/app/db.sqlite3"
ENV RPC="http://locahost:8545"
EXPOSE 3000

CMD ["yarn", "start"]
