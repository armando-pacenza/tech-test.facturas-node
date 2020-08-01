const debug = require('debug')('app');
const bodyParser = require("body-parser");
const {htmlResponseMessage} = require( "../Shared/RutinasComunes");
const app = require("../FacturasApp");


//
// Config necesaria para que el paquete body-parser parsee el body y genere el req.body 
// necesario para recibir los json del PUT y el PATCH
//
app.use(bodyParser.urlencoded({ extended: true}));
app.use( bodyParser.json());

//
// facturaController implementa las funciones get, post, put, patch que se usan como callback de cada respectivo metodo HTTP en el router
// 
function facturaController (model) {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// El get puede recibir el nro de factura como query param  o como json en el body. Sin parametro devuelve todfas las facturas.
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function get (req, res){
        
        //debug(">>>>>> <<<<<<<<");
        //debug( `GET - ${req.url}`)
        //debug(">>>>>> <<<<<<<<");

        let nroFactura;
        
        if(  req.query['nro-factura']){
           nroFactura = req.query['nro-factura'];
        }
        else 
            if(  req.params.parametro){ // como nro factura es clave puede mandar nro de factira como parametro "/Factura/nnnn"
                nroFactura = req.params.parametro;
        } 

        //
        // se implementa tambien el get con Nro de cliente como query param
        //

        let cliente;
        if(  req.query['cliente']){
            cliente = req.query['cliente'];
         }

         //
        // se implementa tambien el get con Nro y Año de Contrato
        //

        let año, numero;
        if(  req.query['añocontrato']){
            año = req.query['añocontrato'];
         }
         if(  req.query['nrocontrato']){
            numero = req.query['nrocontrato'];
         }


        if (nroFactura) { // si vino Nro de Factura por query o por path
            model.findByNroFactura( nroFactura , (err, data) => {
                if (err){
                  return res.send(htmlResponseMessage( 500,
                        err.message || `Ha ocrrido algun Error al recuperar Factura - ${nroFactura}`));
                }
                 if(data.length != 0)
                    return res.status(200).json (data[0]);
                else
                    return res.status(404).send( htmlResponseMessage(404, `No se ha encontrado Factura con nro: ${nroFactura}`));
            });
            return;
        }
        if ( cliente){
            model.findByCliente( cliente, (err, data) => {
                if (err){
                  return res.send(htmlResponseMessage( 500,
                        err.message || `Ha ocrrido algun Error al recuperar Facturas de cliente - ${cliente}`));
                }
                 if(data.length != 0)
                    return res.status(200).json (data);
                else
                    return res.status(404).send( htmlResponseMessage(404, `No se ha encontrado Factura de cliente: ${cliente}`));
            });
            return;
        }

        if ( año && numero){
            debug( "Entro por año y numero");
            model.findByContrato( numero, año, (err, data) => {
                if (err){
                  return res.send(htmlResponseMessage( 500,
                        err.message || `Ha ocrrido algun Error al recuperar Facturas de cliente - ${cliente}`));
                }
                 if(data.length != 0)
                    return res.status(200).json (data);
                else
                    return res.status(404).send( htmlResponseMessage(404, `No se ha encontrado Factura de cliente: ${cliente}`));
            });
            return;
        }
        
        // Si no vino nro de factura ni numero de cliente contesto con todas las facturas
            model.findAll( (err, data) => {
                if (err)
                    return res.send(htmlResponseMessage( 500, err.message || "Ha ocrrido algun Error al recuperar Facturas"));
                else
                    return res.status(200).json (data);
            }); 
    };
        
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// El post recibe los datos de la factura unicamente como json. 
// Chequea que se envie el Nro Factura porque es clave en la BD. El resto de los parametros son  opcionales
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function post (req, res) {
        //debug(">>>>>> <<<<<<<<");         
        //debug( `POST - ${req.url}`)
        //debug(">>>>>> <<<<<<<<");

        if(  req.body.NroFactura){
            model.createFactura( req.body , (err, data) => {
                if (err){
                  return res.status(err.httpStatus).send(htmlResponseMessage( err.httpStatus, 
                            err.message || `Ha ocrrido algun Error al crear una Factura - ${req.body}`));
                }
                debug( "Create Factura OK"); 
                return res.sendStatus(204);
            });
            
        }
        else{
            return res.status(400).send(htmlResponseMessage( 400, `POST  no puede procesar Factura sin numero.`));
        } 
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // El patch recibe los datos de la factura unicamente como json. 
    // Chequea que se envie el Nro Factura porque es clave en la BD. El resto de los parametros son  opcional
    // La funcion es exactamente igual a put solo que llama a updateFactura en vez de createFactura
    //
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    function patch (req, res) {
        //debug(">>>>>> <<<<<<<<");
        //debug( `PATCH - ${req.url}`)
        //debug(">>>>>> <<<<<<<<");

        if(  req.body.NroFactura){
            model.updateFactura( req.body , (err, data) => {
                    if (err){
                     return res.status(err.httpStatus).send(htmlResponseMessage( err.httpStatus, 
                               err.message || `Ha ocrrido algun Error al actualizar una Factura - ${req.body}`));
                    }
                    debug("Update Factura OK");
                    return res.sendStatus(204);
                });    
        }
        else{
            debug(`PATCH  no puede procesar Factura sin numero. nro=${req.body.NroFactura}`);
            return res.status(400).send(htmlResponseMessage( 400, `PATCH  no puede procesar Factura sin numero.`));

        } 
    };
    
    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // El del recibe el nro de la factura  query param o path y llama a deleteFacrtura
    // 
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function del (req, res) {  // delete is a reserved word. No se puede usar :-(
        //debug(">>>>>> <<<<<<<<");
        //debug( `DELETE - ${req.url}`)
        //debug(">>>>>> <<<<<<<<");

        let nroFactura;
        
        if(  req.query['nro-factura']){
           nroFactura = req.query['nro-factura'];
        }
        else {
            if(  req.params.parametro)
                nroFactura = req.params.parametro;
            else 
                return res.status(400).send(htmlResponseMessage( 400, `DELETE  no puede procesar Factura sin numero.`));
        } 
        
        model.deleteFactura( nroFactura , (err, data) => {
            if (err){
              return res.status(err.httpStatus).send(htmlResponseMessage( err.httpStatus, 
                        err.message || `Ha ocrrido algun Error al borrar una Factura - ${req.body}`));
           }
           debug( " Delete Factura OK");
            return res.sendStatus(204);
        });    
    }; 


    return {get, post, patch, del};
};

module.exports = facturaController;