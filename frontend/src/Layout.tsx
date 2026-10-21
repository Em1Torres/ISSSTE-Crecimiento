import type { ReactNode } from "react";
import {
  Layout as RALayout,
  CheckForApplicationUpdate,
  Menu,
} from "react-admin";
import BarChartIcon from "@mui/icons-material/BarChart";

const MyMenu = () => (
  <Menu>
    <Menu.ResourceItems />
    <Menu.Item
      to="/graphs"
      primaryText="Graphs"
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