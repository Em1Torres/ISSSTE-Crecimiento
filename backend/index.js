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

const columnasInfantes = "id_infante AS id, matricula, curp, nombre, paterno, materno, genero, fnac, ur, ebdi, activo";
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

	const [resultadoConteo] = await db.query("SELECT COUNT(*) AS total FROM padron");
	let total = resultadoConteo[0].total;

	let consulta = "SELECT " + columnasInfantes + " FROM padron ORDER BY " + columna + " " + direccion + " LIMIT ? OFFSET ?";
	const [ninos] = await db.query(consulta, [cuantos, inicio]);

	res.set("Access-Control-Expose-Headers", "X-Total-Count");
	res.set("X-Total-Count", total);
	res.json(ninos);
}

async function getOneInfante(req, res){
	let id = Number(req.params.id);
	let consulta = "SELECT " + columnasInfantes + " FROM padron WHERE id_infante = ?";
	const [nino] = await db.query(consulta, [id]);
	res.json(nino[0]);
}

async function updateInfante(req, res){
	let id = Number(req.params.id);
	let datos = req.body;
	let consulta = "UPDATE padron SET matricula = ?, curp = ?, nombre = ?, paterno = ?, materno = ?, genero = ?, fnac = ?, ur = ?, ebdi = ?, activo = ? WHERE id_infante = ?";
	await db.query(consulta, [datos.matricula, datos.curp, datos.nombre, datos.paterno, datos.materno, datos.genero, datos.fnac, datos.ur, datos.ebdi, datos.activo, id]);
	await getOneInfante(req, res);
}

async function createInfante(req, res){
	let datos = req.body;
	let consulta = "INSERT INTO padron (matricula, curp, nombre, paterno, materno, genero, fnac, ur, ebdi, activo, " + columnasExtra + ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, " + valoresExtra + ")";
	const [resultado] = await db.query(consulta, [datos.matricula, datos.curp, datos.nombre, datos.paterno, datos.materno, datos.genero, datos.fnac, datos.ur, datos.ebdi, datos.activo]);
	datos.id=resultado.insertId;
	console.log(datos);
	res.json(datos);
}

async function deleteInfante(req, res){
	let id = Number(req.params.id);
	const[ninos]=await db.query("SELECT " + columnasInfantes + " FROM padron WHERE id_infante = ?", [id]);
	await db.query("DELETE FROM padron WHERE id_infante = ?", [id]);
	res.json(ninos[0]);
}

app.get("/infantes", async (req, res)=>{
	await getListInfantes(req, res);
});

app.get("/infantes/:id", async (req, res)=>{
	await getOneInfante(req, res);
});

app.put("/infantes/:id", async (req, res)=>{
	await updateInfante(req, res);
})

app.post("/infantes", async (req, res)=>{
	await createInfante(req, res);
});

app.delete("/infantes/:id", async (req, res)=>{
	await deleteInfante(req, res);
});
// ---------- MEDICIONES ----------
const DIAS_ENTRE_MEDICIONES = 45; // R02: una medición nueva solo 45 días después de la anterior
const ordenMediciones = ["id", "fecha", "peso", "talla"];

// infanteVisible: true si ese infante está dentro del alcance del usuario
async function infanteVisible(usuario, idInfante){
	// const a = alcance(usuario);
	let results = [];
	let consulta;
	let baseQuery = "SELECT padron.id_infante FROM padron INNER JOIN ebdis ON ebdis.ur = padron.ur AND ebdis.ebdi_num = padron.ebdi INNER JOIN estados ON estados.id_estado = ebdis.id_estado WHERE padron.activo = 1 AND padron.id_infante = ?";
	if(usuario.rol == "admin:"){
		results = await db.query(baseQuery, [idInfante]);
	}
	else if(usuario.rol == "regional"){
		consulta = baseQuery + " AND estados.id_region = ?";
		results = await db.query(consulta,[idInfante, usuario.id_region]);
	}
	else if(usuario.rol == "estancia"){
		consulta = baseQuery + " AND ebdis.id_ebdi = ?";
		results = await db.query(consulta,[idInfante, usuario.id_ebdi]);
	}
	else if(usuario.rol == "padre"){
		consulta = baseQuery + " AND p.id_infante IN (SELECT id_infante FROM padres_infantes WHERE id_usuario = ?";
		results = await db.query(consulta,[idInfante, usuario.id_usuario]);
	}
	else{
		consulta = baseQuery + " AND 10 = 20";
		results = await db.query(consulta, [idInfante]);
	}
	return filas.length > 0;
}

// GET /mediciones?id_infante=1&_sort=fecha&_order=DESC&_start=0&_end=10
async function getListMediciones(req, res){
	try{
		const idInfante = Number(req.query.id_infante);
		if(!idInfante || !(await infanteVisible(req.usuario, idInfante))){
			return res.status(404).json({message: "Infante no encontrado"});
		}

		let columna = "id";
		if(ordenMediciones.includes(req.query._sort)){
			columna = req.query._sort;
		}
		let direccion = "ASC";
		if(req.query._order == "DESC"){
			direccion = "DESC";
		}
		let inicio = Number(req.query._start) || 0;
		let cuantos = (Number(req.query._end) || 10) - inicio;

		const [conteo] = await db.query("SELECT COUNT(*) AS total FROM mediciones WHERE id_infante = ?", [idInfante]);
		const [mediciones] = await db.query(
			"SELECT id_medicion AS id, id_infante, fecha, peso, talla, talla_blanco_familiar, perimetro_cefalico FROM mediciones WHERE id_infante = ? ORDER BY " + columna + " " + direccion + " LIMIT ? OFFSET ?",
			[idInfante, cuantos, inicio]);

		res.set("Access-Control-Expose-Headers", "X-Total-Count");
		res.set("X-Total-Count", conteo[0].total);
		res.json(mediciones);
	}catch(err){
		console.error("Error en GET /mediciones:", err);
		res.status(500).json({message: "No se pudieron obtener las mediciones"});
	}
}

// POST /mediciones: guarda una medición nueva
async function createMedicion(req, res){
	try{
		// FR10 y R05: captura la estancia (o el admin); el padre solo consulta
		if(req.usuario.rol != "estancia" && req.usuario.rol != "admin"){
			return res.status(403).json({message: "Tu rol no puede registrar mediciones"});
		}

		const datos = req.body;
		const idInfante = Number(datos.id_infante);
		if(!idInfante || !(await infanteVisible(req.usuario, idInfante))){
			return res.status(404).json({message: "Infante no encontrado"});
		}

		// R01: solo estas cuatro medidas (la edad se calcula), todas números mayores a 0
		const medidas = [datos.peso, datos.talla, datos.talla_blanco_familiar, datos.perimetro_cefalico];
		if(medidas.some(m => !(Number(m) > 0))){
			return res.status(400).json({message: "Peso, talla, talla del blanco familiar y perímetro cefálico deben ser números mayores a 0"});
		}

		// R02: días desde la última medición (null si el infante no tiene ninguna). El admin se salta la regla
		const [ultima] = await db.query("SELECT DATEDIFF(CURDATE(), MAX(fecha)) AS dias FROM mediciones WHERE id_infante = ?", [idInfante]);
		const dias = ultima[0].dias;
		if(req.usuario.rol != "admin" && dias !== null && dias < DIAS_ENTRE_MEDICIONES){
			return res.status(400).json({message: "Faltan " + (DIAS_ENTRE_MEDICIONES - dias) + " días para registrar otra medición"});
		}

		const [resultado] = await db.query(
			"INSERT INTO mediciones (id_infante, fecha, peso, talla, talla_blanco_familiar, perimetro_cefalico, id_usuario) VALUES (?, CURDATE(), ?, ?, ?, ?, ?)",
			[idInfante, Number(datos.peso), Number(datos.talla), Number(datos.talla_blanco_familiar), Number(datos.perimetro_cefalico), req.usuario.id_usuario]);

		res.json({id: resultado.insertId, id_infante: idInfante});
	}catch(err){
		console.error("Error en POST /mediciones:", err);
		res.status(500).json({message: "No se pudo guardar la medición"});
	}
}

app.get("/mediciones", requireAuth, getListMediciones);
app.post("/mediciones", requireAuth, createMedicion);


app.listen(PORT, async ()=>{
	await connectToDB();
	console.log("Backend corriendo en puerto 3000");
});
