import {Datagrid, List, TextField, Edit, SimpleForm, TextInput, Create, NumberInput, DateInput} from "react-admin";

export const listarInfantes = () =>(
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="matricula" />    
            <TextField source="nombre" />
            <TextField source="paterno" />
            <TextField source="materno" />
            <TextField source="genero" />
            <TextField source="fnac" label="Fecha de nacimiento" />
            <TextField source="ebdi" label="EBDI" />
        </Datagrid>
    </List>
);

export const editarInfantes = () =>(
    <Edit>
        <SimpleForm warnWhenUnsavedChanges>
            <TextInput source="id" disabled/>
            <TextInput source="matricula" />
            <TextInput source="nombre" />
            <TextInput source="paterno" />
            <TextInput source="materno" />
            <TextInput source="genero" />
            <TextInput source="fnac" label="Fecha de nacimiento" />
            <TextInput source="ur" />
            <TextInput source="ebdi" label="EBDI" />
            <TextInput source="activo" />
        </SimpleForm>
    </Edit>
);

export const crearInfante = ()=>(
    <Create redirect="list">
        <SimpleForm>
            <NumberInput source="matricula" />
            <TextInput source="curp" />
            <TextInput source="nombre" />
            <TextInput source="paterno" />
            <TextInput source="materno" />
            <TextInput source="genero" />
            <DateInput source="fnac" label="Fecha de nacimiento" />
            <TextInput source="ur" />
            <TextInput source="ebdi" label="EBDI" />
            <TextInput source="activo" />
        </SimpleForm>
    </Create>
);
