import React, {useState, ChangeEvent} from "react";
import {useNotify, useRedirect} from "react-admin";

// Esta funcion permite registrar nuevos usuarios, enviando sus datos al backend
// y mostrando una notificación de éxito o error según el resultado del registro.
const Registrarse: React.FC =()=>{
    const [datos, setDatos]=useState({username:"", password:""});
    const notify = useNotify();
    const redirect = useRedirect();

    const handleChange=(event:ChangeEvent<HTMLInputElement>)=>{setDatos({...datos, [event.target.name]:event.target.value})};
     
    const handleSendData=async()=>{
        const request= new Request("https://localhost:3000/registrarse", {
            method: "POST",
            body: JSON.stringify(datos),
            headers: new Headers({"Content-Type": "application/json"})
        });
        try{
            const res=await fetch(request)
            if(res.status<200 || res.status>=300){
                throw new Error(res.statusText);
            }
            notify(`Usuario creado, inicia sesión`, {type: 'success'});
            redirect("/login");
        }catch{
            notify("No se pudo registrar el usuario", {type: "error"});
        }

    };
    
    
    return(
    // Pagina de registrarse 
        <div>
            <h2> Registro de usuario</h2>
            <form>
                <div>
                    <label>Usuario: </label>
                    <input type="text" id="username" name="username" value={datos.username} onChange={handleChange}/>
                </div>
                <div>
                    <label>Password: </label>
                    <input type="password" id="password" name="password" value={datos.password} onChange={handleChange} />
                </div>
                <div>
                    <button type="button" onClick={handleSendData}>
                        Crear usuario
                    </button>
                </div>
            </form>
        </div>
    )
}
export default Registrarse;