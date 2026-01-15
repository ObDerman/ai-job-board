import { useState } from 'react';
import React from 'react';

const API_URL = 'https://aijobboard-gno8.onrender.com';

const nationalities = ['سعودي', 'مصري', 'أردني', 'سوري', 'لبناني', 'يمني', 'سوداني', 'هندي', 'باكستاني'];
const majors = ['هندسة حاسب', 'تسويق', 'إدارة أعمال', 'علم نفس', 'موارد بشرية', 'تصميم جرافيك', 'هندسة كهربائية', 'محاسبة', 'طب', 'قانون'];
const cities = ['الرياض', 'جدة', 'الدمام', 'الخبر', 'مكة', 'المدينة', 'تبوك', 'القصيم', 'أبها'];
const genders = [
    { value: 'ذكر', label: 'ذكر' },
    { value: 'انثى', label: 'أنثى' }
];

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        nationality: '',
        major: '',
        experience_years: '',
        gender: '',
        city: '',
        cv_link: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setSuccess(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/candidates`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    experience_years: parseInt(formData.experience_years)
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setFormData({
                    name: '',
                    nationality: '',
                    major: '',
                    experience_years: '',
                    gender: '',
                    city: '',
                    cv_link: ''
                });
            } else {
                setError(data.error || 'حدث خطأ أثناء التسجيل');
            }
        } catch (err) {
            setError('لا يمكن الاتصال بالخادم. تأكد من تشغيل الباك إند.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold gradient-text mb-4">تسجيل مرشح جديد</h1>
                <p className="text-gray-400 text-lg">أدخل بياناتك للتقديم على الوظائف المتاحة</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 space-y-6">
                {/* Success Message */}
                {success && (
                    <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-6 py-4 rounded-2xl flex items-center gap-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">تم تسجيل بياناتك بنجاح!</span>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-6 py-4 rounded-2xl flex items-center gap-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                {/* Name */}
                <div>
                    <label className="block text-gray-300 font-medium mb-2">الاسم الكامل</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="مثال: محمد أحمد الغامدي"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-500 transition-all"
                    />
                </div>

                {/* Nationality & Gender Row */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-300 font-medium mb-2">الجنسية</label>
                        <select
                            name="nationality"
                            value={formData.nationality}
                            onChange={handleChange}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white transition-all"
                        >
                            <option value="" className="bg-gray-900">اختر الجنسية</option>
                            {nationalities.map(nat => (
                                <option key={nat} value={nat} className="bg-gray-900">{nat}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-300 font-medium mb-2">الجنس</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white transition-all"
                        >
                            <option value="" className="bg-gray-900">اختر الجنس</option>
                            {genders.map(g => (
                                <option key={g.value} value={g.value} className="bg-gray-900">{g.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Major */}
                <div>
                    <label className="block text-gray-300 font-medium mb-2">التخصص</label>
                    <select
                        name="major"
                        value={formData.major}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white transition-all"
                    >
                        <option value="" className="bg-gray-900">اختر التخصص</option>
                        {majors.map(maj => (
                            <option key={maj} value={maj} className="bg-gray-900">{maj}</option>
                        ))}
                    </select>
                </div>

                {/* Experience & City Row */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-300 font-medium mb-2">سنوات الخبرة</label>
                        <input
                            type="number"
                            name="experience_years"
                            value={formData.experience_years}
                            onChange={handleChange}
                            required
                            min="0"
                            max="50"
                            placeholder="مثال: 5"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-500 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 font-medium mb-2">المدينة</label>
                        <select
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white transition-all"
                        >
                            <option value="" className="bg-gray-900">اختر المدينة</option>
                            {cities.map(city => (
                                <option key={city} value={city} className="bg-gray-900">{city}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* CV Link */}
                <div>
                    <label className="block text-gray-300 font-medium mb-2">رابط السيرة الذاتية (اختياري)</label>
                    <input
                        type="url"
                        name="cv_link"
                        value={formData.cv_link}
                        onChange={handleChange}
                        placeholder="https://example.com/cv.pdf"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-500 transition-all"
                        dir="ltr"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            جاري التسجيل...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            تسجيل المرشح
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
