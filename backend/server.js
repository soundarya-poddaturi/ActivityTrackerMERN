const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 8086;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.listen(PORT, (err, data) => {
  if (err)
    console.log(`Server not connected :${err}`)
  else
    console.log(`Server is connected on ${PORT}`)
})

mongoose.connect(`mongodb+srv://soundarya2873:abcd1234@cluster1.mayh2xa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`)
  .then(() => {
    console.log(`MongoDB Connected on MongoDB Cluster`)
  })
  .catch((err) => {
    console.log(`MongoDB Not Connected Problem: ${err}`)
  });
  const activity =new mongoose.model("activity",{
    title:String,
    status:String,
    end:Date,
  });
  app.post("/addActivity",(req,res)=>
  {

    const newData=new activity({
        title:req.body.title,
        end:req.body.end,
        status:"in progress"

    })
    newData.save()
      .then(() => {
          console.log("Added activity: " + newData);
          res.status(201).json({ message: 'Activity added' });
      })
      .catch((err) => {
          console.log("Error in adding activity: " + err);
          res.status(500).json({ error: 'Internal Server Error' });
      });

  });


app.get('/activities', async (req, res) => {
    // console.log("in server");
    try {
        const activities = await activity.find();
        const currentDate = new Date();
        for (let i = 0; i < activities.length; i++) {
            if (activities[i].status === "in progress" && activities[i].end < currentDate) {
                activities[i].status = 'pending';
                await activities[i].save(); // Update the activity in the database
            }
        }
        res.json(activities);
    } catch (err) {
        console.error('Error fetching activities:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


const Activity = mongoose.model('Activity', {
    title: String,
    status: String,
    end: Date,
  });
app.patch('/activities/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    console.log(id+" "+status+" "+req.body.status);
    try {
      const updatedActivity = await Activity.findByIdAndUpdate(id, { status }, { new: true });
      console.log(updatedActivity);
      res.json(updatedActivity);
    } catch (error) {
      console.error('Error updating activity status:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  

  app.get('/daywise', async (req, res) => {
    try {
      const dayWiseActivities = await activity.aggregate([
        {
          $group: {
            _id: {
              date: { $dateToString: { format: "%Y-%m-%d", date: "$end" } },
              status: "$status"
            },
            count: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: "$_id.date",
            counts: {
              $push: {
                status: "$_id.status",
                count: "$count"
              }
            }
          }
        }
      ]);
  
      const dayWiseData = dayWiseActivities.map(day => {
        const entry = { date: day._id };
        day.counts.forEach(status => {
          entry[status.status] = status.count;
        });
        return entry;
      });
      // console.log(dayWiseData);
      res.json(dayWiseData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  