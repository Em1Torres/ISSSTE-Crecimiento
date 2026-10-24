import type { ReactNode } from "react";
import {
  Layout as RALayout,
  CheckForApplicationUpdate,
  Menu,
} from "react-admin";
import BarChartIcon from "@mui/icons-material/BarChart";
import HomeIcon from "@mui/icons-material/Home";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";

// el navegador de los tabuladores, incluye inicio, infantes, mediciones y graficas 
const MyMenu = () => (
    <Menu>
        <Menu.Item
            to="/"
            primaryText="Inicio"
            leftIcon={<HomeIcon />}
        />

        <Menu.Item
            to="/infantes"
            primaryText="Infantes"
            leftIcon={<ChildCareIcon />}
        />

        <Menu.Item
            to="/mediciones"
            primaryText="Mediciones"
            leftIcon={<MonitorHeartIcon />}
        />

        <Menu.Item
            to="/graphs"
            primaryText="Graficas"
            leftIcon={<BarChartIcon />}
        />
    </Menu>
);

export const Layout = ({ children }: { children: ReactNode }) => (
  <RALayout menu={MyMenu}>
    {children}
    <CheckForApplicationUpdate />
  </RALayout>
);
