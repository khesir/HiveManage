# PC BEE Backend

This pc bee backend thats is dockerized backend and dockerized mysql database

## Requirements

Install these tech to make the project running

- [Node.js](https://www.npackd.org/p/org.nodejs.NodeJS64/20.9)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [VS Code](https://code.visualstudio.com/Download)

## Tech Stack

- [Nodejs](#) - Back-end Framework
- [Drizzle](#) - Object Relational Mapping (ORM) Tool
- [Mysql](#) - Database
- [Docker](#) - Containerization Tool
- [Git/Github](#) - Version Control

## Setup the application

1. Clone the repository
```
git clone
```
2. Fetch the updates
```
git fetch
```
3. Switch to a assigned branch, for example:
```
git checkout -b ems-payroll-create
```
4. Install library and dependencies
```
npm i
```
5. Start the database
```
npm run db:start
```
6. Add .env file
```
# Mysql Database ENV
DB_HOST='localhost'
DB_PORT='3306'
DB_USER='admin'
DB_PASSWORD='1234'
DB_NAME='pcbeedb'
DB_CONNECTION_LIMIT=20

# Server ENV
SERVER_PORT=5000
NODE_ENV = 'dev'
```
7. Update the database by the Drizzle migrations
```
npm run db:migrate
```
8. Run the application
```
npm run start:dev
```


Documentation: [click here](https://www.notion.so/PC-BEE-Backend-Documentation-89acde68cfa24dcc92192ed762b56dcd?pvs=4)