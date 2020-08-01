//
//
//
// FacturaApp: Modulo de inicio de la aplicacion.
//
// Alcance:  API restfull de Facturas.  Persiste datos en base mysql.
// 
// Se desarrolla utilizando  paquetes express, body-parser y mysql
//
//


const express = require("express");
const app = express();
module.exports=app; 

const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
app.use( morgan('tiny'));

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PATCH, DELETE');
    next();
});


// 
// Se trata de implementar una separacion entre el modelo, la  capa de control y el ruteo
//
// En modelo se implementan todas las funciones relacionadas con la persistencia de la Entidad Facturas
// sobre una base mysql
//
// En controller se implementan los callbacks de cada uno de los metodos HTTP haciendo uso de las funciones del modelo.
//
//  En router se mapea las rutas con los callbacks expuestos por el modulo controller.
//

const model = require( "./Models/FacturaModel")();
const controller = require( "./Controlllers/FacturaController")(model);
const router = require( "./Routers/FacturaRouter")(controller);

const port = process.env.PORT || 3200;

//
// se llama a la funcion de listening con las rutas configuradas por el modulo  router y "a volar".
//
app.server = app.listen( port, () =>{
    debug( `Listen en el port: ${chalk.bgGreen.black(port)}`);
});