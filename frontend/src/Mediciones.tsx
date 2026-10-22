import { Create, Datagrid, List, NumberInput, SelectInput, SimpleForm, TextField, minValue, required, useGetList } from "react-admin";

interface MatriculaInfante {
    id: number;
    matricula: number;
}

export const listarMediciones = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="matricula" />
            <TextField source="fecha" />
            <TextField source="peso" />
            <TextField source="talla" />
            <TextField source="talla_blanco_familiar" />
            <TextField source="perimetro_cefalico" />
            <TextField source="edad_meses" />
            <TextField source="infante" />
            <TextField source="nombre_ebdi" label="EBDI" />
            <TextField source="estado" />
        </Datagrid>
    </List>
);

const FormularioCrearMedicion = () => {
    const { data: infantes = [], isPending, error } =
        useGetList<MatriculaInfante>("matriculaInfantes", {
            pagination: { page: 1, perPage: 1000 },
            sort: { field: "matricula", order: "ASC" },
        });

    if (isPending) return <p>Cargando matrículas...</p>;
    if (error) return <p>No se pudieron cargar las matrículas.</p>;

    const choices = infantes.map((infante) => ({
        id: infante.matricula,
        matricula: infante.matricula,
    }));

    return (
        <Create redirect="list">
            <SimpleForm>
                <SelectInput
                    source="matricula"
                    label="Matrícula"
                    choices={choices}
                    optionText="matricula"
                    validate={required()}
                />
                <NumberInput source="peso" validate={[required(), minValue(0)]} />
                <NumberInput source="talla" validate={[required(), minValue(0)]} />
                <NumberInput source="talla_blanco_familiar" validate={[required(), minValue(0)]} />
                <NumberInput source="perimetro_cefalico" validate={[required(), minValue(0)]} />
            </SimpleForm>
        </Create>
    );
};

export const crearMedicion = () => <FormularioCrearMedicion />;