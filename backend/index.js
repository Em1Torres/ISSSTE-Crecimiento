require("dotenv").config();
const express=require("express");
const mysql=require("mysql2/promise");
var cors=require("cors");
const bodyParser=require("body-parser")
const argon2=require("argon2");
const app=express();
const jwt=require("jsonwebtoken");

const PORT=3000;
let db;
app.use(cors());
app.use(bodyParser.json());

const columnasInfantes = "p.id_infante AS id, p.matricula, p.nombre, p.paterno, p.materno, p.genero, p.fnac, e.nombre AS ebdi, s.nombre AS estado"
const ordenPermitido = ["id", "matricula", "nombre", "paterno", "materno", "fnac", "ebdi", "id_ebdi"];
//Columnas que son obligatorias que no están en nuestro formulario, son NOT NULL y no tieneen valor por defecto
//Columnas de números les ponemos 0, columnas de fecha usamos la fecha de HOY, CURDATE()
//Columna usuario=sistema
//Columna estatus_servicio=1
// const columnasExtra = "id_benef_infante, freg, estatus_servicio, fmovimiento, fCambioEst_ini, fCambioEst_fin, fCambioEbdi_ini, fCambioEbdi_fin, fBaja, fCambio, discapacidad, dif_cvrp, dif_cvfn, dif_pat, dif_mat, usuario, inscripIniAbril21, inscripIniMayo21, inscripIniJunio21, inscripIniJulio21, inscIniDic2021, inscIniAbr2023, inscIniMay2023, inscIniJun2023, inscIniJul2023, inscIniAgo2023, inscIniSep2023, inscIniOct2023, inscIniNov2023, inscIniDic2023, inscIniEne2024, inscIniFeb2024, inscIniMar2024, inscIniAbr2024, inscIniMay2024, inscIniJun2024, inscIniJul2024, inscIniAgo2024, inscIniSep2024, inscIniOct2024, inscIniNov2024, InscIniDic2024, InscIniEne2025, InscIniFeb2025, InscIniMar2025, InscIniAbr2025";
// const valoresExtra = "0, CURDATE(), 1, CURDATE(), CURDATE(), CURDATE(), CURDATE(), CURDATE(), CURDATE(), CURDATE(), 0, 0, 0, 0, 0, 'sistema', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0";

const ordenUsuario =["id", "usuario", "rol", "activo"];

async function connectToDB(){
	db = await mysql.createPool({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		dateStrings: true
	});
	console.log("conectado a la base de datos");
}

async function getListInfantes(req, res){
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
	let alc = alcance(req.usuario);

	const [resultadoConteo] = await db.query("SELECT COUNT(*) AS total " + " FROM padron AS p" +
		" INNER JOIN ebdis AS e ON e.ur = p.ur AND e.ebdi_num = p.ebdi"+
		" INNER JOIN estados AS s ON s.id_estado = e.id_estado"
		+ " WHERE p.activo = 1" + alc.sql, alc.params);
	let total = resultadoConteo[0].total;

	let consulta = "SELECT p.id_infante AS id, p.matricula, p.nombre, p.paterno, p.materno, p.genero, p.fnac, e.nombre AS ebdi, s.nombre AS estado" +
	" FROM padron AS p" +
	" INNER JOIN ebdis AS e ON e.ur = p.ur AND e.ebdi_num = p.ebdi"+
	" INNER JOIN estados AS s ON s.id_estado = e.id_estado" + 
	" WHERE p.activo = 1" + alc.sql + 
	" ORDER BY " + columna + " " + direccion +
	" LIMIT ? OFFSET ?";
	
	const [ninos] = await db.query(consulta, [...alc.params, cuantos, inicio]);

	res.set("Access-Control-Expose-Headers", "X-Total-Count");
	res.set("X-Total-Count", total);
	res.json(ninos);
}

async function getListUsuarios(req, res) {
	let consulta="SELECT u.id_usuario AS id, u.usuario, u.rol, u.activo, r.nombre AS region, e.nombre AS ebdi"
	+ " FROM usuarios AS u" +
	" LEFT JOIN regiones AS r ON r.id_region = u.id_region" +
	" LEFT JOIN ebdis AS e ON e.id_ebdi = u.id_ebdi";
	const [usuarios]=await db.query(consulta);
	res.set("Access-Control-Expose-Headers", "X-Total-Count");
	res.set("X-Total-Count", usuarios.length);
	res.json(usuarios);
}

async function getListEbdis(req,res){
	let [consulta] = await db.query(`SELECT id_ebdi AS id, nombre
		FROM ebdis`);
	
	res.json(consulta);
}

async function getOneInfante(req, res){
	let id = Number(req.params.id);
	let consulta = `SELECT p.id_infante AS id, p.matricula, p.nombre, p.paterno, p.materno, p.genero, p.fnac
	FROM padron AS p 
	WHERE id_infante = ?`;
	const [nino] = await db.query(consulta, [id]);
	res.json(nino[0]);
}

async function getOneUsuario(req, res){
	let id= Number(req.params.id);
	let consulta="SELECT id_usuario AS id, usuario, rol, id_region, id_ebdi, activo FROM usuarios WHERE id_usuario = ?";
	const [usuario]=await db.query(consulta, [id]);
	res.json(usuario[0]);
}

async function updateInfante(req, res){
    let id = Number(req.params.id);
    let datos = req.body;
    let consulta = "CALL editarInfante(?,?,?,?,?,?,?,?)";
    await db.query(consulta, [datos.matricula, datos.nombre, datos.paterno, datos.materno, datos.genero, datos.fnac, datos.ebdi, id]);
    // consulta = "UPDATE ebdis SET nombre = ?";
    // await db.query(consulta, [datos.matricula, datos.nombre, datos.paterno, datos.materno, datos.genero, datos.fnac, id]);
    // await db.query(consulta, [datos.ur, datos.ebdi, datos.activo, ]);
    console.log(await getOneInfante(req, res));
}

async function updateUsuario(req, res) {
	let id=Number(req.params.id);
	let datos=req.body;
	let consulta="UPDATE usuarios SET usuario = ?, rol=?, id_region=?, id_ebdi=? WHERE id_usuario=?";
	await db.query(consulta, [datos.usuario, datos.rol, datos.id_region, datos.id_ebdi, id]);
	await getOneUsuario(req, res);
}

async function createInfante(req, res){
	let datos = req.body;
	let consulta = "CALL anadirInfante(?,?,?,?,?,?,?)";
	const [resultado] = await db.query(consulta, 
		[datos.matricula, datos.ebdi, datos.nombre, datos.paterno, datos.materno, datos.genero, datos.fnac]);
	datos.id=resultado.insertId;
	res.json(datos);
}

async function deleteInfante(req, res){
	let id = Number(req.params.id);
	await db.query("DELETE FROM padron WHERE id_infante = ?", [id]);
	res.json({success: true});
}

async function deleteUsuario(req, res){
	let id=Number(req.params.id);
	const[usuario]=await db.query("SELECT id_usuario AS id, usuario, rol FROM usuarios WHERE id_usuario=?", [id]);
	await db.query("DELETE FROM padres_infantes WHERE id_usuario = ?", [id]);
	await db.query("DELETE FROM usuarios WHERE id_usuario=?", [id]);
	res.json(usuario[0]);
	
}

app.get("/infantes", async (req, res)=>{
	try{
		let token=req.get("Authentication");
		let verifiedToken=jwt.verify(token, process.env.JWT_SECRET);
		let user = verifiedToken.Usuario;
		const [usuarios]=await db.query(
			"SELECT id_usuario, usuario, rol, id_region, id_ebdi FROM usuarios WHERE usuario = ? AND activo = 1",
			[user]
		);
		req.usuario=usuarios[0];
		await getListInfantes(req, res);
	}
	catch{
		res.sendStatus(401);
	}
		
});

app.get("/ebdis", async (req, res)=>{
	await getListEbdis(req,res);
})

app.get("/usuarios", soloRoles(["admin"]), async(req, res)=>{
	await getListUsuarios(req, res);
});

app.get("/infantes/:id", async (req, res)=>{
	
	await getOneInfante(req, res);

});

app.get("/usuarios/:id", soloRoles(["admin"]), async (req, res)=>{
	await getOneUsuario(req, res);
});

app.put("/infantes/:id",  soloRoles(["admin", "estancia"]),  async (req, res)=>{
	await updateInfante(req, res);
});

app.put("/usuarios/:id", soloRoles(["admin"]), async(req, res)=>{
	await updateUsuario(req, res);
})

app.post("/infantes",  soloRoles(["admin", "estancia"]),  async (req, res)=>{
	await createInfante(req, res);	
});

app.delete("/infantes/:id",  soloRoles(["admin", "estancia"]),  async (req, res)=>{	
	await deleteInfante(req, res);
});

app.delete("/usuarios/:id", soloRoles(["admin"]), async (req, res)=>{
	await deleteUsuario(req, res);
});

app.post("/registrarse", async (req, res)=>{
	let username=req.body.username;
	let password=req.body.password;
	const[usuarios]=await db.query("SELECT * FROM usuarios WHERE usuario = ? AND activo = 1", [username]);
	if(usuarios.length==0){
		const hash=await argon2.hash(password, {type: argon2.argon2id, memoryCost: 64*1024, timeCost: 3, parallelism: 1, saltLength: 128});
		await db.query("INSERT INTO usuarios (usuario, password_hash, rol) VALUES (?, ?, ?)", [username, hash, "padre"]);
		res.sendStatus(201);
	}
	else{
		res.sendStatus(403);
	}
})

function soloRoles(permitidos){
	return async (req, res, next)=>{
		let token=req.get("Authentication");
		let verifiedToken=jwt.verify(token, process.env.JWT_SECRET);
		let user = verifiedToken.Usuario;
		const [usuario]=await db.query(
			"SELECT id_usuario, usuario, rol, id_region, id_ebdi FROM usuarios WHERE usuario = ? AND activo = 1",
			[user]
		);

		let permission=false;
		for(let i=0;i<permitidos.length;i++){
			if(permitidos[i] == usuario[0].rol){
				permission=true;
			}
		}
		if(permission){
			return next();
		}
		return res.status(403).json({message: "Tu rol no puede hacer esto"});
	}
}
function alcance(usuario){
	if(usuario.rol == "admin"){
		return {sql: "", params: []}; 
	}
	if(usuario.rol == "regional"){ 
		return {sql: " AND s.id_region = ?", params: [usuario.id_region]}; 
	}
	if(usuario.rol == "estancia"){ 
		return {sql: " AND e.id_ebdi = ?", params: [usuario.id_ebdi]}; 
	}
	if(usuario.rol == "padre"){
		return {sql: " AND p.id_infante IN (SELECT id_infante FROM padres_infantes WHERE id_usuario = ?)", params: [usuario.id_usuario]};
	}
	return {sql: " AND 1 = 0", params: []};
}
app.post("/login", async (req, res)=>{
	let username=req.body.username;
	let password=req.body.password;
	const[usuarios]=await db.query("SELECT * FROM usuarios WHERE activo = 1 AND usuario = ?", [username]);
	if(usuarios.length==0){
		res.sendStatus(401);
	}
	else{
		let usuario =usuarios[0];
		if(await argon2.verify(usuario.password_hash, password)){
			let token=jwt.sign({"Usuario": usuario.usuario}, process.env.JWT_SECRET, {expiresIn: 900});
			res.json({"token": token, "id": usuario.usuario, "rol": usuario.rol});
		}
		else{
			res.sendStatus(401);
		}
	}
})

// Mediciones
// ---------- MEDICIONES ----------


// GET /mediciones?id_infante=1&_sort=fecha&_order=DESC&_start=0&_end=10
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
			" WHERE p.activo = 1" + alc.sql, alc.params);
		let total = conteo[0].total;

		const [mediciones] = await db.query(
			"SELECT m.id_medicion AS id, m.id_infante, m.fecha, m.peso, m.talla, m.talla_blanco_familiar, m.perimetro_cefalico, " +
			"TIMESTAMPDIFF(MONTH, p.fnac, m.fecha) AS edad_meses, p.nombre AS infante, e.nombre AS nombre_ebdi, s.nombre AS estado" +
			" FROM mediciones AS m INNER JOIN padron AS p ON p.id_infante = m.id_infante" +
			" INNER JOIN ebdis AS e ON e.ur = p.ur AND e.ebdi_num = p.ebdi" +
			" INNER JOIN estados AS s ON s.id_estado = e.id_estado" +
			" WHERE p.activo = 1" + alc.sql+
			" ORDER BY " + columna + " " + direccion + 
			" LIMIT ? OFFSET ?",
			[...alc.params, cuantos, inicio]);

		res.set("Access-Control-Expose-Headers", "X-Total-Count");
		res.set("X-Total-Count", total);
		res.json(mediciones);

}

// POST /mediciones: guarda una medición nueva
// async function createMedicion(req, res){
// 	try{
// 		// FR10 y R05: captura la estancia (o el admin); el padre solo consulta
// 		if(req.usuario.rol != "estancia" && req.usuario.rol != "admin"){
// 			return res.status(403).json({message: "Tu rol no puede registrar mediciones"});
// 		}

// 		const datos = req.body;
// 		const idInfante = Number(datos.id_infante);
// 		if(!idInfante || !(await infanteVisible(req.usuario, idInfante))){
// 			return res.status(404).json({message: "Infante no encontrado"});
// 		}

// 		// R01: solo estas cuatro medidas (la edad se calcula), todas números mayores a 0
// 		const medidas = [datos.peso, datos.talla, datos.talla_blanco_familiar, datos.perimetro_cefalico];
// 		if(medidas.some(m => !(Number(m) > 0))){
// 			return res.status(400).json({message: "Peso, talla, talla del blanco familiar y perímetro cefálico deben ser números mayores a 0"});
// 		}

// 		// R02: días desde la última medición (null si el infante no tiene ninguna). El admin se salta la regla
// 		const [ultima] = await db.query("SELECT DATEDIFF(CURDATE(), MAX(fecha)) AS dias FROM mediciones WHERE id_infante = ?", [idInfante]);
// 		const dias = ultima[0].dias;
// 		if(req.usuario.rol != "admin" && dias !== null && dias < DIAS_ENTRE_MEDICIONES){
// 			return res.status(400).json({message: "Faltan " + (DIAS_ENTRE_MEDICIONES - dias) + " días para registrar otra medición"});
// 		}

// 		const [resultado] = await db.query(
// 			"INSERT INTO mediciones (id_infante, fecha, peso, talla, talla_blanco_familiar, perimetro_cefalico, id_usuario) VALUES (?, CURDATE(), ?, ?, ?, ?, ?)",
// 			[idInfante, Number(datos.peso), Number(datos.talla), Number(datos.talla_blanco_familiar), Number(datos.perimetro_cefalico), req.usuario.id_usuario]);

// 		res.json({id: resultado.insertId, id_infante: idInfante});
// 	}catch(err){
// 		console.error("Error en POST /mediciones:", err);
// 		res.status(500).json({message: "No se pudo guardar la medición"});
// 	}
// }

app.get("/mediciones", async (req, res)=>{
	try{
		let token=req.get("Authentication");
		let verifiedToken=jwt.verify(token, process.env.JWT_SECRET);
		let user = verifiedToken.Usuario;
		const [usuarios]=await db.query(
			"SELECT id_usuario, usuario, rol, id_region, id_ebdi FROM usuarios WHERE usuario = ? AND activo = 1",
			[user]
		);
		req.usuario=usuarios[0];
		await getListMediciones(req, res);
	}
	catch{
		res.sendStatus(401);
	}
});
// app.post("/mediciones", requireAuth, createMedicion);

app.listen(PORT, async ()=>{
	await connectToDB();
	console.log("Backend corriendo en puerto 3000");
});
