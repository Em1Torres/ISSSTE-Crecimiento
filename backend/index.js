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
const ordenPermitido = ["id", "matricula", "nombre", "paterno", "materno", "fnac", "ebdi"];
//Columnas que son obligatorias que no están en nuestro formulario, son NOT NULL y no tieneen valor por defecto
//Columnas de números les ponemos 0, columnas de fecha usamos la fecha de HOY, CURDATE()
//Columna usuario=sistema
//Columna estatus_servicio=1
const columnasExtra = "id_benef_infante, freg, estatus_servicio, fmovimiento, fCambioEst_ini, fCambioEst_fin, fCambioEbdi_ini, fCambioEbdi_fin, fBaja, fCambio, discapacidad, dif_cvrp, dif_cvfn, dif_pat, dif_mat, usuario, inscripIniAbril21, inscripIniMayo21, inscripIniJunio21, inscripIniJulio21, inscIniDic2021, inscIniAbr2023, inscIniMay2023, inscIniJun2023, inscIniJul2023, inscIniAgo2023, inscIniSep2023, inscIniOct2023, inscIniNov2023, inscIniDic2023, inscIniEne2024, inscIniFeb2024, inscIniMar2024, inscIniAbr2024, inscIniMay2024, inscIniJun2024, inscIniJul2024, inscIniAgo2024, inscIniSep2024, inscIniOct2024, inscIniNov2024, InscIniDic2024, InscIniEne2025, InscIniFeb2025, InscIniMar2025, InscIniAbr2025";
const valoresExtra = "0, CURDATE(), 1, CURDATE(), CURDATE(), CURDATE(), CURDATE(), CURDATE(), CURDATE(), CURDATE(), 0, 0, 0, 0, 0, 'sistema', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0";

async function connectToDB(){
	db = await mysql.createPool({
		host: "localhost",
		user: "root",
		password: "#Clifjumper4406",
		database: "padronISSSTE",
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
	let alc = alcance(req.usuario)

	const [resultadoConteo] = await db.query("SELECT COUNT(*) AS total " + queryFrom + " WHERE p.activo = 1" + alc.sql, alc.params);
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

async function getOneInfante(req, res){
	let id = Number(req.params.id);
	let consulta = "SELECT id_infante AS id, matricula, nombre, paterno, materno, genero, fnac FROM padron WHERE id_infante = ?";
	const [nino] = await db.query(consulta, [id]);
	res.json(nino[0]);
}

async function updateInfante(req, res){
    let id = Number(req.params.id);
    let datos = req.body;
    let consulta = "UPDATE padron SET matricula = ?, nombre = ?, paterno = ?, materno = ?, genero = ?, fnac = ? WHERE id_infante = ?";
    await db.query(consulta, [datos.matricula, datos.nombre, datos.paterno, datos.materno, datos.genero, datos.fnac, id]);
    // consulta = "UPDATE ebdis SET nombre = ?";
    // await db.query(consulta, [datos.matricula, datos.nombre, datos.paterno, datos.materno, datos.genero, datos.fnac, id]);
    // await db.query(consulta, [datos.ur, datos.ebdi, datos.activo, ]);
    await getOneInfante(req, res);
}

// async function createInfante(req, res){
// 	let datos = req.body;
// 	let consulta = "INSERT INTO padron (matricula, curp, nombre, paterno, materno, genero, fnac, ur, ebdi, activo, " + columnasExtra + ") VALUES (?, 'TOCE1', ?, ?, ?, ?, ?, ?, ?, ?, " + valoresExtra + ")";
// 	const [resultado] = await db.query(consulta, [datos.matricula, datos.nombre, datos.paterno, datos.materno, datos.genero, datos.fnac, datos.ur, datos.ebdi, datos.activo]);
// 	datos.id=resultado.insertId;
// 	console.log(datos);
// 	res.json(datos);
// }

async function deleteInfante(req, res){
	let id = Number(req.params.id);
	await db.query("DELETE FROM padron WHERE id_infante = ?", [id]);
	res.json({success: true});
}

app.get("/infantes", async (req, res)=>{
	try{
		let  token=req.get("Authentication");
		await jwt.verify(token, "llavesecreta");
		await getListInfantes(req, res);
	}
	catch{
		res.sendStatus(401);
	}
});

app.get("/infantes/:id", async (req, res)=>{
	try{
		let  token=req.get("Authentication");
		await jwt.verify(token, "llavesecreta");
		await getOneInfante(req, res);
	}
	catch{
		res.sendStatus(401);
	}
});

app.put("/infantes/:id",soloRoles("admin", "estancia"),  async (req, res)=>{
	try{
		let  token=req.get("Authentication");
		await jwt.verify(token, "llavesecreta");
		await updateInfante(req, res);
	}
	catch{
		res.sendStatus(401);
	}
})

app.post("/infantes", soloRoles("admin", "estancia"),  async (req, res)=>{
	try{
		let  token=req.get("Authentication");
		await jwt.verify(token, "llavesecreta");
		await createInfante(req, res);
	}
	catch{
		res.sendStatus(401);
	}
});

app.delete("/infantes/:id", soloRoles("admin", "estancia"),  async (req, res)=>{
	try{
		let  token=req.get("Authentication");
		await jwt.verify(token, "llavesecreta");
		await deleteInfante(req, res);
	}
	catch{
		res.sendStatus(401);
	}
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
const SECRET = "llavesecreta"; 

function soloRoles(permitidos){
	return (req, res, next)=>{
		if(permitidos.includes(req.usuario.rol)){
			return next();
		}
		return res.sendStatus(403).json({message: "Tu rol no puede hacer esto"});
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
	const[usuarios]=await db.query("SELECT * FROM usuarios WHERE usuario = ?", [username]);
	if(usuarios.length==0){
		res.sendStatus(401);
	}
	else{
		let usuario =usuarios[0];
		if(await argon2.verify(usuario.password_hash, password)){
			let token=jwt.sign({"Usuario": usuario.usuario}, "llavesecreta", {expiresIn: 900});
			res.json({"token": token, "id": usuario.usuario, "rol": usuario.rol});
		}
		else{
			res.sendStatus(401);
		}
	}
})
app.listen(PORT, async ()=>{
	await connectToDB();
	console.log("Backend corriendo en puerto 3000");
});
