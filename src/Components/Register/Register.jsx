import {
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    getAuth,
    updateProfile,
  } from "firebase/auth";
  import React, { useState } from "react";
  import {
    Button,
    Paper,
    TextField,
    Typography,
    CircularProgress,
    Box,
    IconButton,
    InputAdornment,
  } from "@mui/material";
  import { Visibility, VisibilityOff } from "@mui/icons-material";
  import { toast } from "react-toastify";
  import { useNavigate } from "react-router";
  import { app } from "../../firebase";
  import { FcGoogle } from "react-icons/fc"; // 🔸 Add this only in Register.jsx

  
  const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // 👁 state
    const auth = getAuth(app);
  
    const handleClickShowPassword = () => {
      setShowPassword((prev) => !prev);
    };
  
    const handleGoogleSignUp = async () => {
      const provider = new GoogleAuthProvider();
      setLoading(true);
      try {
        await signInWithPopup(auth, provider);
        toast.success("Google SignIn successful!");
        setTimeout(() => {
          navigate("/Dashboard");
        }, 2000);
      } catch (error) {
        toast.error(error.message);
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    const HandleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user; 
          
          
          await updateProfile(user, {
            displayName: name, 
          });

          console.log(user);
          toast.success("Signup successful!");
          setTimeout(() => {
            navigate("/Login");
          }, 2000);
        } catch (error) {
          toast.error(error.message);
          console.log(error.message);
        } finally {
          setLoading(false);
        }
      };
      
  
    return (
      <Paper elevation={3} sx={{ maxWidth: 400, mx: "auto", mt: 5, p: 3 }}>
        <Box textAlign="center" mb={2}>
  <img src="../assets/images/rihla.png" alt="Logo" style={{ width: 80, height: 60 }} />
  <Typography variant="h5" gutterBottom fontWeight={"bold"}>
    Sign Up
  </Typography>
</Box>
        <form onSubmit={HandleSignUp}>
          <TextField
            label="Full Name"
            name="fullName"
            fullWidth
            margin="normal"
            required
            onChange={(e) => setName(e.target.value)}
          />
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
            type={showPassword ? "text" : "password"}
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
            Create Account
          </Button>
        </form>
  
        <Button
  variant="outlined"
  color="primary"
  fullWidth
  sx={{ mt: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}
  onClick={handleGoogleSignUp}
  disabled={loading}
>
  <FcGoogle size={22} />
  {loading ? "Signing Up..." : "Sign Up with Google"}
</Button>
  
        <Box sx={{ width: "100%", textAlign: "right", marginTop: "4px" }}>
          <Typography
            variant="body2"
            component="a"
            href="/Login"
            sx={{ textDecoration: "none", color: "primary.main", cursor: "pointer" }}
          >
            Already have an Account?
          </Typography>
        </Box>
  
        {loading && (
          <CircularProgress
            size={50}
            sx={{
              display: "block",
              margin: "50px auto",
            }}
          />
        )}
      </Paper>
    );
  };
  
  export default Register;
  