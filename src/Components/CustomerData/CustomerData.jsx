import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TableSortLabel,
} from "@mui/material";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";

const queryStatusOptions = [
  "Interested",
  "Not Interested",
  "Already Booked",
  "Not Respond",
  "Postponed"
];
const quotationSendOptions = [
  "No",
  "Send Over Chat",
  "Send Over Email",
  "Send Over Chat and Call",
  
];

const CustomerData = forwardRef((props, ref) => {
  const [customers, setCustomers] = useState([]);
  const [filter, setFilter] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setCurrentUser(user);
    });
    fetchData();
    return () => unsubscribe();
  }, []);

  const handleFilterChange = (e) => setFilter(e.target.value);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      } else {
        return { key, direction: "asc" };
      }
    });
  };

  const filteredCustomers = customers
    .filter((customer) => {
      const filterLower = filter.toLowerCase();
      return (
        customer.name?.toLowerCase().includes(filterLower) ||
        customer.number?.toLowerCase().includes(filterLower) ||
        customer.email?.toLowerCase().includes(filterLower) ||
        customer.city?.toLowerCase().includes(filterLower) ||
        customer.queryStatus?.toLowerCase().includes(filterLower) ||
        customer.remarks?.toLowerCase().includes(filterLower) ||
        customer.quotationSend?.toLowerCase().includes(filterLower) ||
        customer.createdBy?.toLowerCase().includes(filterLower) ||
        customer.createdAt
          ?.toDate()
          ?.toLocaleString()
          .toLowerCase()
          .includes(filterLower)
      );
    })
    .sort((a, b) => {
      const { key, direction } = sortConfig;
      if (!key) return 0;
      const aVal = a[key]?.toString().toLowerCase() || "";
      const bVal = b[key]?.toString().toLowerCase() || "";
      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });

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

    if (
      !selectedCustomer.name ||
      !selectedCustomer.number ||
      !selectedCustomer.city ||
      !selectedCustomer.queryStatus ||
      !selectedCustomer.quotationSend
    ) {
      toast.error("Please fill out all required fields.");
      return;
    }

    const docRef = doc(db, "customerQueries", selectedCustomer.id);
    try {
      await updateDoc(docRef, {
        name: selectedCustomer.name,
        number: selectedCustomer.number,
        email: selectedCustomer.email,
        city: selectedCustomer.city,
        queryStatus: selectedCustomer.queryStatus,
        quotationSend: selectedCustomer.quotationSend || "",
        query: selectedCustomer.query,
        remarks: selectedCustomer.remarks,
      });
      setEditModalOpen(false);
      fetchData();
      toast.success("Form updated successfully!");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!customerToDelete?.id) return;
    try {
      await deleteDoc(doc(db, "customerQueries", customerToDelete.id));
      toast.success("Customer deleted successfully!");
      fetchData();
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("Error deleting customer.");
    } finally {
      setDeleteDialogOpen(false);
      setCustomerToDelete(null);
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
      "Quotation Send": customer.quotationSend || "",
      Query: customer.query || "",
      City: customer.city || "",
      Remarks: customer.remarks || "",
      "Created By": customer.createdBy || "",
      "Created At": customer.createdAt?.toDate
        ? customer.createdAt.toDate().toLocaleString()
        : "",
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customer Data");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(fileData, "CustomerData.xlsx");
  };

  useImperativeHandle(ref, () => ({ exportToExcel }));

  const capitalizeFirstLetter = (value) =>
    value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

  const tableHeaders = [
    { key: "name", label: "Name" },
    { key: "number", label: "Phone Number" },
    { key: "email", label: "Email" },
    { key: "city", label: "City" },
    { key: "queryStatus", label: "Query Status" },
    { key: "query", label: "Query" },
    { key: "remarks", label: "Remarks" },
    { key: "quotationSend", label: "Quotation Send" },
    { key: "createdBy", label: "Created By" },
    { key: "createdAt", label: "Created At" },
    { key: "actions", label: "Actions" },
  ];

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
      <TextField
        label="Search all fields"
        variant="outlined"
        fullWidth
        margin="normal"
        value={filter}
        onChange={handleFilterChange}
      />

      <TableContainer sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              {tableHeaders.map(({ key, label }) => (
                <TableCell
                  key={key}
                  sx={{
                    color: "#966819",
                    fontWeight: "bold",
                    fontSize: "1.1em",
                    fontFamily: "arial",
                  }}
                >
                  {key !== "actions" ? (
                    <TableSortLabel
                      active={sortConfig.key === key}
                      direction={
                        sortConfig.key === key ? sortConfig.direction : "asc"
                      }
                      onClick={() => handleSort(key)}
                    >
                      {label}
                    </TableSortLabel>
                  ) : (
                    label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{capitalizeFirstLetter(customer.name)}</TableCell>
                <TableCell>{capitalizeFirstLetter(customer.number)}</TableCell>
                <TableCell sx={{ maxWidth: 150, overflow: "auto", whiteSpace: "nowrap" }}>{customer.email}</TableCell>
                <TableCell>{capitalizeFirstLetter(customer.city)}</TableCell>
                <TableCell>{customer.queryStatus}</TableCell>
                <TableCell>{capitalizeFirstLetter(customer.query)}</TableCell>
                <TableCell
                  sx={{ maxWidth: 150, overflow: "auto", whiteSpace: "nowrap" }}
                >
                  {capitalizeFirstLetter(customer.remarks)}
                </TableCell>
                <TableCell>{customer.quotationSend}</TableCell>
                <TableCell>{capitalizeFirstLetter(customer.createdBy)}</TableCell>
                <TableCell>
                  {customer.createdAt?.toDate().toLocaleString()}
                </TableCell>
                <TableCell>
                  {(currentUser?.email === "mrabdullahkhan01@gmail.com" ||
                    currentUser?.displayName === customer.createdBy) && (
                    <>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEditClick(customer)}
                      >
                        Edit
                      </Button>
                      {currentUser?.email === "mrabdullahkhan01@gmail.com" && (
                        <Button
                          variant="outlined"
                          color="error"
                          sx={{ mt: 1 }}
                          onClick={() => handleDeleteClick(customer)}
                        >
                          Delete
                        </Button>
                      )}
                    </>
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
        maxWidth="md"
      >
        <DialogTitle>Edit Customer</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
          sx={{marginTop:"10px"}}
            required
            label="Name"
            name="name"
            value={capitalizeFirstLetter(selectedCustomer?.name || "")}
            onChange={handleInputChange}
          />
          <TextField
            required
            label="Phone Number"
            name="number"
            value={selectedCustomer?.number || ""}
            onChange={handleInputChange}
          />
          <TextField
            required
            label="Email"
            name="email"
            value={selectedCustomer?.email || ""}
            onChange={handleInputChange}
          />
          <TextField
            required
            label="City"
            name="city"
            value={capitalizeFirstLetter(selectedCustomer?.city || "")}
            onChange={handleInputChange}
          />

          <FormControl fullWidth>
            <InputLabel>Query Status</InputLabel>
            <Select
              name="queryStatus"
              value={selectedCustomer?.queryStatus || ""}
              onChange={handleInputChange}
              label="Query Status"
            >
              
              {queryStatusOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Quotation Send</InputLabel>
            <Select
              name="quotationSend"
              value={selectedCustomer?.quotationSend || ""}
              onChange={handleInputChange}
              label="Quotation Send"
            >
              {quotationSendOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Query"
            name="query"
            value={capitalizeFirstLetter(selectedCustomer?.query || "")}
            onChange={handleInputChange}
          />
          <TextField
            label="Remarks"
            name="remarks"
            value={capitalizeFirstLetter(selectedCustomer?.remarks || "")}
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
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete{" "}
          <strong>{customerToDelete?.name}</strong>'s record?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

export default CustomerData;
