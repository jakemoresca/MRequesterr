import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createUser } from '../services/user';
import { ISettings } from '../models/settings';
import { useEffect } from 'react';
import { Alert } from '@mui/material';

const theme = createTheme();

interface ISignupState {
  success: boolean;
  error: boolean
}

interface ISignUpProps {
  settings: ISettings;
  closeDialog: () => void;
}

export default function SignUp(props: ISignUpProps) {
  const [signUpStatus, setSignUpStatus] = React.useState<ISignupState>({ success: false, error: false });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    registerToJellyfin(props.settings, setSignUpStatus, data.get('username')?.toString(), data.get('password')?.toString(), data.get('referrer')?.toString());
  };

  useEffect(() => {
    if(signUpStatus && signUpStatus.success) {
      props.closeDialog();
    }
  }, [signUpStatus])

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          {signUpStatus && signUpStatus.error && <Alert severity="error">Invalid Referrer</Alert> }
          {signUpStatus && signUpStatus.error && <Alert severity="success">Sign Up successful</Alert> }
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="referrer"
                  label="Referrer"
                  id="referrer"
                  autoComplete="referrer"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export async function registerToJellyfin(settings: ISettings, setSignUpStatus: React.Dispatch<React.SetStateAction<ISignupState>>, username?: string, password?: string, referrer?: string) {
  const result = await createUser(username, password, referrer, settings);

  if (result.ServerId) {
    setSignUpStatus({ success: true, error: false });
  }
  else {
    setSignUpStatus({ success: false, error: true });
  }
}