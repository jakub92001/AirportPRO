import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { ContractOption, ActiveContract, ContractType } from '../types';
import Modal from './Modal';
import Icon from './Icon';

const API_KEY = process.env.API_KEY;
let ai: GoogleGenAI | null = null;
if (API_KEY) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
}

interface NegotiationModalProps {
    contract: ContractOption | null;
    isOpen: boolean;
    onClose: () => void;
    onSign: (negotiatedContract: ActiveContract) => void;
    currentTime: number;
}

interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

const getSystemInstruction = (contract: ContractOption): string => {
    if (contract.type === ContractType.FuelSupplier) {
        const minPrice = (contract.basePricePerLiter ?? 2.0) * 0.85;
        // Simplified DEAL format to only include what's being negotiated
        return `You are a tough but fair contract negotiator for the fuel supplier behind the "${contract.name}".
The user wants to sign an exclusive fuel supply contract with you. Your goal is to keep the deal as close to the original terms as possible, but you are authorized to make some concessions to close the deal.

Original contract terms:
- Price per Liter: $${(contract.basePricePerLiter ?? 2.0).toFixed(2)}
- Duration: ${contract.durationDays} days

Your negotiation limits:
- You can offer a discount on the price per liter, but no lower than $${minPrice.toFixed(2)}.
- You can offer to extend the duration, but by no more than 50% of the original duration.

When you make a final, acceptable offer, you MUST include a special line in your response with the exact format:
DEAL:{"pricePerLiter": <new_price_number>, "durationDays": <new_duration_days_number>}

Do not include the DEAL line until you are making a concrete, final offer. Start the conversation by greeting the user and stating the initial offer based on the original terms.`;
    }

    // Default for Airline, Transport, etc.
    return `You are a tough but fair contract negotiator for ${contract.name}.
The user wants to sign a contract with you. Your goal is to keep the deal as close to the original terms as possible, but you are authorized to make some concessions to close the deal.

Original contract terms:
- Cost: $${contract.cost.toLocaleString()}
- Duration: ${contract.durationDays} days

Your negotiation limits:
- You can offer a discount on the cost, but no more than 20% off the original price.
- You can offer to extend the duration, but by no more than 50% of the original duration.
- You cannot change both at the same time in the user's favor. For example, you can't lower the cost AND increase the duration.

Respond professionally. Keep your responses concise and in character.

When you make a final offer that the user can accept, you MUST include a special line in your response with the exact format:
DEAL:{"cost": <new_cost_number>, "durationDays": <new_duration_days_number>}

Do not include the DEAL line until you are making a concrete, final offer. Start the conversation by greeting the user and stating the initial offer based on the original terms.`;
};


const NegotiationModal: React.FC<NegotiationModalProps> = ({ contract, isOpen, onClose, onSign, currentTime }) => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [negotiatedOffer, setNegotiatedOffer] = useState<Partial<ActiveContract> | null>(null);
    const [isApiError, setIsApiError] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && !API_KEY) {
            setIsApiError(true);
            return;
        }

        if (contract && isOpen && ai) {
            setIsApiError(false);
            const systemInstruction = getSystemInstruction(contract);
            
            const newChat = ai.chats.create({
                model: 'gemini-2.5-flash-preview-04-17',
                config: { systemInstruction },
            });
            setChat(newChat);
            setMessages([]);
            setNegotiatedOffer(null);
            setIsLoading(true);

            newChat.sendMessage({ message: "Hello." }).then((response: GenerateContentResponse) => {
                setMessages([{ role: 'model', text: response.text }]);
                setIsLoading(false);
            }).catch((error: any) => {
                console.error("Error starting negotiation:", error);
                const errorString = JSON.stringify(error);
                const isRateLimitError = errorString.includes('429') || errorString.includes('RESOURCE_EXHAUSTED');
                if (isRateLimitError) {
                    setMessages([{role: 'model', text: 'Sorry, the negotiator is currently unavailable due to high demand. Please close this window and try again shortly.'}]);
                } else {
                    setMessages([{role: 'model', text: 'Sorry, the negotiator is unavailable right now due to a connection issue.'}]);
                }
                setIsLoading(false);
            });
        }
    }, [contract, isOpen]);
    
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);


    const handleSendMessage = async () => {
        if (!userInput.trim() || !chat || isLoading) return;

        const newUserMessage: ChatMessage = { role: 'user', text: userInput };
        setMessages(prev => [...prev, newUserMessage]);
        setUserInput('');
        setIsLoading(true);
        setNegotiatedOffer(null);

        try {
            const responseStream = await chat.sendMessageStream({ message: userInput });
            let fullResponse = '';
            
            setMessages(prev => [...prev, { role: 'model', text: '' }]);

            for await (const chunk of responseStream) {
                fullResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage) {
                        lastMessage.text = fullResponse;
                    }
                    return newMessages;
                });
            }
            
            const dealRegex = /DEAL:({.*})/;
            const match = fullResponse.match(dealRegex);
            if (match && match[1]) {
                try {
                    const parsedOffer: Partial<ActiveContract> = JSON.parse(match[1]);
                    setNegotiatedOffer(parsedOffer);
                } catch (e) {
                    console.error("Failed to parse negotiated offer:", e);
                }
            }
        } catch (error: any) {
            console.error("Error during negotiation chat:", error);
            const errorString = JSON.stringify(error);
            const isRateLimitError = errorString.includes('429') || errorString.includes('RESOURCE_EXHAUSTED');
            if (isRateLimitError) {
                setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, our lines are very busy right now. The negotiator is unavailable. Please try again in a few minutes." }]);
            } else {
                setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I'm having trouble connecting right now. Please check your connection or try again later." }]);
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleAcceptOffer = () => {
        if (!negotiatedOffer || !contract) return;
        
        const negotiatedDuration = negotiatedOffer.durationDays ?? contract.durationDays;
        const expiryTime = currentTime + negotiatedDuration * 24 * 60 * 60 * 1000;
        
        const completeContract: ActiveContract = {
            ...contract,
            ...negotiatedOffer,
            expiryTime,
            satisfaction: 100,
            renewalOffered: false,
        };
        
        onSign(completeContract);
        onClose();
    };


    if (!isOpen || !contract) return null;

    if (isApiError) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} title="Negotiation Unavailable">
                <div className="text-center p-4">
                    <Icon name="warning" className="w-12 h-12 text-brand-red mx-auto mb-4" />
                    <h3 className="text-lg font-bold mb-2">Feature Not Configured</h3>
                    <p className="text-sm text-base-content-secondary">
                        The live negotiation feature requires an API key to connect to the AI service.
                        This has not been configured in this environment.
                    </p>
                    <button onClick={onClose} className="mt-4 bg-brand-blue text-white font-bold py-2 px-4 rounded hover:bg-blue-600">
                        Close
                    </button>
                </div>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Negotiating with ${contract.name}`}>
            <div className="flex flex-col h-[60vh] max-h-[500px]">
                <div className="flex-grow overflow-y-auto bg-base-300 p-4 rounded-md mb-4">
                    <div className="space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-brand-blue text-white' : 'bg-base-100 text-base-content'}`}>
                                    <p className="whitespace-pre-wrap">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                         {isLoading && messages[messages.length-1]?.role === 'user' && (
                            <div className="flex justify-start">
                                <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-base-100 text-base-content">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-base-content-secondary rounded-full animate-pulse"></div>
                                        <div className="w-2 h-2 bg-base-content-secondary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-base-content-secondary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                         )}
                         <div ref={chatEndRef} />
                    </div>
                </div>
                {negotiatedOffer && (
                    <div className="mb-4 p-3 bg-brand-green/20 border border-brand-green rounded-lg text-center">
                        <p className="font-bold text-base-content mb-2">New Offer Received!</p>
                        {contract.type === ContractType.FuelSupplier ? (
                             <p>Price: ${(negotiatedOffer.pricePerLiter ?? contract.basePricePerLiter)?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}/L, Duration: {negotiatedOffer.durationDays ?? contract.durationDays} days</p>
                        ) : (
                             <p>Cost: ${(negotiatedOffer.cost ?? contract.cost).toLocaleString()}, Duration: {negotiatedOffer.durationDays ?? contract.durationDays} days</p>
                        )}
                        <button onClick={handleAcceptOffer} className="mt-2 bg-brand-green text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition-colors">
                            Accept Offer & Sign Contract
                        </button>
                    </div>
                )}
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your message..."
                        disabled={isLoading}
                        className="flex-grow bg-base-100 border border-base-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                    <button onClick={handleSendMessage} disabled={isLoading || !userInput.trim()} className="bg-brand-blue text-white font-bold px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-base-300 disabled:cursor-not-allowed">
                        Send
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default NegotiationModal;