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
      navigate('/Login');
    } catch (error) {
      toast.error('Logout failed!');
      console.error(error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ p: 3 }}>
      <h1>Dashboard</h1>

      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add
        </Button>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => customerRef.current?.exportToExcel()}
        >
          Export to Excel
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

          {/* Pass handleClose to CustomForm */}
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
