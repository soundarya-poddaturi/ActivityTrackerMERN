import React, { useState } from 'react';
import axios from 'axios';
import Nav from './Nav';

const Home = ({ updateActivities }) => {
  const [activityTitle, setActivityTitle] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8086/addActivity', {
        title: activityTitle,
        end: endDate,
      });
      // alert(response.message)
      setActivityTitle('');
      setEndDate('');
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  return (
    <>
      <Nav />
      <div className="container">
        <h2>Create New Activity</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="activityTitle" className="form-label">
              Activity Title:
            </label>
            <input
              type="text"
              className="form-control"
              id="activityTitle"
              value={activityTitle}
              onChange={(e) => setActivityTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="endDate" className="form-label">
              End Date:
            </label>
            <input
              type="date"
              className="form-control"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Create Activity
          </button>
        </form>
      </div>
    </>
  );
};

export default Home;
