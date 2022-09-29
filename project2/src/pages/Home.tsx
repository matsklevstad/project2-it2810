import { useState, useEffect } from 'react';
import "../styles/Home.css";
import { Input, Button, Select, MenuItem, InputLabel, FormControl, SelectChangeEvent} from "@mui/material";
import { CommitComponent } from "../components/CommitComponent";
import { getBranches } from "../api/fetch";
import Navbar from "../components/Navigationbar";
import { LocalStorageClass } from "../WebStorageClass";
import logo from "../gitlab-logo-650.jpg"

export default function Home() {
  const storage = new LocalStorageClass();
  const [projectID, setProjectID] = useState<string>(selectProjectID());
  const [projectToken, setProjectToken] = useState<string>(selectProjectToken());
  // toggle branch selector
  const [toggle, setToggle] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [selectedBranch, setBranchName] = useState<string>("");
  const [branches, setBranches] = useState<string[]>([]);

  const onChangeProjectID = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectID(event.target.value);
    console.log(projectID)
  };
  const onChangeProjectToken = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectToken(event.target.value);
  };
  
  const onSubmit = () => {
    if (projectID !== null && projectToken !== "") {
      setToggle(!toggle)
      storage.setPropValue("projectID", projectID);
      storage.setPropValue("projectToken", projectToken);
    }
  };

  useEffect(() => {
    getBranches("17381", "glpat-CRs4epaLyzKdvdpGzE_3").then((res) => {
      for (let i = 0; i < res.length; i++) {
        if(!branches.find((el => el === res[i].name))) {
          branches.push(res[i].name)
          
        } 
      }
      setLoading(false);
    });
  }, [branches]);
  
  const handleChangeBranch = (event: SelectChangeEvent) => {
    const newBranch = event.target.value;
    if (newBranch != null) {
        setBranchName(event.target.value as string);
    }
  }

  function selectProjectID() {
    const data:string | null = storage.getPropValue("projectID");
    return (data == null) ? "17381" : data;
  }

  function selectProjectToken() {
    const data:string | null = storage.getPropValue("projectToken");
    return (data == null) ? "glpat-CRs4epaLyzKdvdpGzE_3" : data;
  }

  return (
    <div className="container">
      <img src={logo} alt="GitLab Logo" />
      <Input
        type="number"
        placeholder="ProjectID"
        onChange={onChangeProjectID}
        value={parseInt(projectID)}
      />
      <Input
        type="text"
        placeholder="Project Token"
        onChange={onChangeProjectToken}
        value={projectToken}
      />
      <Button onClick={onSubmit}>Submit</Button>
      {toggle && (
      <FormControl style={{width: 250}}>
        <InputLabel>Select branch</InputLabel>
        <Select defaultValue={""} onChange={handleChangeBranch}>
          {branches.map((branch: string) => (
            <MenuItem key={branch} value={branch}>
              {branch}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      )}
    </div>
  );
}