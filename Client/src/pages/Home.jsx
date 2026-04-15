import { useAuth } from '../context/AuthContext'

export default function Home() {
    const { logout } = useAuth()

    return (
        <div className="container mt-5">
            <h1>Home</h1>
            <button className="btn btn-danger" onClick={logout}>Logout</button>
        </div>
    )
}