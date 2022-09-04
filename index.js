
//asi se importaría la dependencia
const express = require('express');
const cors = require('cors');
const path = require('path');

const { dbConnection } = require('./db/config');
//leer environment (.env) obtenemos el puerto. console.log(process.env);
require('dotenv').config();


//Crear el servidor/aplicación de express
const app = express();

//Base de datos
dbConnection();


//Directorio público
app.use(express.static('public'));

//CORS
app.use( cors() );

//Lectura y parseo del body
app.use( express.json() );


/*Rutas. USE seria un middleware (funcion que se ejecuta cuando el interprete
    pase evaluando las lineas de codigo). Recordar el require es un import
    una vez con este use y las rutas especificadas en el auth.js podemos 
    acceder a las rutas por ej. localhost:4000/api/auth/renew (*seleccionar get,post...) */
app.use( '/api/auth', require('./routes/auth') );

//Para desplegar la aplicacion. Establecemos las rutas que no estan definidas aquí.
//Manejar las demás rutas. dirname es el path donde esta desplegado nuestro servidor
app.get('*', (req, res) => {
    res.sendFile( path.resolve(__dirname,'public/index.html') )
})


//indicar puerto. Lo hacemos a traves del .env
app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`)
} );