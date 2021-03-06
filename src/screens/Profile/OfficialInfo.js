/* eslint-disable react-hooks/exhaustive-deps */
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Navigation, Header, Input, Options, Select } from "../../components";
import { NativeSelect } from "../../components/Select";
import { BASE_URL } from "../../config";
import { UserContext } from "../../context/UserContext";
import styles from "./styles.module.css";

const OfficialInfo = () => {
  const { lineManagers } = React.useContext(UserContext);
  const [cug, setCug] = useState("");
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [branch, setBranch] = useState("");
  const [manager, setManager] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [managerId, setManagerId] = useState("");
  const toast = useToast();
  const [lineManager, setLineManager] = useState("");

  const selectBranchHandler = (e) => {
    setBranch(e.target.value);
  };
  const selectDepartmentHandler = (e) => {
    setDepartment(e.target.value);
    setManagerId(JSON.parse(e.target[e.target.selectedIndex].id));
  };

  // console.log(selectManagerHandler);

  const selectLineManagerHandler = (e) => {
    setLineManager(e.target.value);
  };

  const getStaffData = () => {
    setFetching(true);
    const accessToken = JSON.parse(localStorage.getItem("staffInfo")).token;
    axios
      .get(`${BASE_URL}/api/v1/staff/auth/`, {
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${staffInfo.token}`,
          "access-token": `${accessToken}`,
        },
      })
      .then(({ data }) => {
        console.log(data.data.staff, "data.data.staff");
        setCug(data.data.staff.cug);
        setDepartment(data.data.staff.department);
        setBranch(data.data.staff.branch);
        setManager(
          data.data.staff.departmentManager?.fullname ??
            data.data.staff.departmentManager?.email
        );
        setManagerId(
          data.data.staff.departmentManager._id ??
            data.data.staff.departmentManager.id
        );
        setFetching(false);
      })
      .catch((err) => {
        console.log(err.message || err.msg);
        setFetching(false);
      });
  };

  //get staff data
  React.useEffect(() => {
    getStaffData();
  }, []);

  React.useEffect(() => {
    axios
      .get(`${BASE_URL}/api/v1/departments/`)
      .then(({ data }) => {
        setDepartments(data.results);
      })
      .catch((err) => {
        console.log(err.message || err.msg);
      });
  }, []);

  //form handler
  const saveDataHandler = (e) => {
    e.preventDefault();
    const accessToken = JSON.parse(localStorage.getItem("staffInfo")).token;
    const data = {
      cug,
      branch,
      department,
      departmentManager: managerId,
      // manager: lineManager,
    };
    setLoading(true);
    axios
      .patch(`${BASE_URL}/api/v1/staff/auth/`, data, {
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${staffInfo.token}`,
          "access-token": `${accessToken}`,
        },
      })
      .then(({ data }) => {
        setCug(data.data.cug);
        setDepartment(data.data.department);
        setBranch(data.data.branch);
        setManager((prev) => {
          prev = data?.data?.manager?.fullname;
          return prev;
        });
        setLineManager((prev) => {
          prev = data.data.departmentManager.fullname;
          return prev;
        });

        setLoading(false);
        toast({
          title: "Success",
          description: "Profile updated successfully",
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "bottom-left",
        });
      })
      .catch((err) => {
        setLoading(false);
        toast({
          title: "Error",
          description: `Profile update failed`,
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "bottom-left",
        });
      });
  };

  return (
    <div className="appContainer">
      <Navigation />
      <div className="contentsRight">
        <Header title="Official Information" />
        <form className={styles.formContainer} onSubmit={saveDataHandler}>
          <div className={styles.smContainer}>
            {Options.ProfileLinks.map((item, i) => (
              <Link to={item.url} key={i}>
                <div className={styles.url}>{item.name}</div>
              </Link>
            ))}
          </div>
          {fetching ? (
            <div className={styles.loading}>Loading...</div>
          ) : (
            <div className={styles.lgContainer}>
              <Input
                title="CUG"
                value={cug}
                onChange={(e) => setCug(e.target.value)}
                type="number"
              />
              <div>
                <Input
                  title="Your Line Manager"
                  value={manager}
                  // onChange={(e) => setCug(e.target.value)}
                  type="text"
                  readOnly={true}
                />
              </div>
              <NativeSelect
                title="Select Your Department"
                onChange={selectDepartmentHandler}
                value={department}
                required={true}
              >
                <option value="">Select Your Department</option>
                {departments
                  .filter((department) => department.manager)
                  .map((item, i) => {
                    return (
                      <option
                        key={i}
                        value={item.name}
                        id={JSON.stringify(
                          item?.manager?._id ?? item?.manager?.id
                        )}
                      >
                        {item.name}
                      </option>
                    );
                  })}
              </NativeSelect>

              {/* <NativeSelect
                title="Select Your Line Manager"
                onChange={selectLineManagerHandler}
                value={lineManager}
                required={true}
              >
                <option value="" disabled>
                  Select Line Manager
                </option>
                {lineManagers.map((item, i) => {
                  return (
                    <option key={i} value={item._id}>
                      {item.fullname}
                    </option>
                  );
                })}
              </NativeSelect> */}

              <Select
                title="Select Your Location"
                value={branch}
                onChange={selectBranchHandler}
                options={Options.Locations}
              />
              {/* <div></div> */}

              {loading ? (
                <button type="button">Updating...</button>
              ) : (
                <button
                  // onClick={saveDataHandler}
                  type="submit"
                >
                  Save Information
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default OfficialInfo;
