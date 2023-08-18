import dotenv from 'dotenv';

dotenv.config();

const isFilecoinProduction = process.env.FILECOIN_PRODUCTION === 'true';

export default isFilecoinProduction
  ? {
      137: {
        currency: {
          USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          TUSD: '0x2eDf5B7A42B8D1be99d36F46a20e1eB12f054C78',
        },
        rpc: process.env.POLYGON_MAINNET_RPC,
        contract: 'POLYGON_MAINNET_CONTRACT_ADDRESS', // Needs to be added. See issue: https://github.com/oceanprotocol/dbs_filecoin/issues/27
      },
    }
  : {
      80001: {
        currency: {
          USDT: '0x742DfA5Aa70a8212857966D491D67B09Ce7D6ec7',
          USDC: '0x21C561e551638401b937b03fE5a0a0652B99B7DD',
          TUSD: '0x9aa7fEc87CA69695Dd1f879567CcF49F3ba417E2',
        },
        rpc: process.env.MUMBAI_RPC,
        contract: '0x0ff9092e55d9f6CCB0DD4C490754811bc0839866',
      },
    };
