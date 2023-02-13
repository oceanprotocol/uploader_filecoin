FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json yarn.lock ./

RUN yarn install --pure-lockfile


# copy env variable
COPY .env ./

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . ./
RUN yarn babel ./src --out-dir ./dist --copy-files

EXPOSE 8080

CMD ["yarn", "start"]
