const mysql = require("mysql2");
const { dbHost, dbPort, dbUser, dbPassword, dbName } = require("../config");

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
        console.log(error);
        switch(error.errno) {
          case 1062:
            const match = error.sqlMessage.match(/^.+'(.+)'.+'.+\.(.+)_.+'$/);
            const value = match[1];
            const field = match[2];

            const message = `El ${field} '${value}' ya está en uso`;
            reject(message);
            break;
        }
        reject(error.sqlMessage);
      } else {
        resolve(result);
      }
    });
  });
};

const insert = async function(tableName, data) {
  try {
    const result = await query(`INSERT INTO ${tableName}(??) VALUES (?)`, [Object.keys(data), Object.values(data)]);
    console.log(result);
    return {data: {id: result.insertId, ...data}, success: true};
  } catch(error) {
    return {error, success: false};
  }
}

async function update(tableName, possibleFields, data, id) {
  try {
    const availableFields = possibleFields.filter(possibleField => data[possibleField]?.toString().trim());
    const escapedAssignationsExceed = availableFields.reduce((a, x) => `${a}??=?,`, "");
    const escapedAssignations = escapedAssignationsExceed.substring(0, escapedAssignationsExceed.length - 1);
    const assignationsData = availableFields.reduce((a, x) => [...a, x, data[x]], []);
    
    await query(`UPDATE ?? SET ${escapedAssignations} WHERE id=?`, [tableName, ...assignationsData, id]);
    return {
      success: true,
      message: "OK"
    }
  } catch(error) {
    console.log(error);
    return {
      success: false,
      message: error.sqlMessage
    }
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

module.exports = {query, insert, update, del};