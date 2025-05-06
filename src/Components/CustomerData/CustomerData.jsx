import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { db } from "../../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const CustomerData = forwardRef((props, ref) => {
  const [customers, setCustomers] = useState([]);
  const [filter, setFilter] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "customerQueries"));
      const customerList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCustomers(customerList);
    } catch (error) {
      console.error("Error fetching data from Firestore: ", error);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setCurrentUser(user);
    }
    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.queryStatus.toLowerCase().includes(filter.toLowerCase()) ||
      customer.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleEditClick = (customer) => {
    setSelectedCustomer({ ...customer });
    setEditModalOpen(true);
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!selectedCustomer?.id) return;

    const docRef = doc(db, "customerQueries", selectedCustomer.id);
    try {
      await updateDoc(docRef, {
        name: selectedCustomer.name,
        number: selectedCustomer.number,
        email: selectedCustomer.email,
        queryStatus: selectedCustomer.queryStatus,
        query: selectedCustomer.query,
        remarks: selectedCustomer.remarks,
      });
      setEditModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const exportToExcel = () => {
    if (!filteredCustomers.length) {
      alert("No customer data to export.");
      return;
    }
  
    const dataToExport = filteredCustomers.map((customer) => ({
      
      Name: customer.name || "",
      "Phone Number": customer.number || "",
      Email: customer.email || "",
      "Query Status": customer.queryStatus || "",
      Query: customer.query || "",
      Remarks: customer.remarks || "",
      "Created By": customer.createdBy || "",
      "Created At":
        customer.createdAt?.toDate
          ? customer.createdAt.toDate().toLocaleString()
          : "",
    }));
    console.log("Data to Export: ", dataToExport);
  
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customer Data");
  
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
  
    const fileData = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
  
    saveAs(fileData, "CustomerData.xlsx");
  };

  useImperativeHandle(ref, () => ({
    exportToExcel,
  }));
  
  

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: 3 }}>
      <TextField
        label="Filter by Name or Status"
        variant="outlined"
        fullWidth
        margin="normal"
        value={filter}
        onChange={handleFilterChange}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Query Status</TableCell>
              <TableCell>Query</TableCell>
              <TableCell>Remarks</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.number}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.queryStatus}</TableCell>
                <TableCell>{customer.query}</TableCell>
                <TableCell>{customer.remarks}</TableCell>
                <TableCell>{customer.createdBy}</TableCell>
                <TableCell>
                  {customer.createdAt?.toDate().toLocaleString()}
                </TableCell>
                <TableCell>
                  {(currentUser?.email === "mrabdullahkhan01@gmail.com" ||
                    currentUser?.displayName === customer.createdBy) && (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEditClick(customer)}
                    >
                      Edit
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Modal */}
      <Dialog
        open={editModalOpen}
        onClose={handleModalClose}
        fullWidth
        maxWidth="md" // sm, md, lg, xl depending on your need
        PaperProps={{
          sx: {
            maxHeight: "90vh", // Prevents content from overflowing vertically
          },
        }}
      >
        <DialogTitle>Edit Customer</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            marginTop: "10px",
          }}
        >
          <TextField
            label="Name"
            name="name"
            value={selectedCustomer?.name || ""}
            onChange={handleInputChange}
          />
          <TextField
            label="Phone Number"
            name="number"
            value={selectedCustomer?.number || ""}
            onChange={handleInputChange}
          />
          <TextField
            label="Email"
            name="email"
            value={selectedCustomer?.email || ""}
            onChange={handleInputChange}
          />
          <TextField
            label="Query Status"
            name="queryStatus"
            value={selectedCustomer?.queryStatus || ""}
            onChange={handleInputChange}
          />
          <TextField
            label="Query"
            name="query"
            value={selectedCustomer?.query || ""}
            onChange={handleInputChange}
          />
          <TextField
            label="Remarks"
            name="remarks"
            value={selectedCustomer?.remarks || ""}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

export default CustomerData;
