# PC BEE Backend
This pc bee backend thats is dockerized backend and dockerized mysql database

### Requirements
Install these tech to make the project running
- [Docker v27.0.3](https://www.docker.com/products/docker-desktop/)
- [Node.js v20.9.0](https://www.npackd.org/p/org.nodejs.NodeJS64/20.9)

### Instalation
Before you start the backend make sure you to follow these steps to make sure everything runs well.

**First step**, create a .env file. Message me for the .env variables.

For starters here's the sample
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=admin
DB_PASSWORD=letmein
DB_NAME=patientsdb
DB_CONNECTION_LIMIT=20
SERVER_PORT=5000
```
**Second step** is to end task your mysql instance in your computer. To do this, open your task manager and find mysql in your task manager and end task all of it.

**Third step**, go to the project root directory and run this command. This fetches the docker mysql image and run it as a docker container to serve as our mysql server
```
docker-compose up -d
```

**Additionally**, To open mysql terminal client use this command.
We can't open our old mysql because we end task it ofcourse, So use this
```
mysql -h localhost -P 3306 --protocol=tcp -uroot
```

After all of this you can now install all the dependencies and other packages that will be used to this project.
```
npm install
```

Then run the project
```
npm run start:dev
```


### As for the whole project documentation you can see it from here below


I have listed everything such as:
- Handling errors
- Techstack
- Dev ops (tools that we use in this project)
- API documentation
- Coding rules and guidelines

Documentation: [click here](https://www.notion.so/PC-BEE-Backend-Documentation-89acde68cfa24dcc92192ed762b56dcd?pvs=4)