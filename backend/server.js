const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://srvineeth2004:root..@cluster0.4glnqwi.mongodb.net/actmgr', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

const activitySchema = new mongoose.Schema({
  text: String,
  deadline: String,
  status: String,
});

const Activity = mongoose.model('Activity', activitySchema);

// GET all activities
app.get('/api/activities', async (req, res) => {
  try {
    const activities = await Activity.find();
    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create a new activity
app.post('/api/activities', async (req, res) => {
  try {
    const { text, deadline } = req.body;
    const activity = new Activity({ text, deadline, status: 'inprogress' });
    await activity.save();
    res.status(201).send('Activity created successfully');
  } catch (error) {
    console.error('Error adding activity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// DELETE delete an activity
app.delete('/api/activities/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const activity = await Activity.findByIdAndDelete(id);
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error('Error deleting activity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update activity status
app.put('/api/activities/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const activity = await Activity.findById(id);
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    activity.status = status;
    await activity.save();

    res.json({ message: 'Activity status updated successfully', activity });
  } catch (error) {
    console.error('Error updating activity status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
