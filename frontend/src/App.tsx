import { Admin, Resource , CustomRoutes} from "react-admin";
import {Route} from "react-router-dom";
import { Layout } from "./Layout";
import {listarInfantes, editarInfantes} from "./Infantes"
import {dataProvider} from "./dataProvider"
import Registrarse from "./registrarse";
import authProvider from "./AuthProvider";

export const App = () => (
    <Admin layout={Layout} dataProvider={dataProvider} authProvider={authProvider}>
        <Resource
            name="infantes"
            list={listarInfantes}
            edit={editarInfantes}
            // create={crearInfante}
        />
        <CustomRoutes>
            <Route path="/registrarse" element={<Registrarse />}/>
        </CustomRoutes>
    </Admin>
    
);
