// Authors: Joshua Vachachira, Ethan Cala, Yash Edala
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Ping API to wake server
app.get('/api/ping', (req, res) => {
    res.send('Server is awake!');
});

// Risk calculation API
app.post('/api/calculate-risk', (req, res) => {
    const { age, feet, inches, weight, systolic, diastolic, diseases } = req.body;

    // Calculate BMI (convert to metric)
    const totalInches = (feet * 12) + inches;
    const heightMeters = totalInches * 0.0254; // inches to meters
    const weightKg = weight * 0.453592; // pounds to kg
    const bmi = weightKg / (heightMeters * heightMeters);

    // Age points
    let agePoints = 0;
    if (age < 38) agePoints = 0;
    else if (age < 45) agePoints = 10;
    else if (age < 60) agePoints = 20;
    else agePoints = 30;

    // BMI points
    let bmiPoints = 0;
    if (bmi >= 18.5 && bmi <= 24.9) bmiPoints = 0; // normal
    else if (bmi >= 25.0 && bmi <= 29.9) bmiPoints = 30; // overweight
    else bmiPoints = 75; // obese

    // Blood Pressure points and category
    let bpPoints = 0;
    let bpCategory = '';
    if (systolic > 180 || diastolic > 120) {
        bpPoints = 100;
        bpCategory = 'Crisis';
    } else if (systolic >= 140 || diastolic >= 90) {
        bpPoints = 75;
        bpCategory = 'Stage 2';
    } else if (systolic >= 130 || diastolic >= 80) {
        bpPoints = 30;
        bpCategory = 'Stage 1';
    } else if (systolic >= 120) {
        bpPoints = 15;
        bpCategory = 'Elevated';
    } else {
        bpPoints = 0;
        bpCategory = 'Normal';
    }

    // Family disease points
    const diseasePoints = diseases.length * 10;

    // Total score
    const totalScore = agePoints + bmiPoints + bpPoints + diseasePoints;

    // Risk category
    let riskCategory = '';
    if (totalScore <= 20) riskCategory = 'Low Risk';
    else if (totalScore <= 50) riskCategory = 'Moderate Risk';
    else if (totalScore <= 75) riskCategory = 'High Risk';
    else riskCategory = 'Uninsurable';

    // Response
    res.json({
        agePoints,
        bmi,
        bmiPoints,
        bpCategory,
        bpPoints,
        diseasePoints,
        totalScore,
        riskCategory
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
