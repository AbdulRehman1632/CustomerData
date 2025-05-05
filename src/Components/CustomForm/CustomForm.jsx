// CustomerForm.jsx
import React, { useState } from "react";
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

const CustomForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    email: "",
    queryStatus: "",
    query: "",
    remarks: "",
    createdAt: dayjs(),
  });

  const queryStatusOptions = ["Interested", "Not Interested", "Already Booked", "Not Respond"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, createdAt: date }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    // yahan pe API call kar sakte ho ya Firebase me save
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
          fullWidth
          margin="normal"
          multiline
          rows={2}
          value={formData.remarks}
          onChange={handleChange}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Created At"
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
