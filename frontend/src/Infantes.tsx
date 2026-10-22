import {Datagrid, List, TextField, Edit, SimpleForm, TextInput, Create, NumberInput, DateInput, ReferenceInput, SelectInput} from "react-admin";

let res = await fetch("http://localhost:3000/ebdis");
let ebdis_names = await res.json();
let ebdis_names2 =[];
for(let i=0;i<ebdis_names.length;i++){
    ebdis_names2.push(ebdis_names[i].nombre);
}

export const listarInfantes = () =>(
    <List>
        <Datagrid>
            <TextField source="id" label="Id"/>
            <TextField source="matricula" label="Matrícula"/>    
            <TextField source="nombre" label="Nombre"/>
            <TextField source="paterno" label="Apellido Paterno"/>
            <TextField source="materno" label="Apellido Materno"/>
            <TextField source="genero" label="Género"/>
            <TextField source="fnac" label="Fecha de nacimiento" />
            <TextField source="ebdi" label="EBDI" />
        </Datagrid>
    </List>
);

export const editarInfantes = () =>(
    <Edit>
        <SimpleForm warnWhenUnsavedChanges>
            <TextInput source="id" label="Id" disabled/>
            <TextInput source="matricula" label="Matrícula"/>
            <TextInput source="nombre" label="Nombre"/>
            <TextInput source="paterno" label="Apellido Paterno"/>
            <TextInput source="materno" label="Apellido Materno"/>
            <TextInput source="genero" label="Género"/>
            <TextInput source="fnac" label="Fecha de nacimiento" />
            <SelectInput source="ebdi" label="EBDI" choices={ebdis_names2} />
            {/* <TextInput source="id_ebdi" />
            <ReferenceInput source="id_ebdi" reference="ebdis">
	            <SelectInput optionText="nombre" label="EBDI" />
            </ReferenceInput> */}
        </SimpleForm>
    </Edit>
);

export const crearInfante = ()=>(
    <Create redirect="list">
        <SimpleForm>
            <NumberInput source="matricula" label="Matrícula"/>
            <TextInput source="nombre" label="Nombre"/>
            <TextInput source="paterno" label="Apellido Paterno"/>
            <TextInput source="materno" label="Apellido Materno"/>
            <TextInput source="genero" label="Género"/>
            <DateInput source="fnac" label="Fecha de nacimiento" />
            <SelectInput source="ebdi" label="EBDI" choices={ebdis_names2} />
            {/* <TextInput source="id_ebdi" />
            <ReferenceInput source="id_ebdi" reference="ebdis">
	            <SelectInput optionText="nombre" label="EBDI" />
            </ReferenceInput> */}
        </SimpleForm>
    </Create>
);
