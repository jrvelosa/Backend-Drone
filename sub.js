//Conexion a la BBDD postgres
const { Pool } = require('pg');
const conx = {
    user: 'postgres',
    host: 'localhost',
    database: 'DroneDB',
    password: 'Adsi-908163*'
};
const pool = new Pool(conx);

//Comprobamos el estado de la conexion
pool.connect(() => {
    try {
        console.log('----------------------------------------')
        console.log('Conexion exitosa a DroneDB - PostgresSQL')
        console.log('----------------------------------------')
    } catch (error) {
        console.log(error);
    }
});

//Conexion al Broker EMQX
var options = {
    port: 1883,
    host: '34.95.219.39:18083',
    ClienteId: 'MQTT_Node',
    username: 'admin',
    password: 'public',
    keepalive: 60
};

var mqtt = require('mqtt')
var client = mqtt.connect("mqtt://34.95.219.39:18083", options)

client.on('connect', function() {

    client.subscribe('+/#', function(err) {
        if (!err) {
            //client.publish('Drone1', 'Hello mqtt')
            console.log('----------------------------------------')
            console.log('Suscripcion exitosa a EMQX');
            console.log('----------------------------------------')
        }
    })
})

client.on('message', function(topic, message) {
    message = message.toString();

    if (message != 'EMQ X Broker' && message != '4.3.1' && message != 'emqx@127.0.0.1' && topic == 'Drone1') {
        var data = message.toString();
        data = data.split(',');
        console.log('----------------------------------------')
        console.log(topic, data);
        var iddispositivo = parseInt(data[0]);
        var cprovin = parseInt(data[1]);
        var cciudad = parseInt(data[2]);
        var idloc = parseInt(data[3]);
        var temperatura = parseFloat(data[4]);
        var humedad = parseFloat(data[5]);
        var contaminacion = parseFloat(data[6]);
        var femisio = new Date();
        var cusuario = data[7];
        var values = [iddispositivo, cprovin, cciudad, idloc, temperatura, humedad, contaminacion, femisio, cusuario];
        console.log(values);
        insertTopico(values);
        console.log('----------------------------------------')
    } else {
        console.log('Else :' + topic, message.toString());
    }
});

const insertTopico = async(data) => {
    try {
        const vquery = `INSERT INTO public.topicos(iddispositivo, cprovin, cciudad, idloc, temperatura, humedad, contaminacion, femisio, cusuario) 
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`
        const values = data;
        const res = await pool.query(vquery, values);
        console.log(res.command + ':' + res.rowCount);
        //pool.end();

    } catch (error) {
        console.log(error);
    }
};