import { useState, useRef, useEffect } from 'react';
import React from 'react';
import CandidateCard from '../components/CandidateCard';

const API_URL = 'https://aijobboard-gno8.onrender.com';

export default function SearchPage() {
    const [messages, setMessages] = useState([
        {
            type: 'ai',
            content: 'مرحباً! 👋 أنا مساعدك الذكي للبحث عن المرشحين. اكتب طلبك بشكل طبيعي مثل:\n\n• "ابي مهندس حاسب في الرياض"\n• "ابي موظف سعودي خبرة 5 سنوات"\n• "Show me all marketing candidates"'
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: userMessage })
            });

            const data = await response.json();

            if (data.clarification_needed) {
                setMessages(prev => [...prev, {
                    type: 'ai',
                    content: data.clarification_needed
                }]);
            } else if (data.candidates) {
                if (data.candidates.length === 0) {
                    setMessages(prev => [...prev, {
                        type: 'ai',
                        content: 'لم أجد أي مرشحين يطابقون معايير البحث. جرب توسيع نطاق البحث أو تغيير المعايير.'
                    }]);
                } else {
                    setMessages(prev => [...prev, {
                        type: 'ai',
                        content: `وجدت ${data.candidates.length} مرشح${data.candidates.length > 1 ? 'ين' : ''} مطابق${data.candidates.length > 1 ? 'ين' : ''} لطلبك:`,
                        candidates: data.candidates
                    }]);
                }
            } else if (data.error) {
                setMessages(prev => [...prev, {
                    type: 'ai',
                    content: `حدث خطأ: ${data.error}`
                }]);
            }
        } catch (err) {
            setMessages(prev => [...prev, {
                type: 'ai',
                content: 'لا يمكن الاتصال بالخادم. تأكد من تشغيل الباك إند على المنفذ 5000.'
            }]);
        } finally {
            setLoading(false);
        }
    };

    const quickQueries = [
        'ابي مهندس حاسب في الرياض',
        'ابي موظف سعودي',
        'اعرض كل المرشحين بجدة',
        'ابي موظف خبرة اكثر من 5 سنوات'
    ];

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold gradient-text mb-4">البحث بالذكاء الاصطناعي</h1>
                <p className="text-gray-400 text-lg">اكتب طلبك باللغة العربية أو الإنجليزية وسأجد لك المرشحين المناسبين</p>
            </div>

            {/* Quick Queries */}
            <div className="flex flex-wrap gap-2 justify-center mb-6">
                {quickQueries.map((query, idx) => (
                    <button
                        key={idx}
                        onClick={() => setInput(query)}
                        className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all text-sm"
                    >
                        {query}
                    </button>
                ))}
            </div>

            {/* Chat Container */}
            <div className="glass rounded-3xl overflow-hidden">
                {/* Messages Area */}
                <div className="h-[500px] overflow-y-auto p-6 space-y-6">
                    {messages.map((message, idx) => (
                        <div key={idx} className={`chat-bubble ${message.type === 'user' ? 'flex justify-start' : 'flex justify-end'}`}>
                            <div className={`max-w-[85%] ${message.type === 'user' ? 'order-1' : 'order-1'}`}>
                                {/* Avatar */}
                                <div className={`flex items-start gap-3 ${message.type === 'user' ? 'flex-row' : 'flex-row-reverse'}`}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${message.type === 'user'
                                            ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                                            : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                                        }`}>
                                        {message.type === 'user' ? (
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        )}
                                    </div>

                                    {/* Message Content */}
                                    <div className={`rounded-2xl px-5 py-4 ${message.type === 'user'
                                            ? 'bg-gradient-to-br from-blue-600/30 to-cyan-600/30 border border-blue-500/30'
                                            : 'bg-white/10 border border-white/10'
                                        }`}>
                                        <p className="text-white whitespace-pre-line">{message.content}</p>
                                    </div>
                                </div>

                                {/* Candidate Cards */}
                                {message.candidates && message.candidates.length > 0 && (
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {message.candidates.map((candidate) => (
                                            <CandidateCard key={candidate.id} candidate={candidate} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Loading Indicator */}
                    {loading && (
                        <div className="flex justify-end chat-bubble">
                            <div className="flex items-start gap-3 flex-row-reverse">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="bg-white/10 border border-white/10 rounded-2xl px-5 py-4">
                                    <div className="loading-dots flex gap-1">
                                        <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                                        <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                                        <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSubmit} className="border-t border-white/10 p-4">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="اكتب طلبك هنا... مثال: ابي مهندس حاسب سعودي في الرياض"
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-500 transition-all"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
