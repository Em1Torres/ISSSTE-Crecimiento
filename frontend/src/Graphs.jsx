import {useGetOne, useGetList} from "react-admin";
import { Card, CardContent, CardHeader, Box } from "@mui/material";
import { WeightGraph, HeightGraph, IMCGraph } from "./MedicionesGraph";

//Aqui se carga la grafica del archivo anterior
export const WeightGraphCard = () => (
    <Card sx={{ mt: 2 }}>
        <CardHeader title="Peso con respecto a la altura del infante" />
        <CardContent>
            <Box height={400}>
                <WeightGraph />
            </Box>
        </CardContent>
    </Card>
);
//Nuevamente aqui se carga la grafica del archivo anterior, pero en este caso es la de altura
export const HeightGraphCard = () => (
    <Card sx={{ mt: 2 }}>
        <CardHeader title="Altura con Respecto a la edad del infante" />
        <CardContent>
            <Box height={400}>
                <HeightGraph />
            </Box>
        </CardContent>
    </Card>
);

/*Para esto tambien se utilizo Claude para poder generar la grafica de IMC
en la pagina como tal*/
//Como indica el nombre esto solo imprime un infante
  export const IMCIndividualGraphCard = ({ idInfante, nombre }) => {
    const { data, isPending, error } = useGetOne("infantes", { id: `${idInfante}/estado` });

    if (isPending) return <p>Cargando...</p>;
    if (error) {
        return (
            <Card sx={{ width: 600, maxWidth: "100%", borderRadius: 3 }}>
                <CardHeader title={`Peso - ${nombre}`} />
                <CardContent>{error.message ?? "No se pudo cargar el estado"}</CardContent>
            </Card>
        );
    }

    return (
        <IMCGraph
            titulo={`Peso - ${nombre}`}
            valor={data.valor}
            unidad={data.unidad}
            anterior={data.anterior}
            umbrales={data.umbrales}
            imc={data.imc}
            nombres={data.nombres}
        />
    );
};

//Aqui es donde se imprimen todos los infantes que se encuentran en la base de datos
  export const IMCGroupGraphCard = () => {
    const { data, isPending, error } = useGetList("infantes", {
        pagination: { page: 1, perPage: 12 },
        sort: { field: "id", order: "ASC" },
    });

    if (isPending) return <p>Cargando...</p>;
    if (error) return <p>Error al cargar los infantes</p>;

    /*Se consigue la informacion de todos los infantes 
    y se guarda en un array de tarjetas para despues imprimirlas en la pagina*/
    const tarjetas = [];
    for (let i = 0; i < data.length; i++) {
        const kid = data[i];
        tarjetas.push(
            <IMCIndividualGraphCard key={kid.id} idInfante={kid.id} nombre={kid.nombre} />
        );
    }

    return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4, mt: 2 }}>
            {tarjetas}
        </Box>
    );
};

export const GraphsPage = () => (
    <>
        <WeightGraphCard />
        <HeightGraphCard />
        <IMCGroupGraphCard />
    </>
);