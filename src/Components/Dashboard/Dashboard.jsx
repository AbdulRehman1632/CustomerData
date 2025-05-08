import React, { useRef, useState } from 'react';
import { Button, Box, Modal, IconButton } from '@mui/material';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '../../firebase';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import CustomForm from '../CustomForm/CustomForm';
import CloseIcon from '@mui/icons-material/Close';
import CustomerData from '../CustomerData/CustomerData';

const Dashboard = () => {
  const customerRef = useRef();
  const auth = getAuth(app);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully!');
      setTimeout(() => {
        navigate('/Login');
      }, 2000);
    } catch (error) {
      toast.error('Logout failed!');
      console.error(error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    {/* Logo + Heading */}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
      <img src="../assets/images/rihla.png" alt="Rihla Logo" style={{ height: 40 }} />
      <h1 style={{ margin: 0 }}>Rihla Client Dashboard</h1>
    </Box>
  
    {/* Buttons */}
    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add
      </Button>
      <Button
        variant="contained"
        color="success"
        onClick={() => customerRef.current?.exportToExcel()}
      >
        Export to Excel
      </Button>
      <Button variant="outlined" color="error" onClick={handleLogout}>
        Logout
      </Button>
    </Box>

      {/* Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="add-customer-modal"
        sx={{ overflow: 'auto' }}
      >
        <Box
          sx={{
            width: '90%',
            maxWidth: 500,
            mx: 'auto',
            mt: 10,
            bgcolor: 'background.paper',
            borderRadius: 2,
            p: 2,
            boxShadow: 24,
            position: 'relative',
          }}
        >
          {/* Close Icon */}
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 6,
              right: 6,
              color: 'grey.700',
              fontSize: '1rem',
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          
          <CustomForm handleClose={handleClose} />

          <Button onClick={handleClose} fullWidth sx={{ mt: 2 }} size="small">
            Close
          </Button>
        </Box>
      </Modal>

      <CustomerData ref={customerRef} />
    </Box>
  );
};

export default Dashboard;
