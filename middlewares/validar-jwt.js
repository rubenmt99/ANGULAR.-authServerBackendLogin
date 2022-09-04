const { response } = require("express");
const jwt = require("jsonwebtoken");

const validarJWT = (req,res = response, next) => {

    //en postman, en esta peticion escribimos en el header un nueva key (x-token)
    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            ok:false,
            error: 'Error en el token'
        });
    }

    try{

        const {uid, name} = jwt.verify(token, process.env.SECRET_JWT_SEED);
       
        //Se lo pasamos al controlador. el req es el mismo
        req.uid = uid;
        req.name = name;

    } catch(error){
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        })
    }


    //todo OK!
    next();

}





module.exports= {validarJWT}