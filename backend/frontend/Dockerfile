FROM node:20.17.0-alpine

#Create a app directory
WORKDIR /app
# Environment variables
ENV DB_HOST='db'                
ENV DB_PORT='3306'
ENV DB_USER='admin'
ENV DB_PASSWORD='1234'
ENV DB_NAME='pcbeedb'
ENV DB_CONNECTION_LIMIT=20

# Server ENV
ENV SERVER_PORT=5000
ENV NODE_ENV='dev'              
ENV HUSKY=0

#Install app dependencies
COPY package*.json ./

#Run npm install
RUN npm run install:docker

#Bundle app source
COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]