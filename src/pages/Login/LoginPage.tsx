import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { Box, Button, Container, TextField, Typography } from "@mui/material";

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await login(email, password);
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 4,
          border: "1px solid #ddd",
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "#ddd",
        }}
      >
        <Typography component="h1" variant="h5" gutterBottom color="black">
          Acesse sua Conta
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 3, width: "100%", justifyItems: "center"}}
        >
          <TextField
            id="outlined-basic"
            label="Email"
            variant="outlined"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{pt: 2}}
            required
          />
          <TextField
            id="outlined-basic"
            label="Senha"
            variant="outlined"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{pt: 2}}
            required
          />
          <Button type="submit" variant="contained" sx={{ display: "flex", mt: 2 }}>
            Entrar
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
