
const jwt = require('jsonwebtoken');

const generarJWT = (uid, name) => {

    const payload = {uid,name};

    //si se hace bien llama resolve, si se hace mal reject
    return new Promise( (resolve,reject) => {

        jwt.sign( payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '24h'
        }, (err, token) => {
    
            if (err){
                //TODO MAL
                console.log(err);
                reject();
            }else{
                //TODO BIEN
                resolve(token);
            }
    
        })
    });

}

module.exports = {
    generarJWT
}

