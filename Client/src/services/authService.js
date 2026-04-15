const BASE_URL = 'http://localhost:5233/api'

const register = async (formData) => {
    const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })

    if (!response.ok) throw new Error('Registration failed')

    return response.json()
}

const login = async (formData) => {
    const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })

    if (!response.ok) throw new Error('Login failed')

    return response.json()
}

export default { register, login }