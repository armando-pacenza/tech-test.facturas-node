const express = require("express");
const app = require("../FacturasApp");
const facturasRouter = express.Router();
app.use('/', facturasRouter);


function cualquierNombre(controller, app){

   
    
    facturasRouter.route("/ms-facturas")
        .get( controller.get )
        .post( controller.post)
        .patch( controller.patch)
        .delete( controller.del)
        ;
    
    facturasRouter.route("/ms-facturas/:parametro")
    .get( controller.get);

    return facturasRouter;
}

module.exports = cualquierNombre;