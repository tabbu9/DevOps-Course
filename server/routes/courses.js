const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();

router.get('/topics', (req, res) => {
  res.json([
    { key: 'docker', label: 'Docker' },
    { key: 'kubernetes', label: 'Kubernetes' },
    { key: 'aws', label: 'AWS Services' },
    { key: 'sonarqube', label: 'SonarQube' },
    { key: 'jenkins', label: 'Jenkins' }
  ]);
});

router.get('/subtopics/:topicKey', async (req, res) => {
  const { topicKey } = req.params;
  try {
    const dataPath = path.join(__dirname, '../courses-data/', `${topicKey}.json`);
    const content = fs.readFileSync(dataPath, 'utf-8');
    res.json(JSON.parse(content));
  } catch (err) {
    res.status(404).json({ error: "Course not found" });
  }
});

module.exports = router;
