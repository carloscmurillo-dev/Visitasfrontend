import axios from "axios";

//const  API = axios.create({baseURL: 'https://api-gessa.jojodev.app/api/'});


// Esta conexion se usa para conectarse al api localhost

//const  API = axios.create({baseURL:'https://4329-190-171-112-177.ngrok-free.app/api/'});

const  API = axios.create({baseURL: 'http://131.108.37.214:8096/api/'});



//_____________________________________________________________________________________________

// Esta conexion se usa para conectarse al servidor de produccion   

//const  API = axios.create({baseURL: 'https://api.conexiongessa.com:9444/api/'});

export default API;
