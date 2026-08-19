import { useState } from 'react';
import { askLoopService } from '../services/askLoopService';

const INITIAL_MESSAGES = [
    {
        id: 1,
        role: "ai",
        content: "Hi! I'm LOOP, your AI product assistant. I've analyzed all recent feedback items. Ask me anything about feature requests, bugs, or user sentiment!",
    },
];

export const useAskLoop = () => {
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim()) return;

        const currentQuestion = input.trim();
        const userMessage = { id: Date.now(), role: "user", content: currentQuestion };
        
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        try {
            const data = await askLoopService.askQuestion(currentQuestion);
            const aiResponse = {
                id: Date.now() + 1,
                role: "ai",
                content: data.answer || "Sorry, I received an empty response. Please try asking again.",
            };
            setMessages((prev) => [...prev, aiResponse]);
        } catch (error) {
            console.error("Error asking LOOP:", error);
            const errorResponse = {
                id: Date.now() + 1,
                role: "ai",
                content: "I'm having trouble connecting to my brain right now. Please check if the backend is running and try again.",
            };
            setMessages((prev) => [...prev, errorResponse]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSuggest = (question) => {
        setInput(question);
    };

    return {
        messages,
        input,
        setInput,
        isTyping,
        handleSend,
        handleSuggest
    };
};
