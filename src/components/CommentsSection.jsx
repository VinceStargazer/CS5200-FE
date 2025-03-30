import mockComments from "../data/comments";
import { useState } from "react";

export default function CommentsSection({ problemId }) {
    const [isOpen, setIsOpen] = useState(false);
    const [comments, setComments] = useState(
        mockComments[problemId] ? [...mockComments[problemId]] : []
    );
    const [newComment, setNewComment] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const newEntry = {
            id: comments.length + 1,
            userId: 0,
            content: newComment.trim(),
            timestamp: new Date().toISOString().slice(0, 19).replace("T", " ")
        };

        setComments([...comments, newEntry]);
        setNewComment("");
    };

    return (
        <div className="mt-4 border rounded p-2 bg-white shadow">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-blue-800 font-normal"
            >
                {isOpen ? "▼ Hide Comments" : "▶ Show Comments"}
            </button>

            {isOpen && (
                <div className="mt-2">
                    <form onSubmit={handleSubmit} className="mb-2">
            <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full border rounded p-1 text-sm"
                rows={2}
                placeholder="Add a comment..."
            />
                        <button
                            type="submit"
                            className="mt-1 px-2 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                        >
                            Post
                        </button>
                    </form>

                    <ul className="text-sm space-y-1">
                        {comments.map((comment) => (
                            <li key={comment.id} className="border-t pt-1">
                                <div className="font-semibold text-gray-800">
                                    User {comment.userId}
                                </div>
                                <div>{comment.content}</div>
                                <div className="text-xs text-gray-500">
                                    {comment.timestamp}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
