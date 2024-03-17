import React, { useEffect, useState } from 'react';
import { Chart } from "react-google-charts";
// import { Bar } from 'react-chartjs-2';

import axios from 'axios'; // Import Axios
import Nav from './Nav';

const Graph = () => {
  const [activities, setActivities] = useState([]);
  const [dayWiseData, setDayWiseData] = useState(null);
  

  const fetchActivities = async () => {
    try {
      // console.log("fetching......");
      const response = await axios.get('http://localhost:8086/activities');
      const data = response.data; 
      setActivities(data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const prepareChartData = (activities) => {
    if (!activities.length) {
      return [];
    }
    
    const statusCounts = {};
    activities.forEach(activity => {
      const status = activity.status; 
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    const chartData = [['Status', 'Count']];
    Object.entries(statusCounts).forEach(([status, count]) => {
      chartData.push([status, count]);
    });
    
    return chartData;
    
  };
  const fetchDayWiseData = async () => {
    try {
      // console.log("fetching1....");
      const response = await axios.get('http://localhost:8086/daywise');
      setDayWiseData(response.data);
    } catch (error) {
      console.error('Error fetching day-wise data:', error);
    }
  };

  const prepareDayWiseChartData = (data) => {
    const barData = [['Date', 'Pending', 'In Progress', 'Completed','Cancelled']];
    data.sort((a, b) => new Date(a.date) - new Date(b.date));
    data.forEach(entry => {

      const { date, pending = 0, "in progress": inProgress = 0 , complete = 0, cancel=0 } = entry;
      barData.push([date, pending, inProgress, complete,cancel]);
    });
    return barData;
  };

  useEffect(() => {
    fetchActivities();
    fetchDayWiseData();
  }, []); // Runs only once on component mount

  
  if (dayWiseData === null) {
    return <div>Loading...</div>;
  }

  const chartData =  prepareChartData(activities);
  const dayWiseChartData = prepareDayWiseChartData(dayWiseData);
 
  
 

  return (
    <>
    <Nav/>
    <Chart
      chartType="PieChart"
      data={chartData}
      width={"100%"}
      height={"400px"}
      
    />
    <h2>Day-wise Activities</h2>
    <Chart
        chartType="BarChart"
        data={dayWiseChartData}
        width="100%"
        height="400px"
        options={{
          title: 'Day-wise Activities',
          legend: { position: 'top' },
          colors: ['#FFD700', 'blue', 'green', 'red'],
        }}
      />

    </>
  );
};

export default Graph;
