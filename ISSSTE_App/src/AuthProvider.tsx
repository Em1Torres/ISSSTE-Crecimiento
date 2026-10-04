import { AuthProvider } from "react-admin";

export const authProvider: AuthProvider = {
    // called when the user attempts to log in
    async login({ email, password }) {
        if (email !== "123@gmail.com" || password !== "123") {
            throw new Error("Credenciales Invalidas, intente de Nuevo");
        }
        
        if (false) {
            throw new Error("Credenciales Invalidas, intente de Nuevo");
        }
        localStorage.setItem("username", email);
    },
    // called when the user clicks on the logout button
    async logout() {
        localStorage.removeItem("username");
    },
    // called when the API returns an error
    async checkError({ status }: { status: number }) {
        if (status === 401 || status === 403) {
            localStorage.removeItem("username");
            throw new Error("Expiro la sesion, por favor inicie sesión de nuevo");
        }
    },
    // called when the user navigates to a new location, to check for authentication
    async checkAuth() {
        if (!localStorage.getItem("username")) {
            throw new Error("Necesita Iniciar Sesión");
        }
    },
};