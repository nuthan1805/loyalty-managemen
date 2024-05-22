import React, { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, BarElement, PointElement, LinearScale, Title, CategoryScale, ArcElement, Tooltip, Legend } from 'chart.js';
import supabase from '../SupabaseClient';
import './Dashboard.css'; 

ChartJS.register(LineElement, BarElement, PointElement, LinearScale, Title, CategoryScale, ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [totalPoints, setTotalPoints] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);
  const [transactionTrends, setTransactionTrends] = useState({ labels: [], data: [] });
  const [memberTrends, setMemberTrends] = useState({ labels: [], data: [] });
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    const fetchTotalPoints = async () => {
      const { data, error } = await supabase
        .from('members')
        .select('points');

      if (error) {
        console.error(error);
        return 0;
      }
      const totalPoints = data.reduce((acc, transaction) => acc + transaction.points, 0);
      return totalPoints;
    };

    const fetchTotalMembers = async () => {
      const { data, error, count } = await supabase
        .from('members')
        .select('id', { count: 'exact' });

      if (error) {
        console.error(error);
        return 0;
      }

      return count;
    };

    const fetchTransactionTrends = async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('points_updated, updated_at')
        .order('updated_at', { ascending: true });

      if (error) {
        console.error(error);
        return { labels: [], data: [] };
      }

      const dailyPoints = {};
      data.forEach(transaction => {
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
        .from('members')
        .select('created_at')
        .order('created_at', { ascending: true });

      if (error) {
        console.error(error);
        return { labels: [], data: [] };
      }

      const dailyMembers = {};
      data.forEach(member => {
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
        .from('members')
        .select('id, name, points')
        .order('points', { ascending: false })
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

  const transactionTrendData = {
    labels: transactionTrends.labels,
    datasets: [
      {
        label: 'Points Distributed Over Time',
        data: transactionTrends.data,
        borderColor: '#3f51b5',
        backgroundColor: 'rgba(63, 81, 181, 0.2)',
        fill: true,
      },
    ],
  };

  const totalPointsData = {
    labels: transactionTrends.labels,
    datasets: [
      {
        label: 'Total Points Distributed',
        data: transactionTrends.data,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: '#4bc0c0',
        borderWidth: 1,
        fill: false,
      },
    ],
  };

  const totalMembersData = {
    labels: memberTrends.labels,
    datasets: [
      {
        label: 'Total Members Over Time',
        data: memberTrends.data,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: '#9966ff',
        borderWidth: 1,
        fill: false,
      },
    ],
  };

  const topUsersData = {
    labels: topUsers.map(user => user.name),
    datasets: [
      {
        label: 'Points',
        data: topUsers.map(user => user.points),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <img src="https://img.freepik.com/free-vector/gradient-b2b-illustration_23-2149322240.jpg?t=st=1716208578~exp=1716212178~hmac=f96e17b7ada9d691cbe07cb6b8c15904c74e4369d4646f9facfec1e3a2f8d337&w=826" alt="Descriptive Alt Text" style={{ width: '100%', height: 'auto', borderRadius: '10px' }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className="glass-card kpi-tile">
            <CardContent>
              <Typography variant="h6" align="center">Total Members</Typography>
              <Typography variant="h4" align="center">{totalMembers}</Typography>
              <Box className="chart-container kpi-chart">
                <Line data={totalMembersData} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card className="glass-card">
            <CardContent>
              <Typography variant="h6">Transaction Trends Over Time</Typography>
              <Box className="chart-container wide-chart">
                <Line className="" data={transactionTrendData} options={{ responsive: true, plugins: { tooltip: { mode: 'index', intersect: false } } }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className="glass-card">
            <CardContent>
              <Typography variant="h6">Top Users</Typography>
              <Box className="chart-container small-chart">
                <Bar data={topUsersData} options={{ indexAxis: 'y' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className="glass-card kpi-tile">
            <CardContent>
              <Typography variant="h6" align="center">Total Points Distributed</Typography>
              <Typography variant="h4" align="center">{totalPoints}</Typography>
              <Box className="chart-container kpi-chart">
                <Bar data={totalPointsData} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
