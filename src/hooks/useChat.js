import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function useChat() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const messagesEndRef = useRef(null);
    const streamingRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const streamResponse = (responseText) => {
        const words = responseText.split(' ');
        let i = 0;

        const stream = () => {
            if (i < words.length) {
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    const newContent = lastMessage.content + (i === 0 ? '' : ' ') + words[i];
                    return [
                        ...newMessages.slice(0, -1),
                        { ...lastMessage, content: newContent }
                    ];
                });
                i++;
                streamingRef.current = setTimeout(stream, 100);
            }
        };

        stream();
    };

    const handleSendMessage = async (input) => {
        if (!input.trim() && !image) return;

        const newMessages = [...messages, { role: "user", content: input, image }];
        setMessages(newMessages);
        setImage(null);
        setLoading(true);

        try {
            const response = await axios.post(
                process.env.REACT_APP_API_LINK, 
                {
                    model: "gpt-4o",
                    messages: newMessages,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "api-key": process.env.REACT_APP_API_KEY,  
                    },
                }
            );

            const responseContent = response.data.choices[0].message.content;
            setMessages(prev => [...prev, { role: "assistant", content: "" }]);
            streamResponse(responseContent);

        } catch (error) {
            console.error("Error:", error);
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "Sorry, I encountered an error. Please try again."
            }]);
        }
        setLoading(false);
    };

    useEffect(() => {
        return () => {
            if (streamingRef.current) {
                clearTimeout(streamingRef.current);
            }
        };
    }, []);

    return { messages, setMessages, loading, setLoading, image, setImage, messagesEndRef, handleSendMessage };
}

export default useChat;
