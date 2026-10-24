import { useGetList } from "react-admin";
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
    /*Esta parte del codigo recibio apoyo de la IA Claude para recibir los datos
    necesarios para la grafica */
    // se utiliza useGetList para obtener las mediciones de la base de datos
    const { data, isPending, error } = useGetList("mediciones", {
        pagination: { page: 1, perPage: 200 },
        sort: { field: "id", order: "ASC" },
    });

    if (isPending) return <p>Cargando...</p>;
    if (error) return <p>Error al cargar las mediciones</p>;

    /*Los datos se almacenan en un objeto por infante que funciona como un
    diccionario. Utiliza el id_infante como llave y almacena adentro el nombre
    del infante como id y un array de los datos del niño.*/
    const porInfante = {};
    data.forEach((m) => {
        if (!porInfante[m.id_infante]) {
            porInfante[m.id_infante] = { id: m.infante, data: [] };
        }
        porInfante[m.id_infante].data.push({ x: m.talla, y: m.peso });
    });
    /*Se obtienen los valores dentro del objeto, removiendo la llave que era el
    id_infante y se ordenan los datos que llegan desordenados para que en la grafica
    salgan de menor a mayor. Esta es una recomendacion de Claude 
    para que la grafica se vea mejor y no se vea desordenada.*/
    const series = Object.values(porInfante).map((s) => ({
        ...s,
        data: s.data.sort((a, b) => a.x - b.x),
    }));
    /*hasta aqui llega la ayuda de Claude, el resto del codigo se saca directamente
    de la pagina de la libreria Nivo, y se le realizaron ligeras modificaciones
    para cumplir lo que se nos solicitaba*/
    return (
        <ResponsiveLine
            data={series}
            margin={{ top: 30, right: 130, bottom: 60, left: 60 }}
            xScale={{ type: "linear", min: "auto", max: "auto" }}
            yScale={{ type: "linear", min: "auto", max: "auto" }}
            axisBottom={{ legend: "Talla (cm)", legendOffset: 40, legendPosition: "middle" }}
            axisLeft={{ legend: "Peso (kg)", legendOffset: -45, legendPosition: "middle" }}
            pointSize={12}
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
        />
    );
};

export const HeightGraph = () => {
    /*Esta parte del codigo recibio apoyo de la IA Claude para recibir los datos
    necesarios para la grafica */
    // se utiliza useGetList para obtener las mediciones de la base de datos
    const { data, isPending, error } = useGetList("mediciones", {
        pagination: { page: 1, perPage: 200 },
        sort: { field: "id", order: "ASC" },
    });

    if (isPending) return <p>Cargando...</p>;
    if (error) return <p>Error al cargar las mediciones</p>;
    /*Los datos se almacenan en un objeto por infante que funciona como un
    diccionario. Utiliza el id_infante como llave y almacena adentro el nombre
    del infante como id y un array de los datos del niño.*/
    const porInfante = {};
    data.forEach((m) => {
        if (!porInfante[m.id_infante]) {
            porInfante[m.id_infante] = { id: m.infante, data: [] };
        }
        porInfante[m.id_infante].data.push({ x: m.edad_meses, y: m.talla });
    });
    /*Se obtienen los valores dentro del objeto, removiendo la llave que era el
    id_infante y se ordenan los datos que llegan desordenados para que en la grafica
    salgan de menor a mayor. Esta es una recomendacion de Claude 
    para que la grafica se vea mejor y no se vea desordenada.*/
    const series = Object.values(porInfante).map((s) => ({
        ...s,
        data: s.data.sort((a, b) => a.x - b.x),
    }));
    /*hasta aqui llega la ayuda de Claude, el resto del codigo se saca directamente
    de la pagina de la libreria Nivo, y se le realizaron ligeras modificaciones
    para cumplir lo que se nos solicitaba*/
    return (
        <ResponsiveLine
            data={series}
            margin={{ top: 30, right: 130, bottom: 60, left: 60 }}
            xScale={{ type: "linear", min: "auto", max: "auto" }}
            yScale={{ type: "linear", min: "auto", max: "auto" }}
            axisBottom={{ legend: "Edad (meses)", legendOffset: 40, legendPosition: "middle" }}
            axisLeft={{ legend: "Talla (cm)", legendOffset: -45, legendPosition: "middle" }}
            pointSize={12}
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
        />
    );
};

/*Para esta grafica en especifico se utilizo mucho la ayuda de Claude ya que no
se encontro en la libreria de Nivo una grafica que cumpliera con la idea
que teniamos en mente de manera satisfactoria*/
export const IMCGraph = ({
    titulo = "Peso",
    valor,
    unidad = "kg",
    anterior,
    umbrales,
    imc,
    nombres,
}) => {
    //Recibe el objeto que envia el backend
    const [b1, b2, b3] = umbrales;

    /* Rango visible de la barra: un poco antes de b1 y bastante después de b3
    Se utiliza el min y max para que los imc que sobrepasen los limites
    de la barra no se salgan de ella y se vean mal*/
    const min = Math.min(b1 - (b2 - b1) * 0.5, imc);
    const max = Math.max(b3 + (b3 - b2) * 1.5, imc);
    /*Esta funcion se usa para identificar donde se encuentra el valor
    dentro de la barra, se utiliza mas tarde para colocar
    cosas dentro de la barra*/
    const pct = (v) => ((v - min) / (max - min)) * 100;

    // Tramo donde cae el valor, con esto se decide el color y la etiqueta
    let indice = 0;
    if (imc >= b3) indice = 3;
    else if (imc >= b2) indice = 2;
    else if (imc >= b1) indice = 1;

    const tramo = TRAMOS[indice];
    const etiqueta = nombres[indice];
    /*el objeto en nombres contiene los nombres de los tramos, aqui se selecciona
    cual es el que aplica para este IMC*/

    // Los 4 segmentos con su ancho
    const limites = [min, b1, b2, b3, max];
    const segmentos = TRAMOS.map((t, i) => ({
        color: t.color,
        ancho: pct(limites[i + 1]) - pct(limites[i]),
        //aqui se usa la funcion pct para calcular el ancho de cada segmento de la barra
    }));

    // Flecha de tendencia, si hay un valor anterior, se compara con el actual
    let Flecha = EastIcon;
    if (anterior != null && imc > anterior) Flecha = NorthEastIcon;
    if (anterior != null && imc < anterior) Flecha = SouthEastIcon;

    /*A continuacion se regresa el componente que contiene la grafica, se utilizó
    Claude para que generar el codigo de la grafica*/

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
                            left: `${pct(imc)}%`,
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
                            left: `${pct(imc)}%`,
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