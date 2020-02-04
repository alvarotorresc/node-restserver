



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
    BD
=====================
*/

let urlBD;

// if (process.env.NODE_ENV === 'dev') {
//     urlBD = 'mongodb://localhost:27017/coffee';
// }else{
    urlBD = 'mongodb+srv://admin:<admin>@coffee-p2asi.mongodb.net/test?retryWrites=true&w=majority'
//}
process.env.URLDB = urlBD
