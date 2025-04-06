import { useState } from 'react';

export default function AddProblemForm() {
    const [form, setForm] = useState({
        title: '',
        description: '',
        difficulty_level: 'Easy',
        tables: '',
        input_data: '',
        expected_output: '',
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let parsedForm = { ...form };
        try {
            parsedForm.tables = JSON.parse(form.tables || '[]');
            parsedForm.input_data = JSON.parse(form.input_data || '{}');
            parsedForm.expected_output = JSON.parse(form.expected_output || '[]');
        } catch (err) {
            alert('Please ensure tables/input_data/expected_output are valid JSON');
            return;
        }

        const res = await fetch('/api/problems', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(parsedForm),
        });

        if (res.ok) {
            alert('Problem added successfully!');
            setForm({
                id: '',
                title: '',
                description: '',
                topic: '',
                difficulty_level: 'Easy',
                tables: '',
                input_data: '',
                expected_output: '',
            });
        } else {
            alert('Failed to add problem.');
        }
    };

    return (
        <>
            <h2 className="text-xl font-bold mb-4">Add a Problem</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-2xl">
                <input
                    type="text"
                    name="id"
                    placeholder="ID"
                    value={form.id}
                    onChange={handleChange}
                    className="border p-2"
                    required
                />

                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={form.title}
                    onChange={handleChange}
                    className="border p-2"
                    required
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    className="border p-2"
                    rows={4}
                    required
                />

                <input
                    type="topic"
                    name="topic"
                    placeholder="Topic"
                    value={form.topic}
                    onChange={handleChange}
                    className="border p-2"
                    required
                />

                <select
                    name="difficulty_level"
                    value={form.difficulty_level}
                    onChange={handleChange}
                    className="border p-2"
                >
                    <option value="id">id</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>

                <textarea
                    name="tables"
                    placeholder='Tables JSON (e.g. [{"table_name":"Users","columns":[{"name":"id","type":"int"}]}])'
                    value={form.tables}
                    onChange={handleChange}
                    className="border p-2"
                    rows={4}
                />

                <textarea
                    name="input_data"
                    placeholder='Input Data JSON (e.g. {"Users":[["id","name"],[1,"Alice"]]})'
                    value={form.input_data}
                    onChange={handleChange}
                    className="border p-2"
                    rows={4}
                />

                <textarea
                    name="expected_output"
                    placeholder='Expected Output JSON (e.g. [["id","name"],[1,"Alice"]])'
                    value={form.expected_output}
                    onChange={handleChange}
                    className="border p-2"
                    rows={4}
                />

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-fit"
                >
                    Submit Problem
                </button>
            </form>
        </>
    );
}
