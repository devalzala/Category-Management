import React, { useEffect, useState } from "react";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Autocomplete } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import SearchCategory from "../Autocomplete/SearchCategory";
import { createCategory, getCategoryById, updateCategory } from "../../features/CategorySlice";

export default function AddCategoryModal({ open, setOpen, operationMode, id, setOperationMode, callApi }) {
    const dispatch = useDispatch();
    const { category } = useSelector(state => state.categoryData);

    const [name, setName] = useState("");
    const [status, setStatus] = useState(null);
    const [parentCategory, setParentCategory] = useState(null);

    const statusOptions = [
        { label: "Active", value: "active" },
        { label: "In-Active", value: "inactive" }
    ];

    useEffect(() => {
        if (operationMode === "edit" && id) dispatch(getCategoryById({ id }));
    }, [operationMode, id, dispatch]);

    useEffect(() => {
        if (operationMode === "edit" && category) {
            setName(category.name || "");
            setStatus(statusOptions.find(item => item.value === category.status) || null);
        }
    }, [operationMode, category]);

    const handleClose = () => {
        setOpen(false);
        setName("");
        setStatus(null);
        setParentCategory(null);
        setOperationMode("add");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name) return toast("Please enter a name");

        const finalData = { name, status: status?.value || "" };
        const response = await dispatch(
            operationMode === "add"
                ? createCategory({ ...finalData, parentCategory: parentCategory?.value })
                : updateCategory({ ...finalData, id })
        );

        toast(response.payload.message);
        if (response?.payload?.success) {
            callApi();
            handleClose();
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth>
            <DialogTitle>{operationMode === "add" ? "Add" : "Edit"} Category</DialogTitle>
            <DialogContent>
                {operationMode === "add" && <SearchCategory open={open} setParentCategory={setParentCategory} />}
                <TextField
                    required
                    margin="dense"
                    label="Name"
                    type="text"
                    value={name}
                    fullWidth
                    onChange={(e) => setName(e.target.value)}
                />
                <Autocomplete
                    disablePortal
                    options={statusOptions}
                    value={status}
                    renderInput={(params) => <TextField {...params} label="Status" />}
                    onChange={(e, newValue) => setStatus(newValue)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}