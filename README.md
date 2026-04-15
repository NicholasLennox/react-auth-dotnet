# React Authentication - Login & Register

This lesson we buildt a login and register flow in React, wired up to a .NET API. You have seen services and context before - here they work together as a complete auth system for the first time. Forms are also new territory: you have done a search form, but this goes further.

## What we built

A React + Vite client with three pages:

- `/register` - create an account
- `/login` - log in with email and password
- `/` - protected, only reachable with a valid token

The flow: register or log in → receive a JWT from the API → store it → use it to guard routes.

## Forms

### The problem with one `useState` per field

You could do this:

```jsx
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
```

And then write a separate `onChange` for each input. That works, but it doesn't scale. Five fields means five state variables and five handlers.

### One state object, one handler

Instead, we keep all field values in a single object:

```jsx
const [formData, setFormData] = useState({ email: '', password: '' })
```

And one `handleChange` updates whichever field triggered the event:

```jsx
const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value })
}
```

The key piece is `[e.target.name]` - computed property syntax. The input's `name` attribute tells us which field to update. Every input just needs `name`, `value`, and `onChange`:

```jsx
<input
  type="email"
  name="email"
  value={formData.email}
  onChange={handleChange}
/>
```

This is a controlled input. React owns the value - the input reflects state, not the other way around.

### Why this matters (vs vanilla JS)

In vanilla JS you would write a separate event listener per field and manually update the DOM. In React, `value={formData.email}` plus `onChange` handles both directions automatically. One handler, any number of fields.

### Validation and error feedback

Before calling the API, we validate in `handleSubmit`. If something is wrong, we set an error string and return early:

```jsx
const handleSubmit = async (e) => {
  e.preventDefault()
  setError('')

  if (!formData.email || !formData.password) {
    setError('Please fill in all fields')
    return
  }

  try {
    await login(formData)
    navigate('/')
  } catch (err) {
    setError('Invalid credentials')
  }
}
```

`e.preventDefault()` stops the browser from doing a full page reload. `handleSubmit` is `async` because the API call is async - without that, the `await` has nothing to wait on.

The error is displayed with a Bootstrap alert that only renders when there is something to show:

```jsx
{error && <div className="alert alert-danger">{error}</div>}
```



## authService

The service is responsible for one thing: talking to the API. It knows nothing about state, context, or the UI.

```js
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
```

If the response is not OK (4xx, 5xx), we throw. This is what the `catch` in `handleSubmit` catches - the error travels up from the service to the form, which decides how to show it.



## AuthContext

You have used Context to share state before. Here it wraps the entire auth lifecycle: calling the service, storing the token, and exposing `login`, `register`, and `logout` to the rest of the app.

```jsx
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null)

  const login = async (formData) => {
    const data = await authService.login(formData)
    setToken(data.token)
    localStorage.setItem('token', data.token)
  }

  const logout = () => {
    setToken(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
```

Token state is initialised from `localStorage` so a page refresh does not log the user out. On login, the token is saved to both state and `localStorage`. On logout, both are cleared.

`AuthProvider` wraps the whole app in `main.jsx`, which means every component in the tree can access auth state.

### useAuth

To consume the context, we have a dedicated hook:

```js
export function useAuth() {
  return useContext(AuthContext)
}
```

In any component that needs auth:

```jsx
const { login, logout, token } = useAuth()
```

This is the same pattern you have seen with context before - the hook is just a clean wrapper so you are not calling `useContext(AuthContext)` directly everywhere.



## The layer separation

It is worth being explicit about who does what:

- **authService** - HTTP calls only. No state, no UI.
- **AuthContext** - calls the service, owns the token, exposes actions.
- **useAuth** - gives components a clean way into the context.
- **Forms** - call `useAuth`, handle validation, show errors.

Each layer has one job. The form does not know how the token is stored. The service does not know the token exists.



## Protected Route

`ProtectedRoute` is a wrapper component that checks for a token before rendering its children:

```jsx
export default function ProtectedRoute({ children }) {
  const { token } = useAuth()

  if (!token) return <Navigate to="/login" />

  return children
}
```

In `App.jsx`, wrap any route you want to protect:

```jsx
<Route path="/" element={
  <ProtectedRoute>
    <Home />
  </ProtectedRoute>
} />
```

If there is no token, the user is redirected to `/login` before the page renders. When `logout` clears the token, the protected route reacts immediately and redirects - no manual navigation needed.



## The full flow

1. User fills in the register form and submits
2. `handleSubmit` validates, then calls `register` from `useAuth`
3. `AuthContext.register` calls `authService.register`
4. The API returns `{ token }`
5. Context stores the token in state and `localStorage`
6. `navigate('/')` runs in the form
7. `ProtectedRoute` sees the token and lets the user through
8. On logout, token is cleared, protected route redirects back to `/login`