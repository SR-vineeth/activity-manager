import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

function App() {
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState('');
  const [deadline, setDeadline] = useState('');
  const [showTasks, setShowTasks] = useState(false); // State to track whether tasks should be displayed

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/activities');
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const addActivity = async () => {
    try {
      if (newActivity.trim() !== '' && deadline !== '') {
        await axios.post('http://localhost:3001/api/activities', { text: newActivity, deadline });
        setNewActivity('');
        setDeadline('');
        fetchActivities();
      } else {
        alert('Please enter an activity and select a deadline.');
      }
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  const toggleShowTasks = () => {
    setShowTasks(!showTasks);
  };

  const updateActivityStatus = async (activityId, newStatus) => {
    try {
      if (newStatus === 'inprogress') {
        await axios.put(`http://localhost:3001/api/activities/${activityId}`, { status: newStatus });
        fetchActivities(); // Refresh activities after status update
      } else {
        const activity = activities.find(activity => activity._id === activityId);
        if (activity && activity.status !== 'completed') {
          await axios.put(`http://localhost:3001/api/activities/${activityId}`, { status: newStatus });
          fetchActivities(); // Refresh activities after status update
        }
      }
    } catch (error) {
      console.error('Error updating activity status:', error);
    }
  };

  const deleteActivity = async (activityId) => {
    try {
      await axios.delete(`http://localhost:3001/api/activities/${activityId}`);
      // Remove the deleted activity from the activities list
      setActivities(activities.filter(activity => activity._id !== activityId));
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  return (
    <div className="container">
      <h1>Activity Manager</h1>
      <div className="input-field">
        <input
          type="text"
          value={newActivity}
          onChange={(e) => setNewActivity(e.target.value)}
          placeholder="Enter new activity"
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          placeholder="Select deadline"
        />
        <button className="button" onClick={addActivity}>Add Activity</button>
      </div>
      <div>
        <button className="button" onClick={toggleShowTasks}>{showTasks ? 'Hide Tasks' : 'Show Tasks'}</button>
        {showTasks && (
          <div>
            <h2>Tasks</h2>
            <table className="task-table">
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr key={activity._id}>
                    <td>{activity.text}</td>
                    <td>{activity.status}</td>
                    <td>
                      {activity.status !== 'completed' && (
                        <button className="status-button" onClick={() => updateActivityStatus(activity._id, activity.status === 'completed' ? 'inprogress' : 'completed')}>
                          {activity.status === 'completed' ? 'Mark as In Progress' : 'Mark as Completed'}
                        </button>
                      )}
                      <button className="status-button" onClick={() => deleteActivity(activity._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
