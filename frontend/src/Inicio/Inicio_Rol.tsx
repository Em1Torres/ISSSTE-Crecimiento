// Inicio_Rol.tsx determina qué página de inicio corresponde a cada perfil.
// Redirige al usuario según su rol y nivel de permisos.


import { usePermissions } from "react-admin";
import { AdminInicio } from "./Admin_inicio";
import { EstanciaInicio } from "./EBDI_inicio";
import { PadreInicio } from "./Padre_inicio";
import { RegionalInicio } from "./Regional_inicio";

export const InicioRol = () => {
    const {isPending, permissions}=usePermissions();
    if(isPending){
        return null;
    }
    if(permissions == "admin"){
        return <AdminInicio />;
    }
    if(permissions=="regional"){
        return <RegionalInicio />;
    }
    if (permissions =="estancia"){
        return <EstanciaInicio />;
    }
    return <PadreInicio />;
};