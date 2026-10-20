import { Card, CardContent, CardHeader, Box } from "@mui/material";
import { WeightGraph } from "./MedicionesGraph";
import { HeightGraph } from "./MedicionesGraph";

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

export const GraphsPage = () => (
    <>
        <WeightGraphCard />
        <HeightGraphCard />
    </>
);