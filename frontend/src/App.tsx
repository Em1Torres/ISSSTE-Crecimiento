import { Admin, Resource , CustomRoutes, Login, LoginForm, LinkBase} from "react-admin";
import {Box, Link} from '@mui/material';
import {Route} from "react-router-dom";
import { Layout } from "./Layout";
import {listarInfantes, editarInfantes, crearInfante} from "./Infantes";
import {dataProvider} from "./dataProvider";
import Registrarse from "./registrarse";
import authProvider from "./AuthProvider";
import{listarMediciones, crearMedicion} from "./Mediciones";
// @ts-expect-error Graphs is a JSX module without TypeScript declarations.
import {GraphsPage} from "./Graphs";
import {i18nProvider} from "./i18nProvider";
import { InicioRol } from "./Inicio/Inicio_Rol";
import { listarUsuarios, editarUsuario } from "./Usuarios";


//Pagina de login con link para mandarlo a la pagina de registrarse
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

//Configuración principal del frontend con React Admin.
//Integra la autenticación, comunicación con la API, idioma y página de inicio según el rol.

export const App = () => (
    <Admin 
    layout={Layout} 
    i18nProvider={i18nProvider}
    dataProvider={dataProvider} 
    authProvider={authProvider}
    dashboard={InicioRol}
    loginPage={MyLogin}>
        <Resource //recursos para los infantes, editar, crear, listar
            name="infantes"
            list={listarInfantes}
            edit={editarInfantes}
            create={crearInfante}
            options={{label: "Infantes"}}
        />
        <Resource //recursos para los usuarios, editar, listar
            name="usuarios"
            list={listarUsuarios}
            edit={editarUsuario}
            options={{label: "Usuarios"}}
        />
        <Resource //recursos para las mediciones, editar, listar
            name="mediciones"
            list={listarMediciones}
            create={crearMedicion}
            options={{label: "Mediciones"}}
        />
        <CustomRoutes //rutas personalisadas para el registro y las graficas 
        >
            <Route path="/registrarse" element={<Registrarse />}/>
            <Route path="/graphs" element={<GraphsPage />} />
        </CustomRoutes>
    </Admin>

    
    
);