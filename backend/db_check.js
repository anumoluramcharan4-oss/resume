const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/career-ai')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Define simple schema to fetch data
    const Resume = mongoose.model('Resume', new mongoose.Schema({}, { strict: false }));
    const resumes = await Resume.find({});
    
    console.log(`Found ${resumes.length} resumes in db.`);
    resumes.forEach((r, idx) => {
      console.log(`\n--- Resume #${idx + 1} ---`);
      console.log(`ID: ${r._id}`);
      console.log(`Title: ${r.title}`);
      console.log(`Name: ${r.personal?.fullName}`);
      console.log(`About (first 100 chars):`, r.about ? r.about.substring(0, 100) : 'none');
      console.log(`RawText length:`, r.rawText ? r.rawText.length : 0);
      console.log(`RawText (first 150 chars):`, r.rawText ? r.rawText.substring(0, 150) : 'none');
    });
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error:', err);
  });
