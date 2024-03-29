FROM node:carbon-alpine

# Create app dir
WORKDIR /usr/src/eventer

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

# Compile typescript
RUN npm run-script compile

ENV PORT 3000
EXPOSE $PORT
CMD [ "npm", "start" ]