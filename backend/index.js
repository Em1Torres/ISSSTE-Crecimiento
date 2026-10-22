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
		+ " INNER JOIN regiones AS r ON r.id_region = s.id_region"
		+ " WHERE p.activo = 1" + alc.sql, alc.params);
	let total = resultadoConteo[0].total;

	let consulta = "SELECT p.id_infante AS id, p.matricula, p.nombre, p.paterno, p.materno, p.genero, p.fnac, e.nombre AS ebdi, s.nombre AS estado" +
	" FROM padron AS p" +
	" INNER JOIN ebdis AS e ON e.ur = p.ur AND e.ebdi_num = p.ebdi"+
	" INNER JOIN estados AS s ON s.id_estado = e.id_estado" + 
	" INNER JOIN regiones AS r ON r.id_region = s.id_region" + 
	" WHERE p.activo = 1" + alc.sql + 
	" ORDER BY " + columna + " " + direccion +
	" LIMIT ? OFFSET ?";
	
	const [ninos] = await db.query(consulta, [...alc.params, cuantos, inicio]);

	res.set("Access-Control-Expose-Headers", "X-Total-Count");
	res.set("X-Total-Count", total);
	res.json(ninos);
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

app.get("/infantes/:id", async (req, res)=>{
	try{
		let token=req.get("Authentication");
		let verifiedToken=jwt.verify(token, process.env.JWT_SECRET);
		let user = verifiedToken.Usuario;
		await getOneInfante(req, res);
	}
	catch{
		res.sendStatus(401);
	}
});

app.put("/infantes/:id",  soloRoles(["admin", "estancia"]),  async (req, res)=>{
	try{
		let token=req.get("Authentication");
		let verifiedToken=jwt.verify(token, process.env.JWT_SECRET);
		let user = verifiedToken.Usuario;
		const [usuarios]=await db.query(
			"SELECT id_usuario, usuario, rol, id_region, id_ebdi FROM usuarios WHERE usuario = ? AND activo = 1",
			[user]
		);
		req.usuario=usuarios[0];
		await updateInfante(req, res);
	}
	catch{
		res.sendStatus(401);
	}
		
});

app.post("/infantes",  soloRoles(["admin", "estancia"]),  async (req, res)=>{
	try{
		let token=req.get("Authentication");
		let verifiedToken=jwt.verify(token, process.env.JWT_SECRET);
		let user = verifiedToken.Usuario;
		const [usuarios]=await db.query(
			"SELECT id_usuario, usuario, rol, id_region, id_ebdi FROM usuarios WHERE usuario = ? AND activo = 1",
			[user]
		);
		req.usuario=usuarios[0];
		await createInfante(req, res);	
	}
	catch{
		res.sendStatus(401);
	}
	
});

app.delete("/infantes/:id",  soloRoles(["admin", "estancia"]),  async (req, res)=>{	
	try{
		let token=req.get("Authentication");
		let verifiedToken=jwt.verify(token, process.env.JWT_SECRET);
		let user = verifiedToken.Usuario;
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
		await db.query("INSERT INTO usuarios (usuario, password_hash, rol) VALUES (?, ?, ?)", [username, hash, "estancia"]);
		res.sendStatus(201);
	}
	else{
		res.sendStatus(403);
	}
})

function soloRoles(permitidos){
	return async (req, res, next)=>{
		try{
			let token=req.get("Authentication");
			let verifiedToken=jwt.verify(token, process.env.JWT_SECRET);
			const [usuarios]=await db.query(
				"SELECT id_usuario, usuario, rol, id_region, id_ebdi FROM usuarios WHERE usuario = ? AND activo = 1",
				[verifiedToken.Usuario]
			);
			if(usuarios.length === 0){
				return res.sendStatus(401);
			}
			req.usuario=usuarios[0];
			if(permitidos.includes(req.usuario.rol)){
				return next();
			}
			return res.status(403).json({message: "Tu rol no puede hacer esto"});
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
			"SELECT m.id_medicion AS id, m.id_infante, m.fecha, m.peso, m.talla, m.talla_blanco_familiar, m.perimetro_cefalico, " +
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

async function createMedicion(req, res){
	let datos = req.body;
	let datosUsuario = req.usuario;

	const [resultados] = await db.query(
		"CALL anadirMedicion(?,?,?,?,?,?,?)",
		[
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
         ORDER BY p.matricula`,
        [req.usuario.id_ebdi]
    );

    res.set("Access-Control-Expose-Headers", "X-Total-Count");
    res.set("X-Total-Count", infantes.length);
    res.json(infantes);
}
app.get("/matriculaInfantes", soloRoles(["estancia"]), async(req,res)=>{
	try{
		let token=req.get("Authentication");
		let verifiedToken=jwt.verify(token, process.env.JWT_SECRET);
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
app.post("/mediciones", soloRoles(["estancia"]), async (req, res)=>{
	try{
		let token=req.get("Authentication");
		let verifiedToken=jwt.verify(token, process.env.JWT_SECRET);
		let user = verifiedToken.Usuario;
		const [usuarios]=await db.query(
			"SELECT id_usuario, usuario, rol, id_region, id_ebdi FROM usuarios WHERE usuario = ? AND activo = 1",
			[user]
		);
		req.usuario=usuarios[0];
		await createMedicion(req, res);
	}
	catch{
		res.sendStatus(401);
	}
});

app.listen(PORT, async ()=>{
	await connectToDB();
	console.log("Backend corriendo en puerto 3000");
});
