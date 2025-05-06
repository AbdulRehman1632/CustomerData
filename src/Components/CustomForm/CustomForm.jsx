import React, { useState, useEffect } from "react";
import {
  TextField,
  MenuItem,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { getAuth } from "firebase/auth";
import { app } from "../../firebase";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const CustomForm = ({ handleClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    email: "",
    queryStatus: "",
    query: "",
    remarks: "",
    createdAt: dayjs(),
    quotationSend: "No",
    createdBy: "",
  });

  const queryStatusOptions = ["Interested", "Not Interested", "Already Booked", "Not Respond"];
  const quotationSendOptions = ["No", "Send Over Chat", "Send Over Email", "Send Over Chat and Call"];

  const db = getFirestore(app);

  useEffect(() => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (user) {
      setFormData((prev) => ({ ...prev, createdBy: user.displayName }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, createdAt: date }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "customerQueries"), {
        ...formData,
        createdAt: formData.createdAt.toDate(),
      });

      console.log("Document written with ID: ", docRef.id);

      // ✅ Close the modal after successful submission
      handleClose();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Customer Query Form
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Customer Name"
          name="name"
          fullWidth
          margin="normal"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <TextField
          label="Phone Number"
          name="number"
          fullWidth
          margin="normal"
          value={formData.number}
          onChange={handleChange}
          required
        />
        <TextField
          label="Email"
          name="email"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <TextField
          select
          label="Query Status"
          name="queryStatus"
          fullWidth
          margin="normal"
          value={formData.queryStatus}
          onChange={handleChange}
          required
        >
          {queryStatusOptions.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Query"
          name="query"
          fullWidth
          margin="normal"
          multiline
          rows={3}
          value={formData.query}
          onChange={handleChange}
          required
        />
        <TextField
          label="Query Remarks"
          name="remarks"
          required
          fullWidth
          margin="normal"
          multiline
          rows={2}
          value={formData.remarks}
          onChange={handleChange}
        />
        <TextField
          select
          label="Quotation Send"
          name="quotationSend"
          fullWidth
          margin="normal"
          value={formData.quotationSend}
          onChange={handleChange}
          required
        >
          {quotationSendOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Created By"
          name="createdBy"
          fullWidth
          margin="normal"
          value={formData.createdBy}
          InputProps={{
            readOnly: true,
          }}
          required
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Created At"
            disabled
            value={formData.createdAt}
            onChange={handleDateChange}
            slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
          />
        </LocalizationProvider>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          fullWidth
        >
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default CustomForm;
