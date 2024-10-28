const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Google Generative AI with your API key
const genAI = new GoogleGenerativeAI("AIzaSyAysOUknk87SbtA1e9YZWpDWlDTl43PoEI");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Endpoint to generate questions
router.post('/generateQuestions', async (req, res) => {
    try {
        console.log(req.body.paragraph)
        const paragraph = "create a one question for this passage and this question students ask to professor,only start with w h questions:"+ req.body.paragraph;
        // Generate content based on the prompt
        const result = await model.generateContent(paragraph);
        const response = await result.response;
        const generatedText = await response.text();
        const lines = generatedText.split('**');
        let questions = [];

        // Define the set of WH-questions
        const whQuestions = ['what', 'when', 'where', 'who', 'whom', 'which', 'whose', 'why', 'how'];

        // Filter lines that start with WH-questions and end with a question mark
        lines.forEach(line => {
            const trimmedLine = line.trim();
            const lowerCaseLine = trimmedLine.toLowerCase();
            if (whQuestions.some(q => lowerCaseLine.startsWith(q)) && trimmedLine.endsWith('?')) {
                questions.push(trimmedLine);
            }
        });
        // Send the array of questions as the response
        res.send( questions[0] );
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while generating content.' });
    }
});

module.exports = router;