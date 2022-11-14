import Sequelize, { DataTypes } from "sequelize";
import config from "../config";

export function model(sequelize) {
  const attributes = {
    quoteId: { type: DataTypes.CHAR(100), allowNull: false, primaryKey: true },
    approveAddress: { type: DataTypes.CHAR(50), allowNull: false },
    tokenAddress: { type: DataTypes.CHAR(50), allowNull: false },
    userAddress: { type: DataTypes.CHAR(50), allowNull: false },
    tokenAmount: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    chainId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isUsed: { type: DataTypes.BOOLEAN, defaultValue: false },
    requestID: { type: DataTypes.CHAR(100), allowNull: true },
    nonce: { type: DataTypes.CHAR(100), allowNull: true, defaultValue: "0" },
  };

  return sequelize.define(config.dataname_sql, attributes, {
    tableName: config.dataname_sql,
    indexes: [
      {
        fields: ["userAddress"],
      },
    ],
  });
}
var _db = {};

// connect to db
const sequelize = new Sequelize(config.database_sql, config.user_sql, config.password_sql, {
  host: config.host_sql,
  dialect: "mysql",
});
export async function initializeDB() {
  // init models and add them to the exported db object
  _db.model = await model(sequelize);
  await _db.model.sync();
}

export default _db;
