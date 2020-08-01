const chalk = require("chalk");

const debug = require( "debug")("app");

var pipo = 2;
class Comunes{
    
     htmlResponseMessage( codigoError, mensaje){
        debug( `Codigo:${chalk.bgRed.black(codigoError)} - ${mensaje}`);
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
            <title>Error</title>
            </head>
            <body>
        
                <h1>Ops. Algo Ocurrio. Estamos trabajando para brindar un mejor servicio :)</h1>

                <p>
                <h2>Codigo de Error: ${codigoError}</h2>
        
                <h2> Descripcion: ${mensaje}</h2>
                </p>
            </body>
            </html>
        `;
    }
    prueba(){
        console.log("prueba");
    }
}

module.exports = new Comunes();