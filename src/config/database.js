const mysql = require("mysql2");
const { dbHost, dbPort, dbUser, dbPassword, dbName } = require("../config/.");

const connection = mysql.createConnection({
  host: dbHost,
  port: dbPort,
  user: dbUser,
  password: dbPassword,
  database: dbName
});

const query = function(sql, data) {
  return new Promise((resolve, reject) => {
    connection.query(sql, data, (error, result) => {
      if(error) {
        reject(error.sqlMessage);
      } else {
        resolve(result);
      }
    });
  });
};

const insert = async function(tableName, data) {
  try {
    await query(`INSERT INTO ${tableName}(??) VALUES (?)`, [Object.keys(data), Object.values(data)]);
    return {data, success: true};
  } catch(error) {
    return {error, success: false};
  }
}

const del = async function(tableName, id) {
  try {
    await query(`DELETE FROM ${tableName} WHERE id=?`, [id]);
    return {data, success: true};
  } catch(error) {
    return {error, success: false};
  }
}

module.exports = {query, insert, del};