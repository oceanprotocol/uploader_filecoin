# Filecoin Migration Service

Set Up 

- Populate `.env` or environment variable using a sample from `.env.example`


Run in Plain Node Environment

- Install dependencies 

    `
    yarn install 
    `
- Make production build with

    `
    yarn build
    `
- Run build 

    `
    yarn start
    `

Run as Docker Image

- Build Docker image

    `
    docker build -t filecoin_dbs .
    `
- Run Docker Image

    `
    docker run -d filecoin_dbs 
    `