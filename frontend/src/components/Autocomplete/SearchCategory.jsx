import React, { useEffect, useMemo, useState } from "react";
import { Autocomplete, FormControl } from "@mui/material";
import { useDispatch } from "react-redux";
import _ from "lodash";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { searchCategory } from "../../features/CategorySlice";

const SearchCategory = (props) => {
  const { open, orgById, setParentCategory, size } = props;
  const dispatch = useDispatch();

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryInputValue, setCategoryInputValue] = useState("");

  // Debounced function for fetching data
  const categoryFetchOptions = useMemo(
    () =>
      _.debounce(async (query) => {
        setLoading(true);

        try {
          const response = await dispatch(
            searchCategory({ search: query })
          );

          setCategoryOptions(
            response &&
              response.payload &&
              response.payload.data.map((item) => ({
                label: item.name,
                value: item._id,
              }))
          );
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      }, 1000),
    []
  );

  useEffect(() => {
    if (open) {
      categoryFetchOptions(categoryInputValue);
    }
  }, [open, categoryInputValue]);

  return (
    <FormControl fullWidth variant="outlined">
      <Autocomplete
        options={categoryOptions}
        getOptionLabel={(option) => option.label}
        loading={loading}
        size={size && "small"}
        onChange={(e, newValue) => {
          setParentCategory(newValue);
        }}
        onInputChange={(event, newInputValue) => {
          setCategoryInputValue(newInputValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select Category"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </FormControl>
  );
};

export default SearchCategory;
