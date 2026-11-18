const dotenv = require('dotenv');
dotenv.config();

const { connectDB, disconnectDB } = require('./config/db');
const { autoSeedInitialData } = require('./utils/seedData');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');
const MedicalRecord = require('./models/MedicalRecord');
const MedicineReminder = require('./models/MedicineReminder');
const Article = require('./models/Article');
const Notification = require('./models/Notification');

const runSeeder = async () => {
  try {
    await connectDB();

    if (process.argv[2] === '-d') {
      console.log('🗑️ Destroying all data from database collections...');
      await User.deleteMany();
      await Doctor.deleteMany();
      await Appointment.deleteMany();
      await MedicalRecord.deleteMany();
      await MedicineReminder.deleteMany();
      await Article.deleteMany();
      await Notification.deleteMany();
      console.log('✅ All data destroyed successfully.');
    } else {
      console.log('🔄 Cleaning up existing data before seeding...');
      await User.deleteMany();
      await Doctor.deleteMany();
      await Appointment.deleteMany();
      await MedicalRecord.deleteMany();
      await MedicineReminder.deleteMany();
      await Article.deleteMany();
      await Notification.deleteMany();

      await autoSeedInitialData();
      console.log('✨ Data seeding complete.');
    }

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder script encountered error:', error);
    process.exit(1);
  }
};

runSeeder();
