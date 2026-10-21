import { Admin, Resource , CustomRoutes} from "react-admin";
import {Route} from "react-router-dom";
import { Layout } from "./Layout";
import {listarInfantes, editarInfantes, crearInfante} from "./Infantes";
import {dataProvider} from "./dataProvider";
import Registrarse from "./registrarse";
import authProvider from "./AuthProvider";
import { crearEBDI, crearPerfil, editarEBDI, editarPerfiles } from "./Inicio/Admin_inicio";
import { Inicio } from "./Inicio/Inicio";
import { listarMediciones } from "./Mediciones";
// @ts-expect-error Graphs.jsx has no TypeScript declaration file.
import { GraphsPage } from "./Graphs";



export const App = () => (
    <Admin 
    layout={Layout} 
    dataProvider={dataProvider} 
    authProvider={authProvider}
    dashboard={Inicio}>
        <Resource
            name="infantes"
            list={listarInfantes}
            edit={editarInfantes}
            create={crearInfante}
        />
        <Resource
            name = "ebdis"
            edit  = {editarEBDI}
            create  = {crearEBDI}
        />
      
        <Resource
            name = "perfiles"
            edit = {editarPerfiles}
            create = {crearPerfil} 

        />
          <Resource
            name="mediciones"
            list={listarMediciones}
        />

    

        <CustomRoutes>
            <Route path="/registrarse" element={<Registrarse />}/>
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/graphs" element={<GraphsPage />}
            />
            
        </CustomRoutes>
    </Admin>

    
    
);
