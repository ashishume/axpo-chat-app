import { Container, Box, Typography, TextField, Button } from '@mui/material';

const LoginPage = () => {
  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <Box sx={{ mt: 3 }}>
          <form noValidate>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              variant="outlined"
              margin="normal"
              autoComplete="email"
            />
            <TextField
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              autoComplete="current-password"
            />
            <Box sx={{ mt: 3 }}>
              <Button fullWidth variant="contained" color="primary" type="submit">
                Submit
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
