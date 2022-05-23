import { useState } from "react";
import "./../App.css";
import "react-dropdown/style.css";
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [headers, setHeaders] = useState([]);

  const fileReader = new FileReader();

  const changeHandler = (event) => {
    console.log("filetype")
    if(event.target.files[0] && event.target.files[0].type != "text/csv"){
      alert("Please upload .CSV files");
      return
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

  const handleSubmission = () => {
    if (!isFilePicked) return;
    const formData = new FormData();
    formData.append("File", selectedFile);

    var sendObject = {
      [firstName]: "first_name", 
      [lastName]: "last_name", 
      [emailId]: "emailId"}

    formData.append("userMapping", JSON.stringify(sendObject));

    fetch("http://localhost:3500/users/create", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Success:", result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="App">
      <input type="file" accept=".csv" name="file" onChange={changeHandler} />
      <div>
        <button onClick={handleSubmission}>Submit</button>
      </div>
      {isFilePicked ? (
        <div>
          <FormControl fullWidth>
            <InputLabel id="firstname-select-label">FirstName</InputLabel>
            <Select
              labelId="firstname-select-label"
              id="firstname-simple-select"
              value={firstName}
              label="FirstName"
              onChange={(e)=> setFirstName(e.target.value)}
            >
              {headers.map((header, index) =>  <MenuItem value={header}>{header}</MenuItem>)}
              
            </Select>
            </FormControl>
            <FormControl fullWidth>
            <InputLabel id="lastname-select-label">LastName</InputLabel>
            <Select
              labelId="lastname-select-label"
              id="lastname-simple-select"
              value={lastName}
              label="FirstName"
              onChange={(e)=> setLastName(e.target.value)}
            >
              {headers.map((header, index) =>  <MenuItem value={header}>{header}</MenuItem>)}
              
            </Select>
            </FormControl>
            <FormControl fullWidth>
            <InputLabel id="email-select-label">EmailId</InputLabel>
            <Select
              labelId="email-select-label"
              id="email-simple-select"
              value={emailId}
              label="FirstName"
              onChange={(e)=> setEmailId(e.target.value)}
            >
              {headers.map((header, index) =>  <MenuItem value={header}>{header}</MenuItem>)}
              
            </Select>
          </FormControl>

          <p>Filename: {selectedFile.name}</p>
          <p>Filetype: {selectedFile.type}</p>
          <p>Size in bytes: {selectedFile.size}</p>
          <p>
            lastModifiedDate:{" "}
            {selectedFile.lastModifiedDate.toLocaleDateString()}
          </p>
        </div>
      ) : (
        <div>
          <p>Select a file</p>
        </div>
      )}
    </div>
  );
};
export default FileUpload;

