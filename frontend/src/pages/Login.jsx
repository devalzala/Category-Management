import { LoadingButton } from "@mui/lab";
import { Box, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../features/AuthSlice";
import { useDispatch } from "react-redux";

const Login = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [fields, setFields] = useState({ email: "", password: "" });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFields((prevFields) => ({
            ...prevFields,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!fields.email) {
            return toast.warning("Email is required")
        }

        if (!fields.password) {
            return toast.warning("Password is required")
        }

        const response = await dispatch(login(fields))

        if (response && response.payload) {
            localStorage.setItem("token", response.payload.token)
            navigate("/")
            return toast(response.payload.message)
        }

    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid black",
                padding: 3,
                borderRadius: 2,
                width: 300,
                boxShadow: 3,
                bgcolor: "white",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
            }}
        >
            <Typography variant="h6" mb={2}>Login Here</Typography>
            <TextField
                placeholder="Enter your email"
                name="email"
                type="text"
                fullWidth
                margin="normal"
                value={fields.email}
                onChange={handleChange}
            />
            <TextField
                placeholder="Enter your password"
                name="password"
                type="password"
                fullWidth
                margin="normal"
                value={fields.password}
                onChange={handleChange}
            />
            <Link style={{ textDecoration: "none" }} to="/register">Don't have any account, <span style={{ fontWeight: "700", textDecoration: "underline" }}>Register Here</span></Link>
            <LoadingButton type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                Submit
            </LoadingButton>
        </Box>
    );
};

export default Login;