const mongoose = require('mongoose');

require('dotenv').config();
const Notice = require('./backend/models/notice');
mongoose.connect('', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=> {
    console.log("DB Connected")
})
.catch((err)=> {
    console.log(err.message);
})

const seedNotices = async () => {
    const notices = [
        {
            title: 'Orientation Day',
            notice: 'Welcome to the orientation day event at the college auditorium.',
            user: new mongoose.Types.ObjectId(), // Replace with a valid user ObjectId if needed
            date: new Date('2024-09-12'),
            time: '10:00 AM',
        },
        {
            title: 'Exam Schedule',
            notice: 'The exam schedule has been updated. Check the notice board for details.',
            user: new mongoose.Types.ObjectId(), // Replace with a valid user ObjectId if needed
            date: new Date('2024-09-15'),
            time: '9:00 AM',
        },
        {
            title: 'Guest Lecture',
            notice: 'Join us for a guest lecture by a renowned industry expert.',
            user: new mongoose.Types.ObjectId(), // Replace with a valid user ObjectId if needed
            date: new Date('2024-09-20'),
            time: '2:00 PM',
        },
    ];

    try {
        // await Notice.deleteMany(); 
        await Notice.insertMany(notices); // Insert new notices
        console.log('Notices seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding notices:', error);
        process.exit(1);
    }
};

const seedDB = async () => {
    await seedNotices();
}

seedDB();
