import { Admin, Resource , CustomRoutes, Login, LoginForm, LinkBase} from "react-admin";
import {Box, Link} from '@mui/material';
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
    i18nProvider={i18nProvider}
    dataProvider={dataProvider} 
    authProvider={authProvider}
    dashboard={InicioRol}
    loginPage={MyLogin}>
        <Resource
            name="infantes"
            list={listarInfantes}
            edit={editarInfantes}
            create={crearInfante}
            options={{label: "Infantes"}}
        />
        <Resource
            name="usuarios"
            list={listarUsuarios}
            edit={editarUsuario}
            options={{label: "Usuarios"}}
        />
        <Resource
            name="mediciones"
            list={listarMediciones}
            create={crearMedicion}
            options={{label: "Mediciones"}}
        />
        <CustomRoutes>
            <Route path="/registrarse" element={<Registrarse />}/>
            <Route path="/graphs" element={<GraphsPage />} />
        </CustomRoutes>
    </Admin>

    
    
);
