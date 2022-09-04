
//async porque necesito que mi aplicacion no continue 

const mongoose = require("mongoose");

//hasta que no se levante la bbdd
const dbConnection = async() => {

    try{

        //no ejecuta nada mas hasta tener la bbdd conectada
       await mongoose.connect(process.env.BD_CNN);

       console.log('DB Online')

    }catch(error){
        console.log(error);
        throw new Error('Error al inicializar la BBDD');
    }

}


module.exports = {
    dbConnection
}