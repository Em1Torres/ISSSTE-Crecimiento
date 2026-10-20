import { useGetList } from "react-admin";
import { useTheme } from "@mui/material";
import { ResponsiveLine } from "@nivo/line";

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