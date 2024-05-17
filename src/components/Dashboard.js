import React, { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, Typography } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';
import supabase from '../SupabaseClient';

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale);

const Dashboard = () => {
  const [totalPoints, setTotalPoints] = useState(0);
  const [pointsPerMember, setPointsPerMember] = useState([]);
  const [transactionTrends, setTransactionTrends] = useState({ labels: [], data: [] });

  useEffect(() => {
    const fetchData = async () => {
      const { data: pointsData, error: pointsError } = await supabase
        .from('points')
        .select('points');

      if (pointsError) {
        console.error(pointsError);
      } else {
        const totalPoints = pointsData.reduce((sum, record) => sum + record.points, 0);
        setTotalPoints(totalPoints);
      }

      const { data: membersData, error: membersError } = await supabase
        .from('points')
        .select('member_id, points');

      if (membersError) {
        console.error(membersError);
      } else {
        const pointsPerMember = membersData.reduce((acc, record) => {
          acc[record.member_id] = (acc[record.member_id] || 0) + record.points;
          return acc;
        }, {});

        const pointsPerMemberArray = Object.keys(pointsPerMember).map(member_id => ({
          member_id,
          total_points: pointsPerMember[member_id],
        }));

        setPointsPerMember(pointsPerMemberArray);
      }

      const { data: trendsData, error: trendsError } = await supabase
        .from('transactions')
        .select('date, points')
        .order('date', { ascending: true });

      if (trendsError) {
        console.error(trendsError);
      } else {
        const datePointsMap = trendsData.reduce((acc, record) => {
          acc[record.date] = (acc[record.date] || 0) + record.points;
          return acc;
        }, {});

        const labels = Object.keys(datePointsMap);
        const data = labels.map(date => datePointsMap[date]);

        setTransactionTrends({ labels, data });
      }
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
        fill: false,
      },
    ],
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Points Distributed</Typography>
              <Typography variant="h4">{totalPoints}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6">Points Awarded Per Member</Typography>
              <ul>
                {pointsPerMember.map(member => (
                  <li key={member.member_id}>
                    Member {member.member_id}: {member.total_points} points
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Transaction Trends Over Time</Typography>
              <Line data={transactionTrendData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
