import axios from "axios";
import React from "react";
import { Header, Navigation, StaffScoreTable } from "../../components";
import { BASE_URL } from "../../config";

const ManagerRating = () => {
  const [staffScores, setStaffScore] = React.useState([]);
  const [staffId, setStaffId] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/api/v1/result`, {
        headers: {
          "Content-Type": "application/json",
          "access-token": JSON.parse(localStorage.getItem("staffInfo")).token,
        },
      })
      .then(({ data }) => {
        setLoading(false);
        setStaffScore(
          data.data.filter((staff) => {
            return staff.user && staff.user.manager === staffId;
          })
        );
      })
      .catch((err) => {
        console.log(err.response.data.msg);
        setLoading(false);
      });
  }, [staffId]);

  //Get the authenticated staff id
  React.useEffect(() => {
    axios
      .get(`${BASE_URL}/api/v1/staff/auth`, {
        headers: {
          "Content-Type": "application/json",
          "access-token": JSON.parse(localStorage.getItem("staffInfo")).token,
        },
      })
      .then(({ data }) => {
        setStaffId(data.data.staff._id);
      })
      .catch((err) => {
        console.log(err.response.data.msg);
      });
  }, []);

  return (
    <div className="appContainer">
      <Navigation />

      <div className="contentsRight">
        <Header title="" />
        <div style={{ width: "100%", height: "100%" }}>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <StaffScoreTable list={staffScores} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerRating;
