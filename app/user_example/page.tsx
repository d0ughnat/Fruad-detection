"use client"
import {useState, useEffect} from 'react'

interface User {
  id: string;
  // Add other user properties here based on your database schema
  email?: string;
  name?: string;
  // ... other fields
}

export default function UserExample() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/user');
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data = await response.json();
                setUsers(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) return <div>Loading users...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">User List</h1>
            {users.length === 0 ? (
                <p>No users found</p>
            ) : (
                <ul className="space-y-2">
                    {users.map((user) => (
                        <li key={user.id} className="p-2 border rounded">
                            <p>ID: {user.id}</p>
                            {user.email && <p>Email: {user.email}</p>}
                            {user.name && <p>Name: {user.name}</p>}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}