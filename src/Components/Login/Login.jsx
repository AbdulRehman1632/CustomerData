import {
    Button,
    Paper,
    TextField,
    Typography,
    IconButton,
    InputAdornment,
    Box,
  } from '@mui/material';
  import {
    getAuth,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
  } from 'firebase/auth';
  import React, { useState } from 'react';
  import { Visibility, VisibilityOff } from '@mui/icons-material';
  import { app } from '../../firebase';
  import { useNavigate } from 'react-router';
  import { toast } from 'react-toastify';
  
  const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [resetEmail, setResetEmail] = useState('');
    const [isReset, setIsReset] = useState(false);
    const [showPassword, setShowPassword] = useState(false); 
  
    const auth = getAuth(app);
    
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Login successful!');
        setTimeout(() => {
          navigate('/Dashboard');
        }, 2000);
        console.log('User Logged In successfully');
      } catch (error) {
        toast.error('Login failed! Please check your credentials.');
        console.log(error);
      }
    };
  
    const handlePasswordReset = async (e) => {
      e.preventDefault();
      if (!resetEmail) {
        toast.error('Please enter your email address.');
        return;
      }
      try {
        await sendPasswordResetEmail(auth, resetEmail);
        toast.success('Password reset email sent!');
        setIsReset(false);
      } catch (error) {
        toast.error('Error sending password reset email.');
        console.log(error);
      }
    };
  
    const handleClickShowPassword = () => {
      setShowPassword((prev) => !prev);
    };
  
    return (
      <Paper elevation={3} sx={{ maxWidth: 400, mx: 'auto', mt: 5, p: 3 }}>
        <Box textAlign="center" mb={2}>
  <img src="../assets/images/rihla.png" alt="Logo" style={{ width: 80, height: 60 }} />
  <Typography variant="h5" gutterBottom fontWeight={"bold"}>
    {isReset ? 'Reset Password' : 'Log In'}
  </Typography>
</Box>
        <form onSubmit={isReset ? handlePasswordReset : handleSubmit}>
          {isReset ? (
            <>
              <TextField
                label="Email"
                name="resetEmail"
                type="email"
                fullWidth
                margin="normal"
                required
                onChange={(e) => setResetEmail(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Send Reset Email
              </Button>
            </>
          ) : (
            <>
              <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                margin="normal"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                margin="normal"
                required
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Log In
              </Button>
            </>
          )}
        </form>

        <Box sx={{ width: "100%", textAlign: "right", marginTop: "4px" }}>
          <Typography
            variant="body2"
            component="a"
            href="/SignUp"
            sx={{ textDecoration: "none", color: "primary.main", cursor: "pointer" }}
          >
           Don't have an account? Sign up
          </Typography>
        </Box>


        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          {isReset ? (
            <span
              onClick={() => setIsReset(false)}
              style={{ cursor: 'pointer', color: 'primary.main' }}
            >
              Back to Log In
            </span>
          ) : (
            <span
              onClick={() => setIsReset(true)}
              style={{ cursor: 'pointer', color: 'primary.main' }}
            >
              Forgot Password?
            </span>
          )}
        </Typography>
      </Paper>
    );
  };
  
  export default Login;
  