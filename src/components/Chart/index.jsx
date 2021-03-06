/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import ReactECharts from "echarts-for-react";
import axios from "axios";
import { BASE_URL } from "../../config";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const Chart = ({ id, overallScore }) => {
  const [data, setData] = React.useState({});
  // eslint-disable-next-line no-unused-vars
  const { quarter } = React.useContext(UserContext);
  const navigate = useNavigate();

  React.useEffect(() => {
    const token =
      JSON.parse(localStorage.getItem("staffInfo")) &&
      JSON.parse(localStorage.getItem("staffInfo")).token;
    if (!token) {
      navigate("/");
      return;
    } else
      axios
        .get(`${BASE_URL}/api/v1/result/staff/${id}`, {
          headers: {
            "access-token": JSON.parse(localStorage.getItem("staffInfo")).token,
          },
        })
        .then((response) => {
          // console.log(response.data.data);
          setData(response.data.data);
        });
  }, [id, navigate]);

  // const a = first ? first : 30;
  // const b = second ? second : 10;
  // const c = third ? third : 20;
  // const d = fourth ? fourth : 50;
  // const e = a + b + c + d;
  // const overall = e / 4;

  // const { firstQuarter, secondQuarter, thirdQuarter, fourthQuarter } = data;

  // first = (data &&
  //   data.firstQuarter &&
  //   data.firstQuarter.map(({ managerscore }) => {
  //     return managerscore;
  //   })) || [0];
  const second = (data &&
    data.secondQuarter &&
    data.secondQuarter.map(({ managerscore }) => {
      return managerscore;
    })) || [0];
  // third = (data &&
  //   data.thirdQuarter &&
  //   data.thirdQuarter.map(({ managerscore }) => {
  //     return managerscore;
  //   })) || [0];
  const fourth = (data &&
    data.fourthQuarter &&
    data.fourthQuarter.map(({ managerscore }) => {
      return managerscore;
    })) || [0];

  const option = {
    tooltip: {
      trigger: "item",
    },

    legend: {
      top: "5%",
      left: "center",
    },
    series: [
      {
        name: "KPI",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "20",
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          // {
          //   value: (data && data.score) || 0,
          //   name:
          //     quarter === "firstQuarter"
          //       ? "First Quarter"
          //       : quarter === "secondQuarter"
          //       ? "Second Quarter"
          //       : "Third Quarter",
          // },

          { value: second, name: "Second Quarter" },

          { value: fourth, name: "Fourth Quarter" },
          { value: overallScore, name: "Overall" },
        ],
      },
    ],
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: "0.5" }}>
      <ReactECharts
        option={option}
        style={{ height: "500px", width: "100%" }}
      />
    </div>
  );
};

export default Chart;
