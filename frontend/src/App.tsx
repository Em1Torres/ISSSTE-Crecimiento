import { Admin, Resource , CustomRoutes, Login, LoginForm, LinkBase} from "react-admin";
import {Box, Link} from '@mui/material';
import {Route} from "react-router-dom";
import { Layout } from "./Layout";
import {listarInfantes, editarInfantes, crearInfante} from "./Infantes";
import {dataProvider} from "./dataProvider";
import Registrarse from "./registrarse";
import authProvider from "./AuthProvider";
import { AdminInicio, crearEBDI, crearPerfil, editarEBDI, editarPerfiles } from "./Inicio/Admin_inicio";
import { EstanciaInicio } from "./Inicio/EBDI_inicio";
import { PadreInicio } from "./Inicio/Padre_inicio";
import { RegionalInicio } from "./Inicio/Regional_inicio";
import { listarMediciones, crearMedicion } from "./Mediciones";
// @ts-expect-error Graphs is a JSX module without TypeScript declarations.
import {GraphsPage} from "./Graphs";

const MyLogin = () => (
    <Login>
        <LoginForm />
        <Box textAlign="center" mb={1}>
            <Link component={LinkBase} to="/registrarse">
                Registrarse
            </Link>
        </Box>
    </Login>
);


export const App = () => (
    <Admin 
    layout={Layout} 
    dataProvider={dataProvider} 
    authProvider={authProvider}
    dashboard={AdminInicio}
    loginPage={MyLogin}>
        <Resource
            name="infantes"
            list={listarInfantes}
            edit={editarInfantes}
            create={crearInfante}
        />
        <Resource
            name = "ebdi"
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
            create={crearMedicion}
        />

    

        <CustomRoutes>
            <Route path="/registrarse" element={<Registrarse />}/>
            <Route path="/admin/inicio" element={<AdminInicio />} />
            <Route path="/regional/inicio" element={<RegionalInicio />} />
            <Route path="/estancia/inicio" element={<EstanciaInicio />} />
            <Route path="/padre/inicio" element={<PadreInicio />} />
            <Route path="/graphs" element={<GraphsPage />} />
        </CustomRoutes>
    </Admin>

    
    
);
