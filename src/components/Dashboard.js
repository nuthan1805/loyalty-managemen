import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import supabase from "../SupabaseClient";
import "./Dashboard.css";
import dashboard_image from "../assets/23991565_6859168.jpg";

ChartJS.register(
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  ArcElement,
  Tooltip,
  Legend
);

const Dashboard = ({ darkTheme }) => {
  const [totalPoints, setTotalPoints] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);
  const [transactionTrends, setTransactionTrends] = useState({
    labels: [],
    data: [],
  });
  const [memberTrends, setMemberTrends] = useState({ labels: [], data: [] });
  const [topUsers, setTopUsers] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchTotalPoints = async () => {
      const { data, error } = await supabase.from("members").select("points");

      if (error) {
        console.error(error);
        return 0;
      }
      const totalPoints = data.reduce(
        (acc, transaction) => acc + transaction.points,
        0
      );
      return totalPoints;
    };

    const fetchTotalMembers = async () => {
      const { data, error, count } = await supabase
        .from("members")
        .select("id", { count: "exact" });

      if (error) {
        console.error(error);
        return 0;
      }

      return count;
    };

    const fetchTransactionTrends = async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("points_updated, updated_at")
        .order("updated_at", { ascending: true });

      if (error) {
        console.error(error);
        return { labels: [], data: [] };
      }

      const dailyPoints = {};
      data.forEach((transaction) => {
        const date = new Date(transaction.updated_at).toLocaleDateString();
        if (!dailyPoints[date]) {
          dailyPoints[date] = 0;
        }
        dailyPoints[date] += transaction.points_updated;
      });

      const labels = Object.keys(dailyPoints);
      const points = Object.values(dailyPoints);

      return {
        labels: labels,
        data: points,
      };
    };

    const fetchMemberTrends = async () => {
      const { data, error } = await supabase
        .from("members")
        .select("created_at")
        .order("created_at", { ascending: true });

      if (error) {
        console.error(error);
        return { labels: [], data: [] };
      }

      const dailyMembers = {};
      data.forEach((member) => {
        const date = new Date(member.created_at).toLocaleDateString();
        if (!dailyMembers[date]) {
          dailyMembers[date] = 0;
        }
        dailyMembers[date] += 1;
      });

      const labels = Object.keys(dailyMembers);
      const counts = Object.values(dailyMembers);

      return {
        labels: labels,
        data: counts,
      };
    };

    const fetchTopUsers = async () => {
      const { data, error } = await supabase
        .from("members")
        .select("id, name, points")
        .order("points", { ascending: false })
        .limit(5);

      if (error) {
        console.error(error);
        return [];
      }

      return data;
    };

    const fetchData = async () => {
      const totalPoints = await fetchTotalPoints();
      setTotalPoints(totalPoints);

      const totalMembers = await fetchTotalMembers();
      setTotalMembers(totalMembers);

      const transactionTrends = await fetchTransactionTrends();
      setTransactionTrends(transactionTrends);

      const memberTrends = await fetchMemberTrends();
      setMemberTrends(memberTrends);

      const topUsers = await fetchTopUsers();
      setTopUsers(topUsers);
    };

    fetchData();
  }, []);

  const createGradient = (ctx, area) => {
    const gradient = ctx.createLinearGradient(0, area.top, 0, area.bottom);
    gradient.addColorStop(0, "rgba(131, 96, 195, 0.5)");
    gradient.addColorStop(1, "rgba(131, 96, 195, 0)");
    return gradient;
  };

  const transactionTrendData = {
    labels: transactionTrends.labels,
    datasets: [
      {
        label: "Points Distributed Over Time",
        data: transactionTrends.data,
        borderColor: "blue",
        backgroundColor: chartRef.current
          ? createGradient(chartRef.current.ctx, chartRef.current.chartArea)
          : "rgba(131, 96, 195, 0.5)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const totalPointsData = {
    labels: transactionTrends.labels,
    datasets: [
      {
        label: "Total Points Distributed",
        data: transactionTrends.data,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "#4bc0c0",
        borderWidth: 1,
        fill: false,
      },
    ],
  };

  const totalMembersData = {
    labels: memberTrends.labels,
    datasets: [
      {
        label: "Total Members Over Time",
        data: memberTrends.data,
        backgroundColor: "rgba(153, 102, 255, 1)",
        borderColor: "#9966ff",
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const topUsersData = {
    labels: topUsers.map((user) => user.name),
    datasets: [
      {
        label: "Points",
        data: topUsers.map((user) => user.points),
        backgroundColor: "rgba(255, 99, 132, 1)",
      },
    ],
  };

  return (
    <Container className="dashboard-container" style={{ fontFamily: 'Montserrat' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent className={darkTheme ? "dark-chart-card-content" : ""}>
              <img
                src={dashboard_image}
                alt="Descriptive Alt Text"
                style={{ width: "100%", height: "auto", borderRadius: "10px"}}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card
            className={`glass-card kpi-tile ${darkTheme ? "dark-card" : ""}`}
          >
            <CardContent className={darkTheme ? "dark-chart-card-content" : ""}>
              <Typography
                variant="h6"
                align="center"
                className={darkTheme ? "dark-text" : ""}
              >
                Total Members
              </Typography>
              <Typography
                variant="h4"
                align="center"
                className={darkTheme ? "dark-text" : ""}
              >
                {totalMembers}
              </Typography>
              <Box
                className={`chart-container kpi-chart ${
                  darkTheme ? "dark-chart-container" : ""
                }`}
                style={{ padding: "20px", borderRadius: "10px" }}
              >
                <Line
                  data={totalMembersData}
                  options={{
                    scales: {
                      x: { ticks: { color: darkTheme ? "white" : "black" } },
                      y: { ticks: { color: darkTheme ? "white" : "black" } },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card className={`glass-card ${darkTheme ? "dark-card" : ""}`}>
            <CardContent className={darkTheme ? "dark-chart-card-content" : ""}>
              <Typography variant="h6" className={darkTheme ? "dark-text" : ""}>
                Transaction Trends Over Time
              </Typography>
              <Box
                className={`chart-container wide-chart ${
                  darkTheme ? "dark-chart-container" : ""
                }`}
                style={{ padding: "20px", borderRadius: "10px" }}
              >
                <Line
                  ref={chartRef}
                  data={transactionTrendData}
                  options={{
                    responsive: true,
                    plugins: {
                      tooltip: {
                        mode: "index",
                        intersect: false,
                      },
                    },
                    scales: {
                      x: {
                        ticks: {
                          color: darkTheme ? "white" : "black",
                        },
                      },
                      y: {
                        ticks: {
                          color: darkTheme ? "white" : "black",
                        },
                      },
                    },
                    onResize: () => {
                      if (chartRef.current) {
                        chartRef.current.data.datasets[0].backgroundColor =
                          createGradient(
                            chartRef.current.ctx,
                            chartRef.current.chartArea
                          );
                      }
                    },
                    onRender: () => {
                      if (chartRef.current) {
                        chartRef.current.data.datasets[0].backgroundColor =
                          createGradient(
                            chartRef.current.ctx,
                            chartRef.current.chartArea
                          );
                      }
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className={`glass-card ${darkTheme ? "dark-card" : ""}`}>
            <CardContent className={darkTheme ? "dark-chart-card-content" : ""}>
              <Typography
                variant="h6"
                style={{ textAlign: "center" }}
                className={darkTheme ? "dark-text" : ""}
              >
                Top Users
              </Typography>
              <Box
                className={`chart-container small-chart ${
                  darkTheme ? "dark-chart-container" : ""
                }`}
                style={{
                  padding: "10px",
                  borderRadius: "10px",
                  marginTop: "92px",
                }}
              >
                <Bar
                  data={topUsersData}
                  options={{
                    indexAxis: "y",
                    scales: {
                      x: { ticks: { color: darkTheme ? "white" : "black" } },
                      y: { ticks: { color: darkTheme ? "white" : "black" } },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card
            className={`glass-card kpi-tile ${darkTheme ? "dark-card" : ""}`}
          >
            <CardContent className={darkTheme ? "dark-chart-card-content" : ""}>
              <Typography
                variant="h6"
                align="center"
                className={darkTheme ? "dark-text" : ""}
              >
                Total Points Distributed
              </Typography>
              <Typography
                variant="h4"
                align="center"
                className={darkTheme ? "dark-text" : ""}
              >
                {totalPoints}
              </Typography>
              <Box
                className={`chart-container kpi-chart ${
                  darkTheme ? "dark-chart-container" : ""
                }`}
                style={{ padding: "20px", borderRadius: "10px" }}
              >
                <Bar
                  data={totalPointsData}
                  options={{
                    scales: {
                      x: { ticks: { color: darkTheme ? "white" : "black" } },
                      y: { ticks: { color: darkTheme ? "white" : "black" } },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
