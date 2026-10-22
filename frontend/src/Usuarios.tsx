import {Datagrid, List, TextField, BooleanField, Edit, SimpleForm, TextInput, SelectInput, NumberInput} from "react-admin";

export const listarUsuarios = () =>(
    <List>
        <Datagrid>
            <TextField source="id" label="Id"/>
            <TextField source="usuario" label="Usuario" />
            <TextField source="rol" label="Rol" />
            <TextField source="region" label="Región" />
            <TextField source="ebdi" label="EBDI" />
            <TextField source="activo" label="Activo" />
        </Datagrid>
    </List>
);

export const editarUsuario = () =>(
    <Edit>
        <SimpleForm warnWhenUnsavedChanges>
            <TextInput source="id" label="Id" disabled/>
            <TextInput source="usuario" label="Usuario" />
            <SelectInput source="rol" label="Rol" choices={[
                {id:"admin", name:"Administrador"},
                {id:"regional", name:"Regional"},
                {id:"estancia", name:"Estancia"},
                {id:"padre", name:"Padre"},
            ]} />
            <NumberInput source="id_region" label="Region (número)"/>
            <NumberInput source="id_ebdi" label="EBDI (número)"/>
        </SimpleForm>
    </Edit>
);