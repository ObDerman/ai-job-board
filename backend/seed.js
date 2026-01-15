const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
        process.exit(1);
    }
    console.log('Connected to SQLite database');
});

// 10 Dummy candidates with Arabic names and Saudi market data
const candidates = [
    {
        name: 'محمد الغامدي',
        nationality: 'سعودي',
        major: 'هندسة حاسب',
        experience_years: 5,
        gender: 'ذكر',
        city: 'الرياض',
        cv_link: 'https://example.com/cv/mohammed-alghamdi.pdf'
    },
    {
        name: 'فاطمة العتيبي',
        nationality: 'سعودي',
        major: 'تسويق',
        experience_years: 3,
        gender: 'انثى',
        city: 'جدة',
        cv_link: 'https://example.com/cv/fatima-alotaibi.pdf'
    },
    {
        name: 'أحمد محمود',
        nationality: 'مصري',
        major: 'هندسة حاسب',
        experience_years: 7,
        gender: 'ذكر',
        city: 'الرياض',
        cv_link: 'https://example.com/cv/ahmed-mahmoud.pdf'
    },
    {
        name: 'نورة الشمري',
        nationality: 'سعودي',
        major: 'علم نفس',
        experience_years: 2,
        gender: 'انثى',
        city: 'الدمام',
        cv_link: 'https://example.com/cv/noura-alshammari.pdf'
    },
    {
        name: 'خالد السعيد',
        nationality: 'سعودي',
        major: 'إدارة أعمال',
        experience_years: 10,
        gender: 'ذكر',
        city: 'الرياض',
        cv_link: 'https://example.com/cv/khaled-alsaeed.pdf'
    },
    {
        name: 'سارة الحربي',
        nationality: 'سعودي',
        major: 'هندسة حاسب',
        experience_years: 4,
        gender: 'انثى',
        city: 'جدة',
        cv_link: 'https://example.com/cv/sara-alharbi.pdf'
    },
    {
        name: 'يوسف إبراهيم',
        nationality: 'مصري',
        major: 'تسويق',
        experience_years: 6,
        gender: 'ذكر',
        city: 'الرياض',
        cv_link: 'https://example.com/cv/youssef-ibrahim.pdf'
    },
    {
        name: 'ريم القحطاني',
        nationality: 'سعودي',
        major: 'موارد بشرية',
        experience_years: 5,
        gender: 'انثى',
        city: 'الخبر',
        cv_link: 'https://example.com/cv/reem-alqahtani.pdf'
    },
    {
        name: 'عبدالله الدوسري',
        nationality: 'سعودي',
        major: 'هندسة حاسب',
        experience_years: 8,
        gender: 'ذكر',
        city: 'الرياض',
        cv_link: 'https://example.com/cv/abdullah-aldosari.pdf'
    },
    {
        name: 'هند الزهراني',
        nationality: 'سعودي',
        major: 'تصميم جرافيك',
        experience_years: 3,
        gender: 'انثى',
        city: 'جدة',
        cv_link: 'https://example.com/cv/hind-alzahrani.pdf'
    }
];

// Create table first
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
        process.exit(1);
    }

    console.log('Table created/verified');

    // Clear existing data
    db.run('DELETE FROM candidates', (err) => {
        if (err) {
            console.error('Error clearing table:', err.message);
        }

        // Insert all candidates
        const stmt = db.prepare(`
      INSERT INTO candidates (name, nationality, major, experience_years, gender, city, cv_link)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

        candidates.forEach((candidate, index) => {
            stmt.run(
                candidate.name,
                candidate.nationality,
                candidate.major,
                candidate.experience_years,
                candidate.gender,
                candidate.city,
                candidate.cv_link,
                (err) => {
                    if (err) {
                        console.error(`Error inserting candidate ${index + 1}:`, err.message);
                    } else {
                        console.log(`✅ Added: ${candidate.name} - ${candidate.major} - ${candidate.city}`);
                    }
                }
            );
        });

        stmt.finalize(() => {
            console.log('\n🎉 Database seeded with 10 candidates!');
            db.close();
        });
    });
});
