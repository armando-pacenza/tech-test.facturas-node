require("should");
const request = require("supertest");
const app = require ("../src/FacturasApp.js");
const { doesNotThrow } = require("should");

const agent = request.agent(app);



describe( " POST Facturas", () =>  {
    it( "POST.1 con todos los campos  ok", (done) =>{
        sendPost( agent, {
            "NroFactura": 1,
            "NroContrato": 123,
            "AñoContrato": 2020,
            "Cliente": "Pepe",
            "FechaEmision": "2020-01-01",
            "FechaCobro":  "2020-02-02",
            "monto": 100
        }, done)
        
    });

    it( "POST.2 post solo con envio de nro de factura", (done)=>{
    
       sendPost( agent, {
            "NroFactura": 2,
        }, done)
    });

    it( "POST.3 post  con envio de nro de factura y monto", (done)=>{
        sendPost( agent, {
            "NroFactura": 3,
            "monto": 100
        }, done);
    });

    it( "POST.4 post con envio de nro de factura, monto y fecha emision ", (done)=>{
        sendPost( agent, {
            "NroFactura": 4,
            "monto": 100,
            "FechaEmision": "2020-01-01"
        }, done);
    });
    it( "POST.5 post con envio de nro de factura, monto, fecha emision y fecha de cobro", (done)=>{
        sendPost( agent, {
            "NroFactura": 5,
            "monto": 100,
            "FechaEmision": "2020-01-01",
            "FechaCobro": "2020-01-01",
        }, done);
    });

    
    
    it( "POST.6 post  con envio de nro de contrato y año", (done)=>{
        sendPost( agent, {
            "NroFactura": 6,
            "NroContrato": 123,
            "AñoContrato": 2020
        }, done);
    });
    
    
    it( "POST.7 post con envio de nro de factura invalido", (done)=>{
        agent.post("/ms-facturas")
        .send( {
            "NroFactura": "8xx",
            "Cliente": "Pepe",
            "FechaEmision": "2020-01-01:20",
            "FechaCobro":  "2020-02-02",
            "monto": 100,
            "campo-fake": 12345
        })
        .set('Content-Type', 'application/json') 
        .expect(400)
        .end( (err, result) =>{
                if (err) 
                    return done(err);
                done();
        })
    });


    it( "POST.8 post con fecha de emision con hora", (done)=>{
        agent.post("/ms-facturas")
        .send( {
            "NroFactura": 8,
            "Cliente": "Pipo",
            "FechaEmision": "2020-01-01:20",
            "FechaCobro":  "2020-02-02",
            "monto": 100,
            "campo-fake": 12345
        })
        .set('Content-Type', 'application/json') 
        .expect(400)
        .end( (err, result) =>{
                if (err) 
                    return done(err);
                done();
        })
    });
    it( "POST.9 post con fecha de emision con hora y min", (done)=>{
        agent.post("/ms-facturas")
        .send( {
            "NroFactura": 8,
            "Cliente": "Pipo",
            "FechaEmision": "2020-01-01:20:10",
            "FechaCobro":  "2020-02-02",
            "monto": 100,
            "campo-fake": 12345
        })
        .set('Content-Type', 'application/json') 
        .expect(400)
        .end( (err, result) =>{
                if (err) 
                    return done(err);
                done();
        })
        
    });
    it( "POST.10 post con nro de factura duplicado", (done)=>{
        agent.post("/ms-facturas")
        .send( {
            "NroFactura": 1,
            "Cliente": "Pipo",
            "FechaEmision": "2020-01-01:20:10",
            "FechaCobro":  "2020-02-02",
            "monto": 100,
            "campo-fake": 12345
        })
        .set('Content-Type', 'application/json') 
        .expect(400)
        .end( (err, result) =>{
                if (err) 
                    return done(err);
                done();
        })
        
    });
        
    it( "POST.11 post con formato json invalido", (done)=>{
        agent.post("/ms-facturas")
        .send( 
        `
            {
            "NroFactura": 1,
            "Cliente": "Toto",
            "FechaEmision": "2020-01-01",
            "FechaCobro":  "2020-02-02",
            "monto": 100,
            "campo-fake": 12345
        `
        )
        .set('Content-Type', 'application/json') 
        .expect(400)
        .end( (err, result) =>{
                if (err) 
                    return done(err);
                done();
        })
    });

    it( "POST.12 post con campos adicionales a los requeridos", (done)=>{
       
        agent.post("/ms-facturas")
        .send( {
            "NroFactura": 1,
            "Cliente": "Toto",
            "FechaEmision": "2020-01-01",
            "FechaCobro":  "2020-02-02",
            "monto": 100,
            "campo-fake": 12345
        })
        .set('Content-Type', 'application/json') 
        .expect(400)
        .end( (err, result) =>{
                if (err) 
                    return done(err);
                done();
        })
    });


});

function sendPost( agent, factura, done){
agent.post("/ms-facturas")
.send( factura)
.set('Content-Type', 'application/json') 
.expect(204)
.end( (err, result) =>{
    result.statusCode.should.equal(204);
    //debug( `err: ${err} - result: ${result}`);
    if (err) 
        return done(err);
    done();
})
};

describe( "GET Facturas", () =>{
        it( "GET 1 - Que retorne lista de Facturas en formato JSON", (done) => {
            agent.get("/ms-facturas/")
                .expect(200)
                .end( (err, result)=>{
                    result.body[0].should.have.property('NroFactura');
                    result.body[0].should.have.property('NroContrato');
                    result.body[0].should.have.property('AñoContrato');
                    result.body[0].should.have.property('Cliente');
                    result.body[0].should.have.property('FechaEmision');
                    result.body[0].should.have.property('FechaCobro');
                    result.body[0].should.have.property('Monto');
                    done();
                })

        })

        it( "GET 2 - Que retorne lista de Facturas en formato JSON para un cliente", (done) => {
            agent.get("/ms-facturas?cliente=Pepe")
                .expect(204)
                .end( (err, result)=>{
                    result.body[0].should.have.property('NroFactura');
                    result.body[0].should.have.property('NroContrato');
                    result.body[0].should.have.property('AñoContrato');
                    result.body[0].should.have.property('Cliente');
                    result.body[0].should.have.property('FechaEmision');
                    result.body[0].should.have.property('FechaCobro');
                    result.body[0].should.have.property('Monto');
                    done();
                })

        })

        it( "GET 3 - Que retorne lista de Facturas en formato JSON para un Nro de Contrato", (done) => {
            agent.get("/ms-facturas?nrocontrato=123&añocontrato=2020")
                .expect(204)
                .end( (err, result)=>{
                    result.body[0].should.have.property('NroFactura');
                    result.body[0].should.have.property('NroContrato');
                    result.body[0].should.have.property('AñoContrato');
                    result.body[0].should.have.property('Cliente');
                    result.body[0].should.have.property('FechaEmision');
                    result.body[0].should.have.property('FechaCobro');
                    result.body[0].should.have.property('Monto');
                    done();
                })

        })
    
})

describe( "DELETE Facturas", () =>{
    it( "DELETE 1 - Que retorne lista de Facturas en formato JSON", (done) => {
        agent.delete("/ms-facturas/?nro-factura=1")
            .expect(204)
            .end( (err, result)=>{
                if (err){
                    done(err);
                    return;
                }
                done();
            })

    })

})

after((done) =>{
    app.server.close(done);
})
