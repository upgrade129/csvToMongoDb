import * as React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "react-dropdown/style.css";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";

const theme = createTheme();

export default function SignUp() {
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [headers, setHeaders] = useState([]);
  const [sucess, setSucess] = useState(false);

  const fileReader = new FileReader();

  const changeHandler = (event) => {
    if (event.target.files[0] && event.target.files[0].type != "text/csv") {
      alert("Please upload .CSV files");
      return;
    }
    setSelectedFile(event.target.files[0]);
    event.target.files[0] && setIsFilePicked(true);

    if (event.target.files[0]) {
      fileReader.onload = function (event) {
        const csvOutput = event.target.result;
        const headers = csvOutput.slice(0, csvOutput.indexOf("\n")).split(",");
        setHeaders(headers);
        console.log("op", headers);
      };

      fileReader.readAsText(event.target.files[0]);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  const handleSubmission = () => {
    if (!isFilePicked) return;
    const formData = new FormData();
    formData.append("File", selectedFile);

    var sendObject = {
      [firstName]: "first_name",
      [lastName]: "last_name",
      [emailId]: "emailId",
    };

    formData.append("userMapping", JSON.stringify(sendObject));

    fetch("http://localhost:3500/users/create", {
      method: "POST",
      body: formData,
    })
      .then((response) => console.log(response.json()))
      .then((result) => {
        alert("uploaded sucessfully")
        setSucess(true);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar> */}
          <Typography component="h1" variant="h3">
            CSV to MongoDB
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography component="h2" variant="h6">
                  Upload CSV file
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                {isFilePicked ? (
                  <Button variant="contained" component="label" color="success">
                    File Uploaded
                    <input type="file" hidden onChange={changeHandler} />
                  </Button>
                ) : (
                  <Button variant="contained" component="label">
                    Upload File
                    <input type="file" hidden onChange={changeHandler} />
                  </Button>
                )}
              </Grid>
            </Grid>
            <hr />
            {isFilePicked ? (
              <>
                <Typography component="h3" variant="h8">
                  Map the csv headers
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="firstname-select-label">
                        FirstName
                      </InputLabel>
                      <Select
                        labelId="firstname-select-label"
                        id="firstname-simple-select"
                        value={firstName}
                        label="FirstName"
                        onChange={(e) => setFirstName(e.target.value)}
                      >
                        {headers.map((header, index) => (
                          <MenuItem value={header}>{header}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="lastname-select-label">
                        LastName
                      </InputLabel>
                      <Select
                        labelId="lastname-select-label"
                        id="lastname-simple-select"
                        value={lastName}
                        label="FirstName"
                        onChange={(e) => setLastName(e.target.value)}
                      >
                        {headers.map((header, index) => (
                          <MenuItem value={header}>{header}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="email-select-label">EmailId</InputLabel>
                      <Select
                        labelId="email-select-label"
                        id="email-simple-select"
                        value={emailId}
                        label="FirstName"
                        onChange={(e) => setEmailId(e.target.value)}
                      >
                        {headers.map((header, index) => (
                          <MenuItem value={header}>{header}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={handleSubmission}
                >
                  SUBMIT
                </Button>
                {sucess ? (
                  <Typography component="h1" variant="h6">
                    Uploaded sucessfully
                  </Typography>
                ) : (
                  <>
                    <Typography component="h1" variant="h6">
                      Filename: {selectedFile.name}
                    </Typography>
                    <Typography component="h1" variant="h6">
                      Filetype: {selectedFile.type}
                    </Typography>
                    <Typography component="h1" variant="h6">
                      Size in bytes: {selectedFile.size}
                    </Typography>
                  </>
                )}
              </>
            ) : (
              ""
            )}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
