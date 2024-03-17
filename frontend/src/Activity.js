import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Nav from './Nav';

const Activity = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    console.log("fetching activities");
    axios.get('http://localhost:8086/activities')
      .then(response => {
        setActivities(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error fetching activities:', error);
      });
  }, []);

  const handleStatusChange = async (activityId, newStatus) => {
    try {
      console.log(activityId + " " + newStatus);
      await axios.patch(`http://localhost:8086/activities/${activityId}`, { status: newStatus });
      // Update activities state after changing status
      const updatedActivities = activities.map(activity => {
        if (activity._id === activityId) {
          return { ...activity, status: newStatus };
        }
        return activity;
      });
      setActivities(updatedActivities);
    } catch (error) {
      console.error('Error changing status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'complete':
        return 'text-bg-success';
      case 'pending':
        return 'text-bg-warning';
      case 'cancel':
        return 'text-bg-danger';
      case 'in progress':
        return 'text-bg-primary';
      default:
        return '';
    }
  };

  return (
    <>
      <Nav />
      <div className="container">
        <h2>List of Activities</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activities.map(activity => (
              <tr key={activity._id}>
                <td>{activity.title}</td>
                <td>{new Date(activity.end).toLocaleDateString()}</td>
                <td className={getStatusColor(activity.status)}>{activity.status}</td>
                <td>
                  {activity.status === 'in progress' || activity.status === 'pending' ? (
                    <select
                      value={activity.status}
                      onChange={(e) => handleStatusChange(activity._id, e.target.value)}
                      className="form-select"
                    >
                      <option defaultValue>Select</option>
                      <option value="complete">Complete</option>
                      <option value="cancel">Cancel</option>
                    </select>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
      </div>
    </>
  );
};

export default Activity;
