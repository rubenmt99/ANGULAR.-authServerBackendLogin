const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

//ponemos = response para que al poner res. nos aparezcan las funciones. Es opcional
 const crearUsuario = async(req, res = response) => {

    const {email, name, password} = req.body;

    try{

    //verificar email
        const usuario = await Usuario.findOne({email});

        if(usuario){
            return res.status(400).json({
                ok:false,
                msg:'El usuario ya existe con ese email'
            });
        }
    
    //Crear usuario con el modelo
    const dbUser = new Usuario(req.body);

    //hash contraseña (encriptar)
    const salt = bcrypt.genSaltSync();
    dbUser.password = bcrypt.hashSync(password, salt);

    //generar Jason Web Token JWT
    //await para que el programa espere a resolver el token y no hago el return sin éste
    const token = await generarJWT( dbUser.id, dbUser.name );


    //crear usuario de BBDD
    await dbUser.save();

    //generar respuesta exitosa
    return res.status(201).json({
        ok: true,
        uid: dbUser.id,
        name,
        email,
        token
    });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor, hable con el administrador'
        });
    }

}


const loginUsuario =  async(req, res = response) => {

    //el req.body seria el body que le estamos pasando por el postman
    const {email, password} = req.body;
    
    try{

        const dbUser = await Usuario.findOne({email});

        if(!dbUser) {
            return res.status(400).json({
                ok:false,
                msg: 'El correo no existe'
            });
        }

        //confirmar si password hace match
        const validPassword = bcrypt.compareSync(password, dbUser.password);

        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg: 'El password es erróneo'
            });
        }

        //generar el JWT
        const token = await generarJWT( dbUser.id, dbUser.name );

        //respuesta del servicio
        return res.json({
            ok:true,
            uid: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            token
        })


    }catch(error){
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        });
    }

}


const revalidarToken =  async(req, res = response) => {

    const {uid} = req;

    /*Leer la base de datos ç
    Ya tendriamos el dbUser.name, dbUser.email...
    Si queremos mandar el email en la respuesta del ravlidar token*/

    const dbUser = await Usuario.findById(uid);

    const token = await generarJWT(uid,dbUser.name);

    return res.json({
        ok: true,
        uid,
        name: dbUser.name,
        email: dbUser.email,
        token
    });

}



module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}