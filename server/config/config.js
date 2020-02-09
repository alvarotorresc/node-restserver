/*
=====================
    PUERTO
=====================
*/
process.env.PORT = process.env.PORT || 3005;
/*
=====================
    ENTORNO
=====================
*/
process.env.NODE_ENV = process.env.NODE_ENV ||'dev';
/*
=====================
    Token life
=====================
*/
process.env.CADUCITY_TOKEN = 60*60*24*30;

/*
=====================
    SEED
=====================
*/
process.env.SEED = process.env.SEED || "seed";

/*
=====================
    Google client id
=====================
*/
process.env.CLIENT_ID = process.env.CLIENT_ID || '47683548124-lk5q6seuj4risc5qeh1033rmhjfvn064.apps.googleusercontent.com';
/*
=====================
    BD
=====================
*/

/*let urlBD;

if (process.env.NODE_ENV === 'dev') {
    urlBD = 'mongodb://localhost:27017/coffee';
}else{
    urlBD = 'mongodb+srv://admin:<admin>@coffee-p2asi.mongodb.net/test?retryWrites=true&w=majority'
}
process.env.URLDB = urlBD*/
