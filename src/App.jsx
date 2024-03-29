import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import "./App.css";
 
import Table from "./component/table/table.component";
 
const SEARCH_ENGINE_DATA_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQz9nNSWNOABN2s-Gzk-ho5jLnMAtirgHOPFyYUBBLZ87DJ7DS0j9xRSLIfxgFNImK8nXOxXzpJ3Cie/pub?gid=1633805794&single=true&output=csv";
 
const RETAIL_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQz9nNSWNOABN2s-Gzk-ho5jLnMAtirgHOPFyYUBBLZ87DJ7DS0j9xRSLIfxgFNImK8nXOxXzpJ3Cie/pub?gid=781849941&single=true&output=csv";
 
const generateKey = (pre) => {
  return `${pre}_${new Date().getTime()}`;
}
 
function App() {
  const [tableData, setTableData] = useState([]);
  const [tableHeadRow, setTableHeadRow] = useState([]);
 
  const [filterTableData, setFilterTableData] = useState({});
  const [inputValue, setInputValue] = useState();
  const [stores, setStores] = useState(["--blank--"]);
  const [displayValue, setDisplayValue] = useState("");
 
  const [login, setLogin] = useState(false);
  const [formFields, setFormFields] = useState({
    user: "",
    password: ""
  })
 
  const handleChange = (event) => {
    setFormFields({
      ...formFields,
      [event.target.name]: event.target.value,
    });
  };
 
 
  const resetFormFields = () => {
    setFormFields({
      user: "",
      password: ""
    });
  };
 
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formFields.user === "projects" && formFields.password === "projects@123") {
      setLogin(true);
    } else {
      alert("wrong id/password");
      resetFormFields();
    }
  };
 
  const handleDropdown = (event) => {
    setFilterTableData("");
    setInputValue(event.target.value);
    let i = 0;
    for (; i < event.target.value.length; i++)
      if (event.target.value[i] === "-" || event.target.value[i] === "_") break;
 
    console.log(event.target.value.substring(0, i));
    setDisplayValue(i == "0" ? "NULL" : event.target.value.substring(0, i));
  };
 
  useEffect(() => {
    Papa.parse(RETAIL_URL, {
      download: true,
      // header: true,
 
      before: () => {
        setStores([]);
      },
      complete: (results) => {
        for (let i = 0; i < 5; i++) {
          results.data.shift();
        }
        results.data.map((value) => setStores((prev) => [...prev, value[2]]));
      },
    });
    console.log("in use effect1")
  }, []);
 
  useEffect(() => {
    Papa.parse(SEARCH_ENGINE_DATA_URL, {
      download: true,
 
      before: () => {
        setTableHeadRow([]);
        setTableData([]);
      },
      complete: (results) => {
        let headers = [];
        // for (let i = 0; i < results.data.length; i++) results.data[i].shift();
        // console.log(results.data);
 
        for (let i in results.data[0]) {
          if (results.data[0][i] === 'Sr No.' || results.data[0][i] === 'City') continue;
          headers = [...headers, results.data[0][i]];
          setTableHeadRow((prev) => [...prev, results.data[0][i]]);
        }
 
        // console.log(headers);
 
        // console.log(results.data);
 
        results.data = results.data.filter((data) => {
          let flag = false;
          for (const index in data) {
            flag = flag || data[index].length > 0;
          }
          return flag;
        });
 
        for (let i in results.data) {
          let obj = {};
          for (let j in results.data[i]) {
            if (headers[j] === 'Sr No.' || headers[j] == 'City') continue;
            obj[headers[j]] = results.data[i][j];
          }
 
          setTableData((prev) => [...prev, { ...obj }]);
        }
      },
    });
    console.log("in use effect2")
  }, []);
 
  useEffect(() => {
    setFilterTableData(
      tableData.filter((data) => data["Site Code"] === displayValue)
    );
  }, [displayValue]);
 
 
  // console.log(filterTableData);
 
  const { user, password } = formFields;
  return (
    // https://codesandbox.io/s/react-custom-dropdown-select-demo-forked-276905
    <div className="App">
 
      {
 
        !login ?
          <form onSubmit={handleSubmit}>
            <label>username: </label>
            <input name={"user"} type="text" value={user} required onChange={handleChange} placeholder="user name" />
 
            <br />
            <label>password: </label>
            <input name={"password"} type="password" value={password} required onChange={handleChange} placeholder="password" />
            <br />
            <button type="submit">submit</button>
          </form>
          :
 
          <>
            <center>
              {stores.length && tableData.length ? (
                <h2> Kindly Choose the Store </h2>
              ) : (
                <h2> Sit Back!! </h2>
              )}
              <select value={inputValue} onChange={handleDropdown}>
                {stores.map((store, index) => (
                  <option key={store + generateKey(store)} value={store}>
                    {store}
                  </option>
                ))}
              </select>
            </center>
 
            {filterTableData.length ? (
              <div className="body">
                {Object.values(filterTableData[0]).map((data, index) =>
                (
                  <Table
                    key={data + filterTableData[0].Address + generateKey(data)}
                    title={
                      (index == 0 && "Site Status") ||
                      (index == 1 && "Store Details") ||
                      (index == 14 && "GST Details") ||
                      (index == 18 && "Agreement Details") ||
                      (index == 34 && "Compliance Details")
                    }
                    data={data}
                    index={index}
                    tableHeadRow={tableHeadRow}
                  />
 
                )
 
 
                )}
              </div>
            ) : (
              <>
                {inputValue == null ? (
                  <h1> Loading ... </h1>
                ) : (
                  <h1>Value not found </h1>
                )}
              </>
            )}
 
          </>
      }
 
    </div>
  );
}
 
export default App;
