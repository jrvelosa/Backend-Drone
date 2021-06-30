//Conexion a la BBDD postgres
const { Pool } = require('pg');

const conx = {
    user: 'postgres',
    host: 'localhost',
    database: 'DroneDB',
    password: 'Adsi-908163*'
};

const pool = new Pool(conx);

const getTopicos = async() => {
    try {
        const res = await pool.query(`select t.idtopic,pp.cpais, pp.pais,p.region, p.provincia, c.ciudad, l.localidad,l.superficie, l.poblacion, t.temperatura,t.humedad,t.contaminacion,t.femisio 
                                        from topicos t , localidad l, ciudad c, provincia p , paises pp 
                                       where  t.idloc = l.idloc 
                                         and t.cciudad = l.cciudad 
                                         and l.cciudad = c.cciudad 
                                         and c.cprovin = p.cprovin 
                                         and pp.cpais = p.cpais`);
        console.log(res.rows);
        //pool.end();
    } catch (error) {
        console.log(error);
    }
};

getTopicos();