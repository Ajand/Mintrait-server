## Overviw

First you need to run the server, then use the client repo to run the client app with the server api

[Client Repo](https://github.com/Ajand/Mintrait-client)
[Website](https://www.mintrait.com/)
[Video Demo](https://dorahacks.io/buidl/6360)

## Requirements

- Node.js
- Mongodb

## Running Server

    mv config.temp.js config.js

Then enter Mongodb connection URI

Then in the `src/nft-deployer/locklift.config.ts` edit this part:

    venom_devnet

Then

    npm install && npm run start

After this run the client repo
