import { useGetList } from "react-admin";
import { useTheme } from "@mui/material";
import { ResponsiveLine } from "@nivo/line";
import { Card, CardContent, Box, Typography, Divider } from "@mui/material";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import SouthEastIcon from "@mui/icons-material/SouthEast";
import EastIcon from "@mui/icons-material/East";

const COLORES = {
    amarillo: "#f5c400",
    verde: "#3cc619",
    rojo: "#ee2a2a",
};

const TRAMOS = [
    { color: COLORES.amarillo, nombre: "Bajo peso" },
    { color: COLORES.verde, nombre: "Peso saludable" },
    { color: COLORES.amarillo, nombre: "Sobrepeso" },
    { color: COLORES.rojo, nombre: "Obesidad" },
];

export const WeightGraph = () => {
    const theme = useTheme();
    const textColor = theme.palette.text.primary;

    const { data, isPending, error } = useGetList("mediciones", {
        pagination: { page: 1, perPage: 200 },
        sort: { field: "id", order: "ASC" },
    });

    if (isPending) return <p>Cargando...</p>;
    if (error) return <p>Error al cargar las mediciones</p>;

    // Un grupo de puntos por infante: x = talla, y = peso
    const porInfante = {};
    data.forEach((m) => {
        if (!porInfante[m.id_infante]) {
            porInfante[m.id_infante] = { id: m.infante, data: [] };
        }
        porInfante[m.id_infante].data.push({ x: m.talla, y: m.peso });
    });
    const series = Object.values(porInfante).map((s) => ({
        ...s,
        data: s.data.sort((a, b) => a.x - b.x),
    }));

    return (
        <ResponsiveLine
            data={series}
            margin={{ top: 30, right: 130, bottom: 60, left: 60 }}
            xScale={{ type: "linear", min: "auto", max: "auto" }}
            yScale={{ type: "linear", min: "auto", max: "auto" }}
            axisBottom={{ legend: "Talla (cm)", legendOffset: 40, legendPosition: "middle" }}
            axisLeft={{ legend: "Peso (kg)", legendOffset: -45, legendPosition: "middle" }}
            pointSize={8}
            useMesh={true}
            legends={[
                {
                    anchor: "bottom-right",
                    direction: "column",
                    translateX: 120,
                    itemWidth: 100,
                    itemHeight: 16,
                },
            ]}
            theme={{
                text: { fill: textColor },
                axis: {
                    ticks: { text: { fill: textColor } },
                    legend: { text: { fill: textColor } },
                },
                legends: { text: { fill: textColor } },
                tooltip: { container: { color: "#000" } },
            }}
        />
    );
};

export const HeightGraph = () => {
    const theme = useTheme();
    const textColor = theme.palette.text.primary;

    const { data, isPending, error } = useGetList("mediciones", {
        pagination: { page: 1, perPage: 200 },
        sort: { field: "id", order: "ASC" },
    });

    if (isPending) return <p>Cargando...</p>;
    if (error) return <p>Error al cargar las mediciones</p>;

    // Un grupo de puntos por infante: x = talla, y = peso
    const porInfante = {};
    data.forEach((m) => {
        if (!porInfante[m.id_infante]) {
            porInfante[m.id_infante] = { id: m.infante, data: [] };
        }
        porInfante[m.id_infante].data.push({ x: m.edad_meses, y: m.talla });
    });
    const series = Object.values(porInfante).map((s) => ({
        ...s,
        data: s.data.sort((a, b) => a.x - b.x),
    }));

    return (
        <ResponsiveLine
            data={series}
            margin={{ top: 30, right: 130, bottom: 60, left: 60 }}
            xScale={{ type: "linear", min: "auto", max: "auto" }}
            yScale={{ type: "linear", min: "auto", max: "auto" }}
            axisBottom={{ legend: "Edad (meses)", legendOffset: 40, legendPosition: "middle" }}
            axisLeft={{ legend: "Talla (cm)", legendOffset: -45, legendPosition: "middle" }}
            pointSize={8}
            useMesh={true}
            legends={[
                {
                    anchor: "bottom-right",
                    direction: "column",
                    translateX: 120,
                    itemWidth: 100,
                    itemHeight: 16,
                },
            ]}
            theme={{
                text: { fill: textColor },
                axis: {
                    ticks: { text: { fill: textColor } },
                    legend: { text: { fill: textColor } },
                },
                legends: { text: { fill: textColor } },
                tooltip: { container: { color: "#000" } },
            }}
        />
    );
};

export const IMCGraph = ({
    titulo = "Peso",
    valor,
    unidad = "kg",
    anterior,
    umbrales,
    imc,
    nombres,
}) => {
    const [b1, b2, b3] = umbrales;

    // Rango visible de la barra: un poco antes de b1 y bastante después de b3
    const min = Math.min(b1 - (b2 - b1) * 0.5, valor);
    const max = Math.max(b3 + (b3 - b2) * 1.5, valor);
    const pct = (v) => ((v - min) / (max - min)) * 100;

    // Tramo donde cae el valor
    let indice = 0;
    if (valor >= b3) indice = 3;
    else if (valor >= b2) indice = 2;
    else if (valor >= b1) indice = 1;

    const tramo = TRAMOS[indice];
    const etiqueta = (nombres ?? TRAMOS.map((t) => t.nombre))[indice];

    // Los 4 segmentos con su ancho
    const limites = [min, b1, b2, b3, max];
    const segmentos = TRAMOS.map((t, i) => ({
        color: t.color,
        ancho: pct(limites[i + 1]) - pct(limites[i]),
    }));

    // Flecha de tendencia
    let Flecha = EastIcon;
    if (anterior != null && valor > anterior) Flecha = NorthEastIcon;
    if (anterior != null && valor < anterior) Flecha = SouthEastIcon;

    return (
        <Card sx={{ width: 480, maxWidth: "100%", borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                    {titulo}
                </Typography>
                <Divider sx={{ my: 1.5 }} />

                {/* Valor grande + flecha */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 4 }}>
                    <Box
                        sx={{
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            bgcolor: "action.hover",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Flecha fontSize="small" />
                    </Box>
                    <Typography variant="h3" component="span">
                        {valor}
                        <Typography variant="body1" component="span" color="text.secondary" sx={{ ml: 0.5 }}>
                            {unidad}
                        </Typography>
                    </Typography>
                </Box>

                {/* Etiqueta sobre la barra, alineada con el marcador */}
                <Box sx={{ position: "relative", mt: 3, height: 22 }}>
                    <Typography
                        variant="body2"
                        sx={{
                            position: "absolute",
                            left: `${pct(valor)}%`,
                            transform: "translateX(-50%)",
                            color: tramo.color,
                            fontWeight: 500,
                            whiteSpace: "nowrap",
                        }}
                    >
                        {etiqueta}
                    </Typography>
                </Box>

                {/* Barra segmentada + marcador */}
                <Box sx={{ position: "relative", mt: 0.5 }}>
                    <Box sx={{ display: "flex", height: 6, borderRadius: 3, overflow: "hidden" }}>
                        {segmentos.map((s, i) => (
                            <Box key={i} sx={{ width: `${s.ancho}%`, bgcolor: s.color }} />
                        ))}
                    </Box>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: `${pct(valor)}%`,
                            width: 18,
                            height: 18,
                            transform: "translate(-50%, -50%)",
                            borderRadius: "50%",
                            bgcolor: tramo.color,
                            border: "2px solid",
                            borderColor: "text.primary",
                        }}
                    />
                </Box>

                {/* Números bajo los límites */}
                <Box sx={{ position: "relative", height: 24, mt: 1 }}>
                    {[b1, b2, b3].map((b) => (
                        <Typography
                            key={b}
                            variant="caption"
                            color="text.secondary"
                            sx={{
                                position: "absolute",
                                left: `${pct(b)}%`,
                                transform: "translateX(-50%)",
                            }}
                        >
                            {b}
                        </Typography>
                    ))}
                </Box>

                {imc != null && (
                    <>
                        <Divider sx={{ mt: 4, mb: 1.5 }} />
                        <Typography variant="caption" color="text.secondary">
                            IMC:
                        </Typography>
                        <Typography variant="body2" fontWeight={700}>
                            {imc} kg/m²
                        </Typography>
                    </>
                )}
            </CardContent>
        </Card>
    );
};