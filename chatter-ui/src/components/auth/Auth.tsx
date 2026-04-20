import { Alert, Button, Stack, TextField } from "@mui/material"
import React, { useEffect } from "react";
import { useGetMe } from "../../hooks/useGetMe";
import { useNavigate } from "react-router-dom";

interface AuthProps {
    submitLabel: string;
    onSubmit: (credentials: {email: string, password: string}) => Promise<void>;
    children: React.ReactNode;
    error?: string;
}

const Auth = ({submitLabel, onSubmit, children, error}: AuthProps) => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const {data} = useGetMe();
    const navigate = useNavigate();

    useEffect(() => {
        // Kiểm tra data.me thay vì chỉ data chung chung
        if (data?.me) {
            console.log("Dữ liệu user đã có:", data.me);
            console.log("Đang chuyển hướng sang Home...");
            navigate("/");
        } else {
            console.log("Chưa có dữ liệu user hoặc dữ liệu là:", data);
        }
    }, [data, navigate]);

    return (
        <Stack spacing={3} 
        sx={{ height: "100vh", 
        justifyContent: 'center', 
        alignItems: 'center',
        maxWidth: {
            xs: '70%',
            md: '30%'
        },
        margin: '0 auto',
        }}>

            <TextField 
                type="email"
                label="Email"
                variant="outlined"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                error={!!error}
                helperText={error}
            />
            <TextField 
                type="password"
                label="Password"
                variant="outlined"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                error={!!error}
                helperText={error}
            />
            <Button variant="contained" onClick={() => onSubmit({email, password})}>
                {submitLabel}
            </Button>
            {children}
        </Stack>
    )
}

export default Auth;