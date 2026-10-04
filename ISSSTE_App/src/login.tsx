import { useState, type FormEvent } from "react";
import { useLogin, useNotify, Notification } from "react-admin";

const MyLoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const login = useLogin();
    const notify = useNotify();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        login({ email, password }).catch(() => {
            notify("Invalid email or password", {
                type: "error",
            });
        });
    };

return (
    <>
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgb(14, 14, 14)",
            }}
        >
            <form
                onSubmit={handleSubmit}
                style={{
                    width: "350px",
                    padding: "35px",
                    borderRadius: "12px",
                    backgroundColor: "grey",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                }}
            >
                <h2
                    style={{
                        textAlign: "center",
                        margin: 0,
                        color: "#333",
                    }}
                >
                    Iniciar Sesión
                </h2>

                <input
                    name="email"
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                        padding: "12px",
                        borderRadius: "6px",
                        border: "1px solid #100f0f",
                        fontSize: "16px",
                    }}
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        padding: "12px",
                        borderRadius: "6px",
                        border: "1px solid #0f0f14",
                        fontSize: "16px",
                    }}
                />

                <button
                    type="submit"
                    style={{
                        padding: "12px",
                        border: "none",
                        borderRadius: "6px",
                        backgroundColor: "#1976d2",
                        color: "white",
                        fontSize: "16px",
                        cursor: "pointer",
                    }}
                >
                    Iniciar Sesión
                </button>
            </form>
        </div>

        <Notification />
    </>
);
};

export default MyLoginPage;