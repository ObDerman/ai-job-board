import React from 'react';

export default function CandidateCard({ candidate }) {
    const getGenderIcon = (gender) => {
        if (gender === 'ذكر') {
            return (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                </svg>
            );
        }
        return (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
        );
    };

    return (
        <div className="candidate-card bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-5 hover:border-indigo-500/50">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                        {candidate.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg">{candidate.name}</h3>
                        <p className="text-indigo-400 text-sm">{candidate.major}</p>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${candidate.gender === 'ذكر'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                    }`}>
                    {candidate.gender}
                </span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-gray-300">
                    <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                    </svg>
                    <span className="text-sm">{candidate.nationality}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                    <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm">{candidate.city}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 col-span-2">
                    <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">{candidate.experience_years} سنوات خبرة</span>
                </div>
            </div>

            {/* CV Button */}
            {candidate.cv_link && (
                <a
                    href={candidate.cv_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 hover:from-indigo-600/30 hover:to-purple-600/30 border border-indigo-500/30 text-indigo-400 hover:text-white font-medium py-3 px-4 rounded-xl transition-all"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    عرض السيرة الذاتية
                </a>
            )}
        </div>
    );
}
