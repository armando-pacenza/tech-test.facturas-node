FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

ENV DEBUG=app
ENV PORT 8084
ENV MYSQL_PORT 5000
ENV MYSQL_HOST pacho.com.ar
ENV MYSQL_USER root
ENV MYSQL_PASSWORD password
ENV MYSQL_DATABASE Facturas

EXPOSE 8080
CMD [ "node", "src/FacturasApp.js" ]