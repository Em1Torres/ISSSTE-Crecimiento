require("dotenv").config(); 
const express=require("express");
const mysql=require("mysql2/promise");
var cors=require("cors");
const bodyParser=require("body-parser")
const argon2=require("argon2");
const app=express();
const jwt=require("jsonwebtoken");
const fs=require("fs");
const https=require("https");	

const PORT=3000;
let db;
app.use(cors());
app.use(bodyParser.json());

const columnasInfantes = "p.id_infante AS id, p.matricula, p.nombre, p.paterno, p.materno, p.genero, p.fnac, e.nombre AS ebdi, s.nombre AS estado"
const ordenPermitido = ["id", "matricula", "nombre", "paterno", "materno", "fnac", "ebdi", "id_ebdi"];
const ordenUsuario =["id", "usuario", "rol", "activo"];

// conexion base de datos con .env
async function connectToDB(){
	db = await mysql.createPool({	// Crear la conexión a la base de datos, usando .env locales
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		dateStrings: true
	});
	console.log("conectado a la base de datos");
}

// lista de los infantes
async function getListInfantes(req, res){  // Función de base de datos que recibe parámetros de sorteo
	let columna = "id";						// mandados por React-Admin
	if(ordenPermitido.includes(req.query._sort)){
		columna=req.query._sort;
	}

	let direccion = "ASC";
	if(req.query._order == "DESC"){
		direccion="DESC";
	}

	let inicio = Number(req.query._start);
	let final= Number(req.query._end);
	let cuantos= final-inicio;
	let alc = alcance(req.usuario);

	const [resultadoConteo] = await db.query("SELECT COUNT(*) AS total " + " FROM padron AS p" + // Consulta para contar el total de filas
		" INNER JOIN ebdis AS e ON e.ur = p.ur AND e.ebdi_num = p.ebdi"+
		" INNER JOIN estados AS s ON s.id_estado = e.id_estado"
		+ " INNER JOIN regiones AS r ON r.id_region = s.id_region"
		+ " WHERE p.activo = 1" + alc.sql, alc.params);
	let total = resultadoConteo[0].total;

	let consulta = "SELECT p.id_infante AS id, p.matricula, p.nombre, p.paterno, p.materno, p.genero, p.fnac, e.nombre AS ebdi, s.nombre AS estado" +
	" FROM padron AS p" +
	" INNER JOIN ebdis AS e ON e.ur = p.ur AND e.ebdi_num = p.ebdi"+
	" INNER JOIN estados AS s ON s.id_estado = e.id_estado" +  // Consulta con parámetros de filtrado de React-Admin con LIMIT, OFFSET y order by
	" INNER JOIN regiones AS r ON r.id_region = s.id_region" + // Claude nos ayudó a relizar el query con los order by y limits para que lo pueda recibir el front
	" WHERE p.activo = 1" + alc.sql + 
	" ORDER BY " + columna + " " + direccion +
	" LIMIT ? OFFSET ?";
	
	const [ninos] = await db.query(consulta, [...alc.params, cuantos, inicio]);

	res.set("Access-Control-Expose-Headers", "X-Total-Count");
	res.set("X-Total-Count", total);
	res.json(ninos);
}

// lista de usuarios
async function getListUsuarios(req, res) { //
	let consulta="SELECT u.id_usuario AS id, u.usuario, u.rol, u.activo, r.nombre AS region, e.nombre AS ebdi"
	+ " FROM usuarios AS u" +
	" LEFT JOIN regiones AS r ON r.id_region = u.id_region" +  // Consulta con estructura de header de React-Amdmin
	" LEFT JOIN ebdis AS e ON e.id_ebdi = u.id_ebdi";			// para desplegar los usuarios al rol de administrador
	const [usuarios]=await db.query(consulta);
	res.set("Access-Control-Expose-Headers", "X-Total-Count");
	res.set("X-Total-Count", usuarios.length);
	res.json(usuarios);
}

// lista de EBDI's
async function getListEbdis(req,res){
	let [consulta] = await db.query(`SELECT id_ebdi AS id, nombre 
		FROM ebdis`);  // Query a la base de datos para obtener los nombres guardados de las EBDIs
						// y poder usarlo como una lista en el frontend de SelectInput
	res.json(consulta);
}

// buscar a un solo infante
async function getOneInfante(req, res){
	let id = Number(req.params.id);
	let consulta = `SELECT p.id_infante AS id, p.matricula, p.nombre, p.paterno, p.materno, p.genero, p.fnac
	FROM padron AS p     
	WHERE id_infante = ?`;    // Consulta de un infante en base a su id que regesa React-Admin al seleccionar la fila
	const [nino] = await db.query(consulta, [id]);
	res.json(nino[0]);
}

// un solo usuario
async function getOneUsuario(req, res){
	let id= Number(req.params.id);
	let consulta="SELECT id_usuario AS id, usuario, rol, id_region, id_ebdi, activo FROM usuarios WHERE id_usuario = ?";
	const [usuario]=await db.query(consulta, [id]);  // Consulta a un usuario en base a su nombre de usuario
	//  que extraemos de verificar el token, y pedimos información importante a ocupar como su rol a la base de datos
	res.json(usuario[0]);
}
// editar a un infante 
async function updateInfante(req, res){
    let id = Number(req.params.id);
    let datos = req.body;
    let consulta = "CALL editarInfante(?,?,?,?,?,?,?,?)";  // Creamos un procedure en la base de datos para updetear la información de un infate
	// Dentro del procedre se hace un consulta con el nombre de ebdi para ligar el id de ebdi al infante
    await db.query(consulta, [datos.matricula, datos.nombre, datos.paterno, datos.materno, datos.genero, datos.fnac, datos.ebdi, id]);

    console.log(await getOneInfante(req, res));
}
// editar a un usuario
async function updateUsuario(req, res) {
	let id=Number(req.params.id);
	let datos=req.body;
	let consulta="UPDATE usuarios SET usuario = ?, rol=?, id_region=?, id_ebdi=? WHERE id_usuario=?";  // Update sencillo de usuario en esos parámetros
	await db.query(consulta, [datos.usuario, datos.rol, datos.id_region, datos.id_ebdi, id]);  // para decidir su rol y ligarlo a un región o ebdi y su nombre de usuario
	await getOneUsuario(req, res);
}

// crear a un infante
async function createInfante(req, res){
	let datos = req.body;
	let consulta = "CALL anadirInfante(?,?,?,?,?,?,?)";  // Procedure similar a updetear infantes, todos los datos excepto
	const [resultado] = await db.query(consulta, 		// ebdi son para insertar directo en la tabla, ebdi es un nombre 
		[datos.matricula, datos.ebdi, datos.nombre, datos.paterno, datos.materno, datos.genero, datos.fnac]);
	datos.id=resultado.insertId;						// para ssacar el id de ebdi y ligarlo al infante en su tabla
	res.json(datos);
}
// borrar a un infante
async function deleteInfante(req, res){
	let id = Number(req.params.id);
	await db.query("DELETE FROM padron WHERE id_infante = ?", [id]);  // Delete sencillo de infante por su id que ya tiene React-Admin en el front
	res.json({success: true});
}
// borrar a un usuario
async function deleteUsuario(req, res){
	let id=Number(req.params.id);
	const[usuario]=await db.query("SELECT id_usuario AS id, usuario, rol FROM usuarios WHERE id_usuario=?", [id]);  // Consluta de un usuario
	await db.query("DELETE FROM padres_infantes WHERE id_usuario = ?", [id]);  // Borrado de usuarios por su id
	await db.query("DELETE FROM usuarios WHERE id_usuario=?", [id]);  // Si es padre borrarlo de la tabla M:M de padres e hijos
	res.json(usuario[0]);
	
}
// endpoint get infantes lista
app.get("/infantes", async (req, res)=>{
	try{
		let token=req.get("Authentication");
		let verifiedToken=jwt.verify(token, process.env.JWT_SECRET);  // Procesos de autenticación de JWT
		let user = verifiedToken.Usuario;
		const [usuarios]=await db.query(
			"SELECT id_usuario, usuario, rol, id_region, id_ebdi FROM usuarios WHERE usuario = ? AND activo = 1",
			[user]  // Saca el rol del usuario recibiodo
		);
		req.usuario=usuarios[0];
		await getListInfantes(req, res); // Hace la fucnión de listar infantes
	}
	catch{
		res.sendStatus(401);
	}
		
});
// endpoint EDBI's
app.get("/ebdis", async (req, res)=>{	
	await getListEbdis(req,res);
})
// Endpoint get usuarios
app.get("/usuarios", soloRoles(["admin"]), async(req, res)=>{  // con función soloRoles para limitar a ciertos usuarios
	await getListUsuarios(req, res);
});

// endpoint get un infante
app.get("/infantes/:id", async (req, res)=>{
	try{
		let token=req.get("Authentication");
		let verifiedToken=jwt.verify(token, process.env.JWT_SECRET);  // Proceso de autenticación con JWT
		let user = verifiedToken.Usuario;
		await getOneInfante(req, res); // Hace la función de agarrar un solo infante
	}
	catch{
		res.sendStatus(401);
	}
});
// endpoint get un usuario
app.get("/usuarios/:id", soloRoles(["admin"]), async (req, res)=>{  // con función soloRoles para limitar el uso solo al admin
	await getOneUsuario(req, res);
});
// endpoint actualizar a un infante
app.put("/infantes/:id",  soloRoles(["admin", "estancia"]),  async (req, res)=>{
	try{
		let token=req.get("Authentication");
		let verifiedToken=jwt.verify(token, process.env.JWT_SECRET);
		let user = verifiedToken.Usuario;   // Proceso de autenticación JWT
		const [usuarios]=await db.query(
			"SELECT id_usuario, usuario, rol, id_region, id_ebdi FROM usuarios WHERE usuario = ? AND activo = 1",
			[user]
		);
		req.usuario=usuarios[0];
		await updateInfante(req, res); // Función de actualizar la información de un solo infante
	}
	catch{
		res.sendStatus(401);
	}
		
});
//endpoint actualizar a un usuario
app.put("/usuarios/:id", soloRoles(["admin"]), async(req, res)=>{  // con función soloRoles() para limitar el uso al solo el Admin
	await updateUsuario(req, res);  
})
// endpoint agregar a un infante
app.post("/infantes",  soloRoles(["admin", "estancia"]),  async (req, res)=>{
	try{
		let token=req.get("Authentication");
		let verifiedToken=jwt.verify(token, process.env.JWT_SECRET);
		let user = verifiedToken.Usuario;			// Proceso de autenticación JWT
		const [usuarios]=await db.query(
			"SELECT id_usuario, usuario, rol, id_region, id_ebdi FROM usuarios WHERE usuario = ? AND activo = 1",
			[user]
		);
		req.usuario=usuarios[0];
		await createInfante(req, res);	// Función de insertar un fila de infante a la DB, registrar un infante
	}
	catch{
		res.sendStatus(401);
	}
	
});
// endpoint quitar/eliminar a un infante
app.delete("/infantes/:id",  soloRoles(["admin", "estancia"]),  async (req, res)=>{	
	try{
		await deleteInfante(req, res);
	}
	catch{
		res.sendStatus(401);
	}
});
// endpoint eliminar a un usuario
app.delete("/usuarios/:id", soloRoles(["admin"]), async (req, res)=>{  // Limitado solo al administrador, la eliminación de usuarios
	await deleteUsuario(req, res);
});
// endpoint de registrarse 
app.post("/registrarse", async (req, res)=>{
	let username=req.body.username;
	let password=req.body.password;
	const[usuarios]=await db.query("SELECT * FROM usuarios WHERE usuario = ? AND activo = 1", [username]);   // Consulta para verificar que no exista el usuario
	if(usuarios.length==0){  // Si es vacío significa que no existe el usuario por ende empezamos el proceso de registro
		const hash=await argon2.hash(password, {type: argon2.argon2id, memoryCost: 64*1024, timeCost: 3, parallelism: 1, saltLength: 128});  // hasheo de password con argon2 y outputs de 1064 bits
		await db.query("INSERT INTO usuarios (usuario, password_hash, rol) VALUES (?, ?, ?)", [username, hash, "padre"]);   // Inserción a la base de datos con rol default padre
		res.sendStatus(201);
	}
	else{
		res.sendStatus(403);
	}
})
// Función que valida el token JWT y verifica los permisos del usuario según su rol.
// Apoyoyada por la IA de Claude
function soloRoles(permitidos){
	return async (req, res, next)=>{
		try{
			let token=req.get("Authentication");
			let verifiedToken=jwt.verify(token, process.env.JWT_SECRET);  // Hace proceso de autenticación 
			const [usuarios]=await db.query(
				"SELECT id_usuario, usuario, rol, id_region, id_ebdi FROM usuarios WHERE usuario = ? AND activo = 1",  // Saca el rol de la consulta con el nombre de usaurio
				[verifiedToken.Usuario]
			);
			if(usuarios.length === 0){
				return res.sendStatus(401);  // Está vacío signifca que el usuario no existe
			}
			req.usuario=usuarios[0];
			if(permitidos.includes(req.usuario.rol)){
				return next();   // Next() pasa al siguiente parámetro del endpoint que en este caso el proceso de async(req,res){ llamar función de base datos}
			}
			return res.status(403).json({message: "Tu rol no puede hacer esto"});  // el rol no está incluido en el arreglo manda error permiso
		}
		catch(error){
			if(error instanceof jwt.JsonWebTokenError){
				return res.sendStatus(401);
			}
			console.error("Error verificando permisos:", error);
			return res.status(500).json({message: "No se pudieron verificar los permisos"});
		}
	}
}

// funcion para definir el alcance de acceso a los registros según el rol del usuario
// y que despligue ciertas filas de List infantes y List mediciones en base WHERE clauses
// y con distintos ids para filtrar las filas
function alcance(usuario){
	if(usuario.rol == "admin"){
		return {sql: "", params: []}; 
	}
	if(usuario.rol == "regional"){ 
		return {sql: " AND r.id_region = ?", params: [usuario.id_region]}; 
	}
	if(usuario.rol == "estancia"){ 
		return {sql: " AND e.id_ebdi = ?", params: [usuario.id_ebdi]}; 
	}
	if(usuario.rol == "padre"){
		return {sql: " AND p.id_infante IN (SELECT id_infante FROM padres_infantes WHERE id_usuario = ?)", params: [usuario.id_usuario]};
	}
	return {sql: " AND 1 = 0", params: []};
}
// endpoint de login 
app.post("/login", async (req, res)=>{
	let username=req.body.username;
	let password=req.body.password;
	const[usuarios]=await db.query("SELECT * FROM usuarios WHERE activo = 1 AND usuario = ?", [username]);  // Obtiene la información de usuario de base de datos para comparar hashes
	if(usuarios.length==0){
		res.sendStatus(401);
	}
	else{
		let usuario =usuarios[0];
		if(await argon2.verify(usuario.password_hash, password)){  // saca el hash de base datos de ese usuario y hasshea el actual y compara 
			let token=jwt.sign({"Usuario": usuario.usuario}, process.env.JWT_SECRET, {expiresIn: 900});  // si son iguales da un JWT de autenticidad
			res.json({"token": token, 
						"id": usuario.usuario, 
						"rol": usuario.rol});
		}
		else{
			res.sendStatus(401);
		}
	}
})

// Mediciones
// función con estructura similar a List de infantes
// Solo cambia el query a recibir de otra tabla 
// y otras columnas como medidas 
async function getListMediciones(req, res){
		let columna = "id";
		if(ordenPermitido.includes(req.query._sort)){
			columna=req.query._sort;
		}

		let direccion = "ASC";
		if(req.query._order == "DESC"){
			direccion="DESC";
		}

		let inicio = Number(req.query._start);
		let final= Number(req.query._end);
		let cuantos= final-inicio;
		let alc = alcance(req.usuario)

		const [conteo] = await db.query("SELECT COUNT(*) AS total" +
			" FROM mediciones AS m INNER JOIN padron AS p ON p.id_infante = m.id_infante" +
			" INNER JOIN ebdis AS e ON e.ur = p.ur AND e.ebdi_num = p.ebdi" +
			" INNER JOIN estados AS s ON s.id_estado = e.id_estado" +
			" INNER JOIN regiones AS r ON r.id_region = s.id_region" +
			" WHERE p.activo = 1" + alc.sql, alc.params);
		let total = conteo[0].total;

		const [mediciones] = await db.query(
			"SELECT m.id_medicion AS id, m.id_infante, m.fecha, m.peso, m.talla, m.imc, m.talla_blanco_familiar, m.perimetro_cefalico, " +
			"TIMESTAMPDIFF(MONTH, p.fnac, m.fecha) AS edad_meses, p.nombre AS infante, e.nombre AS nombre_ebdi, s.nombre AS estado" +
			" FROM mediciones AS m INNER JOIN padron AS p ON p.id_infante = m.id_infante" +
			" INNER JOIN ebdis AS e ON e.ur = p.ur AND e.ebdi_num = p.ebdi" +
			" INNER JOIN estados AS s ON s.id_estado = e.id_estado" +
			" INNER JOIN regiones AS r ON r.id_region = s.id_region" +
			" WHERE p.activo = 1" + alc.sql+
			" ORDER BY " + columna + " " + direccion + 
			" LIMIT ? OFFSET ?",
			[...alc.params, cuantos, inicio]);

		res.set("Access-Control-Expose-Headers", "X-Total-Count");
		res.set("X-Total-Count", total);
		res.json(mediciones);

}
// funcion para crear una medicion
async function createMedicion(req, res){
	let datos = req.body;
	let datosUsuario = req.usuario;

	const [resultados] = await db.query(
		"CALL anadirMedicion(?,?,?,?,?,?,?)",  // Similar a los procedures anteriores, el req.body trae los datos metidos en el front
		[										// req.usuario trae información de su rol, id de ebdi al que pertence (solo una EBDI puede registrar medidas de infantes)
			datos.matricula,
			datos.peso,
			datos.talla,
			datos.talla_blanco_familiar,
			datos.perimetro_cefalico,			
			datosUsuario.id_ebdi,
			datosUsuario.id_usuario
		]
	);
	datos.id=datosUsuario.id_usuario;
	res.json(datos);
}
async function matriculaInfantes(req, res){
	const [infantes] = await db.query(
        `SELECT p.matricula AS id, p.matricula
         FROM padron AS p
         INNER JOIN ebdis AS e
             ON e.ur = p.ur AND e.ebdi_num = p.ebdi
         WHERE e.id_ebdi = ?
           AND p.activo = 1
         ORDER BY p.matricula`,    // Query para listar las matriculas de infantes de una EBDI, usada para el listado en el frontend de creación
        [req.usuario.id_ebdi]		// de medidas
    );

    res.set("Access-Control-Expose-Headers", "X-Total-Count");
    res.set("X-Total-Count", infantes.length);
    res.json(infantes);
}
app.get("/matriculaInfantes", soloRoles(["estancia"]), async(req,res)=>{ //Endpont para la función previa
	try{
		let token=req.get("Authentication");
		let verifiedToken=jwt.verify(token, process.env.JWT_SECRET);  //Proceso de autenticación 
		let user = verifiedToken.Usuario;
		const [usuarios]=await db.query(
			"SELECT id_usuario, usuario, rol, id_region, id_ebdi FROM usuarios WHERE usuario = ? AND activo = 1",
			[user]
		);
		req.usuario=usuarios[0];
		await matriculaInfantes(req,res);
	}
	catch{
		res.sendStatus(401);
	}
})

app.get("/mediciones", async (req, res)=>{
	try{
		let token=req.get("Authentication");
		let verifiedToken=jwt.verify(token, process.env.JWT_SECRET);  // Proceso de autenticación 
		let user = verifiedToken.Usuario;
		const [usuarios]=await db.query(
			"SELECT id_usuario, usuario, rol, id_region, id_ebdi FROM usuarios WHERE usuario = ? AND activo = 1",
			[user]
		);
		req.usuario=usuarios[0];
		await getListMediciones(req, res);  // función de listar mediciones
	}
	catch{
		res.sendStatus(401);
	}
});
app.post("/mediciones", soloRoles(["estancia"]), async (req, res)=>{  // solo EBDIs puede registrar medidas de infantes
	try{
		await createMedicion(req, res);
	}
	catch{
		res.sendStatus(401);
	}
});

//Este endpoint fue creado con la ayuda de la inteligencia artificial Claude
app.get("/infantes/:id/estado", async (req, res)=>{
	try{
		let token=req.get("Authentication");
		let verifiedToken=jwt.verify(token, process.env.JWT_SECRET);
		let user = verifiedToken.Usuario;
		const [usuarios]=await db.query(
			"SELECT id_usuario, usuario, rol, id_region, id_ebdi FROM usuarios WHERE usuario = ? AND activo = 1",
			[user]
		); 
		req.usuario=usuarios[0];
	}
	catch{
		return res.sendStatus(401);
	}
	
	//Esta primera seccion es nuestra parte de autenticacion, esta no uso IA
	try{
		const id = Number(req.params.id);
		const alc = alcance(req.usuario);

		const [filas] = await db.query(
			"SELECT p.id_infante, p.genero, m.peso, m.talla, m.fecha, m.imc," +
			" TIMESTAMPDIFF(MONTH, p.fnac, m.fecha) AS edad_meses" +
			" FROM padron AS p" +
			" INNER JOIN ebdis AS e ON e.ur = p.ur AND e.ebdi_num = p.ebdi" +
			" INNER JOIN estados AS s ON s.id_estado = e.id_estado" +
			" INNER JOIN mediciones AS m ON m.id_infante = p.id_infante" +     // Extrae imedidas de un infante
			" WHERE p.activo = 1 AND p.id_infante = ?" + alc.sql +
			" ORDER BY m.fecha DESC, m.id_medicion DESC LIMIT 2",
			[id, ...alc.params]
		);
		if(filas.length == 0){
			return res.status(404).json({message: "Sin mediciones para este infante"});
		}
		//Esta busqueda de sql recupera todos los datos necesarios para la grafica
		const actual = filas[0];
		const anterior = filas[1];
		//la idea de tomar dos mediciones es de Claude
		const [refs] = await db.query(
			"SELECT p5, p85, p95 FROM cdc_imc_percentiles WHERE sexo = ? AND edad_meses = ?",
			[actual.genero, actual.edad_meses]  // Checa parámetros de IMC en base a sexo y edad 
		);
		if(refs.length == 0){
			return res.status(422).json({message: "La referencia CDC cubre de 24 a 72 meses de edad"});
		}
		/*Esta busqueda de sql no utiliza IA, se obtienen los percentiles
		de una tabla en la base de datos*/

		/*Esta ultima parte del endpoint es en la que se utilizo Claude para
		generarla se envian los datos necesarios como un objeto*/
		const umbrales = [Number(refs[0].p5), Number(refs[0].p85), Number(refs[0].p95)];
		
		res.json({
			id: id,
			valor: Number(actual.peso),
			unidad: "kg",
			anterior: anterior ? Number(anterior.peso) : null,
			umbrales: umbrales,
			imc: Number(actual.imc),
			edad_meses: actual.edad_meses,
			nombres: ["Bajo peso", "Peso saludable", "Sobrepeso", "Obesidad"],
		});
	}
	catch(err){
		console.error("Error en GET /infantes/:id/estado:", err);
		res.status(500).json({message: "No se pudo calcular el estado"});
	}
});

const options={
	key: fs.readFileSync("backend.key"), // Lee llave privada
	cert: fs.readFileSync("backend.crt")  // Certificado creado por nosostros
};

https.createServer(options,app).listen(PORT, async ()=>{  // Inicializar la conexión en Https para el backend
	await process.loadEnvFile(".env");
	await connectToDB();
	console.log("Backend corriendo en puerto 3000");
});