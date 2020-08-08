/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable no-trailing-spaces */

const debug = require('debug')('app');
const mysql = require('mysql');
const chalk = require('chalk');

function FacturaModel() { // FacturaModel es un nombre interno solo se usa en el module.exports
  function getMysqlConnection(callbackResult) {
    const mySqlPort = process.env.MYSQL_PORT || 3306;
    const mySqlHost = process.env.MYSQL_HOST || 'localhost';
    const mySqlUser = process.env.MYSQL_USER;
    const mySqlPassword = process.env.MYSQL_PASSWORD;
    const mySqlDatabase = process.env.MYSQL_DATABASE;
    const connection = mysql.createConnection({
      port: mySqlPort,
      host: mySqlHost,
      user: mySqlUser,
      password: mySqlPassword,
      database: mySqlDatabase
    });

    connection.connect((err) => {
      if (err) {
        debug(chalk.bgRed.black('ERROR en connect: ') + err.message);
        const error = err;
        error.httpStatus = 500;
        callbackResult(error, null);
        return;
      }
      debug('Connected to Database Ok.');
    });

    return connection;
  }

  function closeMysqlConnection(connection) {
    connection.end((err) => {
      if (err) {
        console.err(chalk.bgRed.black('ERROR:') + err.message); // error en cierre de conexion informo por consola y devuelvo el resultado.
        return;
      }
      debug('Close the database connection.');
    });
  }

  function executeSql(sql, params, callbackResult) {
    const connection = getMysqlConnection(callbackResult);

    connection.query(sql, params, (err, results, fields) => {
      if (err) {
        debug(`ERROR: ${err.message}`);
        const error = err;
        error.httpStatus = 400;
        closeMysqlConnection(connection);
        callbackResult(err, null);
        return;
      }

      debug('*******');
      debug(results);
      debug('*******');

      connection.end((error) => {
        if (err) {
          debug(chalk.bgRed.black('ERROR:') + error.message); // error en cierre de conexion informo por consola y devuelvo el resultado.
          return;
        }
        debug('Close the database connection.');
      });

      callbackResult(null, results);
    });
  }

  //
  //  findByNroFactura:
  //  Funcion que recibe nro de factura, consulta a la BD y llama a la func de  callback.
  //
  function findByNroFactura(nroFactura, callbackResult) {
    const sql = `SELECT 
      NroFactura,
      NroContrato,
      AñoContrato,
      Cliente, 
      date_format(FechaEmision, '%d-%m-%y') as FechaEmision,
      date_format(FechaCobro, '%d-%m-%y') as FechaCobro,
      Monto
    
        FROM Facturas WHERE NROFACTURA = ?`;
    debug(`voy a hacer select con Numero Factura: ${nroFactura}`);
    executeSql(sql, [nroFactura], callbackResult);
  }

  //
  //  findByNroCliente:
  //  Funcion que recibe nro de factura, consulta a la BD y llama a la func de  callback.
  //
  function findByCliente(cliente, callbackResult) {
    const sql = `SELECT 
      NroFactura,
      NroContrato,
      AñoContrato,
      Cliente, 
      date_format(FechaEmision, '%d-%m-%y') as FechaEmision,
      date_format(FechaCobro, '%d-%m-%y') as FechaCobro,
      Monto
      FROM Facturas WHERE CLIENTE = ?`;

    debug(`voy a hacer select con cliente: ${cliente}`);
    executeSql(sql, [cliente], callbackResult);
  }
//

  //  findByContrato:
  //  Funcion que recibe nro y año de un contrato, consulta a la BD y llama a la func de  callback.
  //
  function findByContrato(nroContrato, añoContrato, callbackResult) {
    const sql = `SELECT 
      NroFactura,
      NroContrato,
      AñoContrato,
      Cliente, 
      date_format(FechaEmision, '%d-%m-%y') as FechaEmision,
      date_format(FechaCobro, '%d-%m-%y') as FechaCobro,
      Monto
      FROM Facturas WHERE NROCONTRATO = ? and AÑOCONTRATO = ?`;

    debug(`voy a hacer select con contrato: ${nroContrato}/${añoContrato}`);
    executeSql(sql, [nroContrato,añoContrato], callbackResult);
  }

  //
  //
  //
  function findAll(callbackResult) {
    const connection = getMysqlConnection(callbackResult);

    const sql = `SELECT 
      NroFactura,
      NroContrato,
      AñoContrato,
      Cliente, 
      date_format(FechaEmision, '%Y-%m-%d') as FechaEmision,
      date_format(FechaCobro, '%Y-%m-%d') as FechaCobro,
      Monto
      
      FROM Facturas`;
    debug(`voy a hacer select en findAll`);
    executeSql(sql, null, callbackResult);
  }

  //
  //
  //
  function createFactura(factura, callbackResult) {
    const sql = 'INSERT INTO Facturas SET  ?'; // (NroFactura, NroContrato, AñoContrato, NroCliente, FechaEmision, FechaCobro, monto) VALUES ( ?, ?, ?, ?, ?, ?, ?);;

    executeSql(sql, factura, callbackResult);
  }

  //
  //
  //
  function updateFactura(factura, callbackResult) {
    let sql = 'UPDATE  Facturas SET ';
    // eslint-disable-next-line no-restricted-syntax
    for (let campo in factura) {
      // tengo que armar la sentencia de UPDATE pongo campo = valor para todos los campos salvo el
      // nro de Factura porque es la clave y tengo que ponerla en la clausula WHERE
      if (campo !== 'NroFactura' && factura[campo] != null) {
        sql = `${sql} ${campo} = '${factura[campo]}' ,`;
      }
    }

    if (!factura.NroFactura) {
      const err = {};
      err.httpStatus = 400;
      err.mensaje = 'Falta el valor de NroFactura para poder hacer el update';
      debug(chalk.bgRed.black('ERROR: ') + err.message);
      callbackResult(err, null);
      return;
    }

    // tengo que sacar la ultima coma
    if (sql[sql.length - 1] === ',') {
      sql = sql.substr(0, sql.length - 1);
    }

    sql += ' WHERE NroFactura = ?';

    debug(`En PATCH:  Query ->${sql}<-`);
    executeSql(sql, factura.NroFactura, callbackResult);
  }

  //
  //
  //
  function deleteFactura(nroFactura, callbackResult) {
    const sql = 'DELETE FROM Facturas WHERE NroFactura = ?';

    if (!nroFactura) {
      const err = {};
      err.httpStatus = 400;
      err.mensaje = 'Falta el valor de NroFactura para poder hacer el delete';
      debug(chalk.bgRed.black('ERROR: ') + err.message);
      callbackResult(err, null);
      return;
    }

    executeSql(sql, nroFactura, callbackResult);
  }

  // eslint-disable-next-line object-curly-newline
  return { findByCliente, findByNroFactura, findByContrato, findAll, createFactura, updateFactura, deleteFactura };
}

module.exports = FacturaModel;
