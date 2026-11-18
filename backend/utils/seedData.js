const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');
const MedicineReminder = require('../models/MedicineReminder');
const Article = require('../models/Article');
const Notification = require('../models/Notification');

const autoSeedInitialData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('ℹ️ Database already contains data. Skipping auto-seeding.');
      return;
    }

    console.log('🌱 Seeding fresh database with comprehensive realistic medical dataset...');

    // 1. Create Admin
    const adminUser = await User.create({
      name: 'Dr. Alok Verma (Chief Administrator)',
      email: 'admin@sehatsaathi.com',
      password: 'Admin@123',
      role: 'admin',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
      gender: 'male',
      dateOfBirth: new Date('1980-05-15'),
      bloodGroup: 'O+',
      address: {
        street: 'Connaught Place Health Complex',
        city: 'New Delhi',
        state: 'Delhi',
        postalCode: '110001',
      },
    });

    // 2. Create Doctors
    const doctorUsersData = [
      {
        name: 'Dr. Rajesh Sharma',
        email: 'dr.rajesh@sehatsaathi.com',
        password: 'Doctor@123',
        role: 'doctor',
        phone: '+91 98111 22233',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=500&q=80',
        gender: 'male',
        specialization: 'Cardiologist',
        qualification: 'MBBS, MD (Medicine), DM (Cardiology) - AIIMS',
        experience: 14,
        consultationFee: 800,
        clinicName: 'Heart Care & Cardiology Center',
        clinicAddress: 'B-12 Ring Road, South Extension, New Delhi',
        bio: 'Senior Interventional Cardiologist with 14+ years of expertise in cardiovascular disease prevention, hypertension, and angioplasty management.',
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        availableTimeSlots: ['09:00 AM', '10:00 AM', '11:30 AM', '03:00 PM', '04:30 PM', '06:00 PM'],
        rating: 4.9,
        reviewsCount: 38,
      },
      {
        name: 'Dr. Ananya Verma',
        email: 'dr.ananya@sehatsaathi.com',
        password: 'Doctor@123',
        role: 'doctor',
        phone: '+91 98222 33344',
        avatar: 'https://images.unsplash.com/photo-1594824813515-0b043236e788?auto=format&fit=crop&w=500&q=80',
        gender: 'female',
        specialization: 'Dermatologist',
        qualification: 'MBBS, MD (Dermatology, Venereology & Leprosy)',
        experience: 8,
        consultationFee: 600,
        clinicName: 'DermaGlow Skin & Hair Clinic',
        clinicAddress: '402 Sunrise Heights, Bandra West, Mumbai',
        bio: 'Clinical & Aesthetic Dermatologist specializing in chronic skin disorders, acne therapy, eczema, and allergy treatments.',
        availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
        availableTimeSlots: ['10:00 AM', '11:00 AM', '02:00 PM', '03:30 PM', '05:00 PM'],
        rating: 4.8,
        reviewsCount: 29,
      },
      {
        name: 'Dr. Vikram Patel',
        email: 'dr.vikram@sehatsaathi.com',
        password: 'Doctor@123',
        role: 'doctor',
        phone: '+91 98333 44455',
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=500&q=80',
        gender: 'male',
        specialization: 'General Physician',
        qualification: 'MBBS, DNB (Family Medicine)',
        experience: 11,
        consultationFee: 450,
        clinicName: 'Community Wellness Clinic',
        clinicAddress: '15 Gandhi Nagar, Near Metro Station, Bengaluru',
        bio: 'Compassionate general practitioner focusing on holistic primary care, seasonal viral infections, diabetes control, and geriatric wellness.',
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        availableTimeSlots: ['08:30 AM', '09:30 AM', '10:30 AM', '04:00 PM', '05:00 PM', '06:30 PM'],
        rating: 4.7,
        reviewsCount: 42,
      },
      {
        name: 'Dr. Sunita Rao',
        email: 'dr.sunita@sehatsaathi.com',
        password: 'Doctor@123',
        role: 'doctor',
        phone: '+91 98444 55566',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&q=80',
        gender: 'female',
        specialization: 'Pediatrician',
        qualification: 'MBBS, DCH, MD (Pediatrics)',
        experience: 15,
        consultationFee: 700,
        clinicName: 'Little Smiles Child Health Care',
        clinicAddress: '7th Cross, Indiranagar, Bengaluru',
        bio: 'Senior Consultant Child Specialist dedicated to infant nutrition, immunization tracking, developmental milestones, and pediatric asthma.',
        availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
        availableTimeSlots: ['10:00 AM', '11:30 AM', '03:00 PM', '04:30 PM', '06:00 PM'],
        rating: 4.9,
        reviewsCount: 56,
      },
      {
        name: 'Dr. Amit Mehra',
        email: 'dr.amit@sehatsaathi.com',
        password: 'Doctor@123',
        role: 'doctor',
        phone: '+91 98555 66677',
        avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=500&q=80',
        gender: 'male',
        specialization: 'Orthopedic Surgeon',
        qualification: 'MBBS, MS (Orthopedics), Fellowship in Joint Replacement',
        experience: 12,
        consultationFee: 900,
        clinicName: 'OrthoSpine Bone & Joint Center',
        clinicAddress: 'Sector 18, Noida, Uttar Pradesh',
        bio: 'Expert in sports injury rehabilitation, osteoarthritis care, spinal alignment, and arthroscopic procedures.',
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Saturday'],
        availableTimeSlots: ['09:00 AM', '10:30 AM', '02:30 PM', '04:00 PM', '05:30 PM'],
        rating: 4.8,
        reviewsCount: 31,
      },
      {
        name: 'Dr. Priya Iyer',
        email: 'dr.priya@sehatsaathi.com',
        password: 'Doctor@123',
        role: 'doctor',
        phone: '+91 98666 77788',
        avatar: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=500&q=80',
        gender: 'female',
        specialization: 'Gynecologist',
        qualification: 'MBBS, MS (Obstetrics & Gynecology), DGO',
        experience: 10,
        consultationFee: 750,
        clinicName: 'Matruchhaya Women Care',
        clinicAddress: 'Anna Nagar West, Chennai',
        bio: 'Empathetic specialist in women’s wellness, prenatal counselling, PCOS/PCOD management, and safe maternal care.',
        availableDays: ['Monday', 'Wednesday', 'Thursday', 'Saturday'],
        availableTimeSlots: ['09:30 AM', '11:00 AM', '03:00 PM', '04:30 PM', '06:00 PM'],
        rating: 4.8,
        reviewsCount: 35,
      },
    ];

    const createdDoctors = [];
    for (const docData of doctorUsersData) {
      const user = await User.create({
        name: docData.name,
        email: docData.email,
        password: docData.password,
        role: 'doctor',
        phone: docData.phone,
        avatar: docData.avatar,
        gender: docData.gender,
      });

      const doctor = await Doctor.create({
        user: user._id,
        specialization: docData.specialization,
        qualification: docData.qualification,
        experience: docData.experience,
        consultationFee: docData.consultationFee,
        clinicName: docData.clinicName,
        clinicAddress: docData.clinicAddress,
        bio: docData.bio,
        availableDays: docData.availableDays,
        availableTimeSlots: docData.availableTimeSlots,
        rating: docData.rating,
        reviewsCount: docData.reviewsCount,
        isVerified: true,
        status: 'active',
      });

      createdDoctors.push({ user, doctor });
    }

    // 3. Create Sample Patients
    const patientUser = await User.create({
      name: 'Rahul Gupta',
      email: 'patient@sehatsaathi.com',
      password: 'Patient@123',
      role: 'patient',
      phone: '+91 98700 11223',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      gender: 'male',
      dateOfBirth: new Date('1998-04-12'),
      bloodGroup: 'B+',
      address: {
        street: 'Apt 402, Green Meadows',
        city: 'Pune',
        state: 'Maharashtra',
        postalCode: '411001',
      },
      emergencyContact: {
        name: 'Vikas Gupta (Brother)',
        phone: '+91 98700 99887',
        relation: 'Brother',
      },
    });

    const patient2 = await User.create({
      name: 'Sneha Deshmukh',
      email: 'sneha@example.com',
      password: 'Patient@123',
      role: 'patient',
      phone: '+91 98123 45678',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      gender: 'female',
      dateOfBirth: new Date('1995-11-20'),
      bloodGroup: 'O+',
      address: {
        street: 'Flat 12, Lotus Apartments',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400050',
      },
    });

    // 4. Create Appointments for Rahul Gupta
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 5);

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 4);

    await Appointment.create([
      {
        patient: patientUser._id,
        doctor: createdDoctors[0].doctor._id, // Dr Rajesh Sharma (Cardio)
        appointmentDate: tomorrow,
        timeSlot: '10:00 AM',
        status: 'confirmed',
        reason: 'Routine quarterly cardiovascular review and cholesterol checkup.',
        notes: 'Patient reports mild shortness of breath during brisk morning walks.',
      },
      {
        patient: patientUser._id,
        doctor: createdDoctors[1].doctor._id, // Dr Ananya Verma (Derma)
        appointmentDate: nextWeek,
        timeSlot: '02:00 PM',
        status: 'pending',
        reason: 'Recurring allergic skin rash on forearms after exposure to humidity.',
      },
      {
        patient: patientUser._id,
        doctor: createdDoctors[2].doctor._id, // Dr Vikram Patel (General)
        appointmentDate: pastDate,
        timeSlot: '09:30 AM',
        status: 'completed',
        reason: 'Seasonal viral flu, persistent dry cough and low-grade evening fever.',
        notes: 'Vitals stable. Lungs clear. Prescribed Azithromycin course & Paracetamol.',
        prescriptionSummary: 'Tab Azithromycin 500mg 1 OD for 3 days. Tab Dolo 650 SOS.',
      },
      {
        patient: patient2._id,
        doctor: createdDoctors[0].doctor._id,
        appointmentDate: tomorrow,
        timeSlot: '11:30 AM',
        status: 'pending',
        reason: 'Blood pressure fluctuations and palpitation consultation.',
      },
    ]);

    // 5. Create Medical Records for Rahul Gupta
    await MedicalRecord.create([
      {
        patient: patientUser._id,
        doctor: createdDoctors[2].doctor._id,
        doctorName: 'Dr. Vikram Patel',
        title: 'Seasonal Flu & Upper Respiratory Consultation Prescription',
        recordType: 'prescription',
        recordDate: pastDate,
        diagnosis: 'Acute Upper Respiratory Tract Viral Infection',
        description: 'Patient presented with 3-day history of low fever and dry cough. Throat showed mild erythema. Advised hydration and complete rest.',
        tags: ['Prescription', 'Respiratory', 'Viral Flu'],
      },
      {
        patient: patientUser._id,
        doctorName: 'Dr. Lal PathLabs Certified Lab',
        title: 'Comprehensive Lipid & Lipid Profile Panel',
        recordType: 'lab_report',
        recordDate: new Date('2026-10-15'),
        diagnosis: 'Mild Hyperlipidemia',
        description: 'Total Cholesterol: 215 mg/dL, HDL: 48 mg/dL, LDL: 135 mg/dL, Triglycerides: 160 mg/dL. Advised low saturated fat diet and brisk cardio.',
        tags: ['Lab Report', 'Cholesterol', 'Cardiology'],
      },
      {
        patient: patientUser._id,
        doctorName: 'Max Healthcare Imaging Center',
        title: 'Chest X-Ray (PA View) Report',
        recordType: 'scan',
        recordDate: new Date('2026-09-10'),
        diagnosis: 'Normal Chest Radiograph',
        description: 'Both lung fields appear clear. Cardiothoracic ratio within normal limits. Both costophrenic angles sharp.',
        tags: ['Scan', 'X-Ray', 'Lungs'],
      },
    ]);

    // 6. Create Medicine Reminders for Rahul Gupta
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    await MedicineReminder.create([
      {
        user: patientUser._id,
        medicineName: 'Atorvastatin (Lipitor)',
        dosage: '10mg - 1 Tablet',
        frequency: 'Once Daily',
        times: ['09:00 PM'],
        instructions: 'Take 1 tablet at bedtime with warm water for cholesterol control.',
        startDate: new Date(),
        endDate: nextMonth,
        status: 'active',
        logs: [
          {
            date: new Date().toISOString().split('T')[0],
            time: '09:00 PM',
            status: 'taken',
          },
        ],
      },
      {
        user: patientUser._id,
        medicineName: 'Metformin Hydrochloride',
        dosage: '500mg - 1 Tablet',
        frequency: 'Twice Daily',
        times: ['08:30 AM', '08:30 PM'],
        instructions: 'Take immediately after breakfast and dinner to regulate blood glucose.',
        startDate: new Date(),
        endDate: nextMonth,
        status: 'active',
        logs: [
          {
            date: new Date().toISOString().split('T')[0],
            time: '08:30 AM',
            status: 'taken',
          },
        ],
      },
      {
        user: patientUser._id,
        medicineName: 'Vitamin D3 (Cholecalciferol)',
        dosage: '60,000 IU Capsule',
        frequency: 'Weekly',
        times: ['10:00 AM'],
        instructions: 'Take once every Sunday morning with whole milk after breakfast.',
        startDate: new Date(),
        status: 'active',
        logs: [],
      },
    ]);

    // 7. Create Informative Health Articles
    await Article.create([
      {
        title: '10 Simple Habits for a Healthy Heart in Your 30s and 40s',
        slug: '10-simple-habits-healthy-heart',
        summary: 'Cardiovascular disease remains the leading cause of premature morbidity. Learn 10 proven lifestyle adaptations to keep your heart pumping strong.',
        content: `Maintaining good cardiovascular health doesn't require drastic overhauls; subtle, sustainable daily choices make the largest long-term difference.

### 1. Prioritize Aerobic Exercise
Engage in at least 150 minutes of moderate-intensity aerobic physical activity every week, or 75 minutes of vigorous activity. Brisk walking, swimming, cycling, or jogging reduces blood pressure and strengthens the heart muscle.

### 2. Guard Your Sleep Cycle
Adults who sleep fewer than 6 hours per night face nearly double the risk of stroke and myocardial infarction. Deep sleep lowers heart rate and stabilizes arterial blood pressure.

### 3. Adopt the Mediterranean Plate
Emphasize extra virgin olive oil, walnuts, almonds, fatty fish (rich in Omega-3), legumes, and colorful leafy greens. Drastically reduce processed sodium and transfats.

### 4. Monitor Blood Pressure & Lipids Regularly
Hypertension is often dubbed the 'silent killer' because it seldom produces noticeable early symptoms. Schedule bi-annual screenings and check your fasting lipid panel.`,
        category: 'Cardiology',
        author: adminUser._id,
        authorName: 'Dr. Rajesh Sharma, MD',
        readTime: '5 min read',
        coverImage: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80',
        tags: ['Heart', 'Cardiology', 'Wellness', 'Fitness'],
        views: 342,
        likes: 47,
        isPublished: true,
      },
      {
        title: 'Managing Stress & Anxiety: A Practical Guide for Modern Working Professionals',
        slug: 'managing-stress-anxiety-working-professionals',
        summary: 'Chronic workplace stress alters cortisol levels, sleep architecture, and immune response. Discover actionable mindfulness and cognitive practices to regain balance.',
        content: `In an era of relentless notifications and hyper-connectivity, chronic sympathetic nervous system activation has become an invisible epidemic.

### The Physiology of Chronic Stress
When the brain perceives prolonged cognitive pressure, the adrenal glands continuously release cortisol and adrenaline. Over weeks and months, this damages gut microbiome diversity, elevates resting pulse, and fosters systemic inflammation.

### The 4-7-8 Breathing Technique
To instantly trigger parasympathetic recovery:
1. Inhale quietly through your nose for 4 counts.
2. Hold your breath gently for 7 counts.
3. Exhale completely and audibly through your mouth for 8 counts.
Repeat 4 cycles during stressful intervals to reset autonomic balance.

### Establish Digital Sunsets
Turn off screens 60 minutes prior to retiring for bed. Blue spectrum light inhibits melatonin synthesis, sabotaging REM recovery.`,
        category: 'Mental Health',
        author: adminUser._id,
        authorName: 'Dr. SehatSaathi Editorial',
        readTime: '6 min read',
        coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
        tags: ['Mental Health', 'Anxiety', 'Mindfulness'],
        views: 289,
        likes: 38,
        isPublished: true,
      },
      {
        title: 'Demystifying Type 2 Diabetes: Glycemic Index, Nutrition, and Prevention',
        slug: 'demystifying-type-2-diabetes-nutrition-prevention',
        summary: 'Understanding insulin sensitivity, glycemic load of Indian foods, and sustainable nutritional adjustments for balanced blood glucose.',
        content: `Type 2 Diabetes is predominantly a metabolic disorder driven by progressive insulin resistance rather than total insulin deficiency.

### The Significance of Glycemic Index (GI)
High glycemic foods spike plasma glucose rapidly, triggering excessive pancreatic insulin output. Over time, peripheral receptors down-regulate sensitivity.

### Food Swaps for Better Glucose Stability
- Replace polished white rice with brown rice, quinoa, or whole millets (Ragi, Jowar).
- Increase soluble fiber intake: Chia seeds, fenugreek (methi), flaxseeds, and leafy greens delay carbohydrate absorption.
- Ensure lean protein at every meal: Lentils, paneer, eggs, or Greek yogurt blunt postprandial glucose surges.`,
        category: 'Diabetes Care',
        author: createdDoctors[2].user._id,
        authorName: 'Dr. Vikram Patel',
        readTime: '4 min read',
        coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
        tags: ['Diabetes', 'Nutrition', 'Diet'],
        views: 415,
        likes: 62,
        isPublished: true,
      },
      {
        title: 'Dermatologist Secrets for Healthy Skin: From Sunscreen to Hydration',
        slug: 'dermatologist-secrets-healthy-skin',
        summary: 'Break down skincare myths, learn why Broad Spectrum SPF is non-negotiable, and how skin barrier integrity protects against premature aging.',
        content: `Your skin is your body's largest organ, serving as a frontline immune defense and protective barrier against pathogens, ultraviolet radiation, and pollutants.

### The Non-Negotiable Rule: Sunscreen Daily
UVA rays penetrate deep clouds and glass windows year-round. Consistent application of Broad Spectrum SPF 30+ or SPF 50 protects collagen degradation and prevents hyperpigmentation.

### Respect the Skin Barrier
Over-exfoliating with harsh physical scrubs or excessive hydroxy acids strips lipids and ceramides, resulting in stinging, redness, and acne flares. Stick to gentle pH-balanced cleansers.`,
        category: 'Wellness',
        author: createdDoctors[1].user._id,
        authorName: 'Dr. Ananya Verma',
        readTime: '4 min read',
        coverImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
        tags: ['Skincare', 'Dermatology', 'Wellness'],
        views: 520,
        likes: 81,
        isPublished: true,
      },
    ]);

    // 8. Notifications for Patient
    await Notification.create([
      {
        user: patientUser._id,
        title: 'Appointment Confirmed! 🩺',
        message: 'Your upcoming appointment with Dr. Rajesh Sharma for tomorrow at 10:00 AM has been confirmed.',
        type: 'appointment',
        link: '/appointments',
      },
      {
        user: patientUser._id,
        title: 'Time for Evening Medication 💊',
        message: 'Reminder: Take Atorvastatin (Lipitor 10mg) tonight after dinner.',
        type: 'reminder',
        link: '/reminders',
      },
      {
        user: patientUser._id,
        title: 'New Healthcare Article Available 📖',
        message: 'Check out the new guide on managing stress and practical mindfulness by our expert panel.',
        type: 'article',
        link: '/articles',
      },
    ]);

    console.log('✅ Database seeded successfully with realistic data!');
    console.log('   Admin: admin@sehatsaathi.com / Admin@123');
    console.log('   Doctor: dr.rajesh@sehatsaathi.com / Doctor@123');
    console.log('   Patient: patient@sehatsaathi.com / Patient@123');
  } catch (error) {
    console.error('❌ Error during auto-seeding:', error);
  }
};

module.exports = { autoSeedInitialData };
