import { useState } from "react";

export default function HintDialog({ onClose, prompt }) {
    const [activeTab, setActiveTab] = useState("hints");
    const [hintStep, setHintStep] = useState(0);
    const [hintResponses, setHintResponses] = useState([]);
    const [questionStep, setQuestionStep] = useState(0);
    const [questionResponses, setQuestionResponses] = useState([]);
    const [questionInput, setQuestionInput] = useState("");

    const maxSteps = 3;

    const handleFetchHint = async () => {
        if (hintStep >= maxSteps) return;
        try {
            const res = await fetch("http://127.0.0.1:8000/api/llm/hint/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt })
            });
            const data = await res.json();
            setHintResponses((prev) => [...prev, data.hint]);
            setHintStep((prev) => prev + 1);
        } catch (err) {
            console.error("Hint request failed", err);
        }
    };

    const handleSendQuestion = async () => {
        if (questionStep >= maxSteps || !questionInput.trim()) return;
        try {
            const res = await fetch("http://127.0.0.1:8000/api/llm/hint/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: questionInput })
            });
            const data = await res.json();
            setQuestionResponses((prev) => [
                ...prev,
                `You: ${questionInput}\nAI: ${data.hint}`
            ]);
            setQuestionInput("");
            setQuestionStep((prev) => prev + 1);
        } catch (err) {
            console.error("Question request failed", err);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 w-96 bg-white border shadow-lg rounded-lg p-4 z-50">
            {/* Tabs */}
            <div className="flex border-b text-sm mb-2">
                <button
                    className={`flex-1 py-2 ${
                        activeTab === "hints"
                            ? "border-b-2 border-blue-500 font-semibold"
                            : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("hints")}
                >
                    Hints
                </button>
                <button
                    className={`flex-1 py-2 ${
                        activeTab === "questions"
                            ? "border-b-2 border-blue-500 font-semibold"
                            : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("questions")}
                >
                    Ask a Question
                </button>
            </div>

            {/* Tab Content */}
            <div className="h-40 overflow-y-auto mb-2 text-sm whitespace-pre-line">
                {activeTab === "hints" &&
                    hintResponses.map((hint, idx) => (
                        <p key={idx} className="mb-2">
                            {hint}
                        </p>
                    ))}

                {activeTab === "questions" &&
                    questionResponses.map((msg, idx) => (
                        <p key={idx} className="mb-2">{msg}</p>
                    ))}
            </div>

            {/* Tab Footer */}
            {activeTab === "hints" ? (
                <button
                    onClick={handleFetchHint}
                    disabled={hintStep >= maxSteps}
                    className="w-full bg-blue-500 text-white py-1 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {hintStep < maxSteps ? "Next Hint" : "No more hints"}
                </button>
            ) : (
                <div>
                    <textarea
                        value={questionInput}
                        onChange={(e) => setQuestionInput(e.target.value)}
                        rows={2}
                        className="w-full border rounded p-1 text-sm mb-1"
                        placeholder="Type your question..."
                    />
                    <button
                        onClick={handleSendQuestion}
                        disabled={questionStep >= maxSteps || !questionInput.trim()}
                        className="w-full bg-green-500 text-white py-1 rounded hover:bg-green-600 disabled:opacity-50"
                    >
                        {questionStep < maxSteps ? "Send" : "Limit Reached"}
                    </button>
                </div>
            )}

            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-400 hover:text-black"
            >
                &times;
            </button>
        </div>
    );
}
