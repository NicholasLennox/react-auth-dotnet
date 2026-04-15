# Full stack login (React + .NET)

I want to create a simple login system to demonstrate to my students. 

## Backend

A .NET API with controllers. 
A single AuthController with api/login, api/register (unprotected, dtos), and a test endpoint (api/me, protected)
An IAuthService with AuthService impl
EF for persistence of AppUser, configured in AppSettings
Sql Server in Docker (1433)
JWT Bearer Token generation, stored in JwtSettings in AppSettings


## Front end
React with Vite
3 pages: /login, /register, /home (protected route + redirect)
Register with username or email, use Identity to generate tokens and encrypt passwords
authService to wrap API calls
AuthContext to call authService and handle token storage (state + localStorage backup)
Bootstrap CDN for minimalistic styling

## Scaffolding

First ask clarifying quesitons
We start with just setting up the mono repo with two projects, Client + Server
Setup backend first, test register, login, protected me endpoint. With http file.
Then scaffold forms (forms are new for the class, so we go slow here)
Then wire up authService + AuthContext to useAuth in form submissions
Redirect with protected route

## Notes
Dont do it all at once, we will go step by step together, this is a live coding session
If you need clarifying questions, ask now
I may have tangent discussions to help the learning session