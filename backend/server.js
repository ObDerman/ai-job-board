require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const Groq = require('groq-sdk');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Groq Client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// Initialize SQLite Database
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        initDatabase();
    }
});

// Create candidates table
function initDatabase() {
    db.run(`
    CREATE TABLE IF NOT EXISTS candidates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      nationality TEXT NOT NULL,
      major TEXT NOT NULL,
      experience_years INTEGER NOT NULL,
      gender TEXT NOT NULL,
      city TEXT NOT NULL,
      cv_link TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Candidates table ready');
        }
    });
}

// AI System Prompt for SQL Generation
const SYSTEM_PROMPT = `You are an expert SQL Data Analyst. You have a table named 'candidates' with columns: name, nationality, major, experience_years, gender, city.

Your task is to convert the user's natural language query (which might be in Arabic or English) into a valid SQLite SQL query.

Rules:
1. Return ONLY the raw SQL query string. Do not use Markdown formatting like \`\`\`sql.
2. If the user's request is vague or missing critical filters (e.g., they just say 'I want an employee' or 'ابي موظف'), return a JSON object exactly like this: { "clarification_needed": "Ask a specific question in Arabic to narrow down the search" }
3. Ensure you handle Arabic text matching correctly (use LIKE for partial matches).
4. Always use SELECT * FROM candidates with appropriate WHERE clauses.
5. Common translations:
   - مهندس حاسب / هندسة حاسب = Computer Science or CS
   - الرياض = Riyadh
   - جدة = Jeddah
   - سعودي = Saudi
   - مصري = Egyptian
   - ذكر = Male
   - انثى = Female
   - تسويق = Marketing
   - علم نفس = Psychology
6. For experience queries, use experience_years with comparison operators.
7. If searching for a major, use LIKE '%keyword%' for flexible matching.`;

// POST /api/search - AI-powered natural language search
app.post('/api/search', async (req, res) => {
    try {
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

        console.log('Received search query:', query);

        // Call Groq API to generate SQL
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: query }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.1,
            max_tokens: 500,
        });

        const aiResponse = chatCompletion.choices[0]?.message?.content?.trim();
        console.log('AI Response:', aiResponse);

        // Check if AI needs clarification
        if (aiResponse.includes('clarification_needed')) {
            try {
                const clarification = JSON.parse(aiResponse);
                return res.json({ clarification_needed: clarification.clarification_needed });
            } catch (e) {
                // Extract clarification message if JSON parsing fails
                const match = aiResponse.match(/"clarification_needed":\s*"([^"]+)"/);
                if (match) {
                    return res.json({ clarification_needed: match[1] });
                }
            }
        }

        // Validate that response looks like SQL
        if (!aiResponse.toLowerCase().includes('select')) {
            return res.json({
                clarification_needed: 'عذراً، لم أفهم طلبك. هل يمكنك توضيح ما تبحث عنه؟ مثلاً: "ابي مهندس حاسب في الرياض بخبرة 3 سنوات"'
            });
        }

        // Execute SQL query
        db.all(aiResponse, [], (err, rows) => {
            if (err) {
                console.error('SQL Error:', err.message);
                return res.json({
                    clarification_needed: 'حدث خطأ في البحث. يرجى إعادة صياغة طلبك بشكل أوضح.'
                });
            }

            console.log('Found', rows.length, 'candidates');
            res.json({
                candidates: rows,
                sql: aiResponse // For debugging
            });
        });

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/candidates - Register new candidate
app.post('/api/candidates', (req, res) => {
    const { name, nationality, major, experience_years, gender, city, cv_link } = req.body;

    if (!name || !nationality || !major || !experience_years || !gender || !city) {
        return res.status(400).json({ error: 'All fields are required except cv_link' });
    }

    const sql = `INSERT INTO candidates (name, nationality, major, experience_years, gender, city, cv_link) 
               VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.run(sql, [name, nationality, major, experience_years, gender, city, cv_link || null], function (err) {
        if (err) {
            console.error('Error inserting candidate:', err.message);
            return res.status(500).json({ error: 'Failed to register candidate' });
        }

        res.status(201).json({
            message: 'Candidate registered successfully',
            id: this.lastID
        });
    });
});

// GET /api/candidates - List all candidates
app.get('/api/candidates', (req, res) => {
    db.all('SELECT * FROM candidates ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            console.error('Error fetching candidates:', err.message);
            return res.status(500).json({ error: 'Failed to fetch candidates' });
        }
        res.json(rows);
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'AI Job Board API is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints:`);
    console.log(`   POST /api/search - AI-powered search`);
    console.log(`   POST /api/candidates - Register candidate`);
    console.log(`   GET  /api/candidates - List all candidates`);
});
