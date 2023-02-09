# Filecoin Migration Service

A microservice for uploading files to Lighthouse. To be used with
[Ocean Protocol Decentralized Storage Backend](https://github.com/oceanprotocol/decentralized_storage_backend).

## Endpoints

### getQuote

Description: Gets a quote in order to store some files

Path: POST /getQuote

Arguments:

```json
{
  "type": "filecoin",
  "files": [{ "length": 2343545 }, { "length": 2343545 }],
  "duration": 4353545453,
  "payment": {
    "chainId": 1,
    "tokenAddress": "0xUSDT_on_ETHERUEM"
  },
  "userAddress": "0x456"
}
```

Where:

- type: type of storage desired
- files : array with files length in bytes
- duration: how long to store this files (in seconds)
- payment.chainId: chainId that will be used to make the payment
- payment.token: token that will be used to make the payment
- userAddress: address from which payment is pulled

Returns:

```json
{
  "tokenAmount": 500,
  "approveAddress": "0x123",
  "chainId": 1,
  "tokenAddress": "0xUSDT_on_MAINNET",
  "quoteId": "xxxx"
}
```

Where:

- tokenAmount: tokenAmount that needs to be approved
- approveAddress: The address of the microservice that needs to be approved (microservice will do a transferFrom to get the payment)
- chainId: chainId used for payment
- tokenAddress: token that will be used to make the payment
- quoteId: backend server will generate a quoteId

### upload

Description: Upload some files

Path: POST /upload

Input:

```json
{
  "quoteId": "23",
  "nonce": 12345.12345,
  "signature": "0x2222",
  "files": ["ipfs://xxxx", "ipfs://yyyy"]
}
```

Microservice will upload files to filecoin and it will take the payment

Returns: `200 OK` if all the pre-checks pass. Upload occurs asynchronously.
Call `getStatus` to monitor status.

### getStatus

Description: Gets status for a job

Path: POST /getStatus?quoteId=xxx

Returns:

```json
{
  "status": 0
}
```

Where:

| Status | Status Description                                      |
| ------ | ------------------------------------------------------- |
| 0      | No such quote                                           |
| 99     | Waiting for files to be uploaded by the user            |
| 199    | Inadequate Balance or token Allowance given             |
| 300    | Uploading files to storage                              |
| 399    | CID migrated to lighthouse node, creating filecoin deal |
| 400    | Deal created on filecoin network                        |
| 401    | Upload failure                                          |

### getLink

Set Up

- Populate `.env` or environment variable using a sample from `.env.example`

```bash
export DBS_URL="https://google.com"
export LOCATION_URL="127.0.0.1" #publicly accessable url to this deployed instance or server
export PRIVATE_KEY="d211891bd0cd4b0e3d9dd759cfd9416c305beec61c5e5326f3a533a49de6e607" #privateKey of Approved vendor's Address
export TOKEN="xyvcdcdcddcdcdcd" #bearer token generated by Lighthouse to vendor
export DBS_PING_IN_MINUTES="1"  # interval to which the dbs service registers


# for mySQL:  Credentials
export DB_TYPE="mysql"
export USER_SQL="root"
export DATABASE_SQL="test"
export DATANAME_SQL="quote"
export HOST_SQL="127.0.0.1"
export PASSWORD_SQL="pass" #do not include if DB has no password

# for sqlite:  Credentials
export DB_TYPE="sqlite"
export DB_STORAGE="db/database.sqlite"

npm start
```

Run in Plain Node Environment

- Install dependencies

  `yarn install`

- Make production build with

  ` yarn build`

- Run build

  ` yarn start`

Run as Docker Image

- Build Docker image

  ` docker build -t filecoin_dbs .`

- Run Docker Image

  `docker run -d filecoin_dbs`
