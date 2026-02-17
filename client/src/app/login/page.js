'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(true);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            router.push('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Generate 50 spans with inline computed transform & delay
    const spans = Array.from({ length: 50 }, (_, i) => {
        const rotation = i * (360 / 50);
        const delay = i * (3 / 50);
        return (
            <span
                key={i}
                className="ring-bar"
                style={{
                    transform: `scale(2.2) rotate(${rotation}deg)`,
                    animationDelay: `${delay}s`,
                }}
            />
        );
    });

    return (
        <div className={`login-container ${darkMode ? 'dark' : 'light'}`}>
            {/* Dark/Light mode toggle */}
            <button
                className="theme-toggle"
                onClick={() => setDarkMode(!darkMode)}
                aria-label="Toggle theme"
            >
                {darkMode ? '☀️' : '🌙'}
            </button>

            <div className="ring-wrapper">
                <div className="login-box">
                    <h2>Login</h2>

                    {error && (
                        <div className="login-error">
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="input-box">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label>Email</label>
                        </div>
                        <div className="input-box">
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <label>Password</label>
                        </div>
                        <div className="forgot-password">
                            <a href="#">Forgot Password?</a>
                        </div>
                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                        <div className="signup-link">
                            <Link href="/register">Signup</Link>
                        </div>
                    </form>
                </div>

                {spans}
            </div>

            <style jsx global>{`
                @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap");

                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
            `}</style>

            <style jsx>{`
                .login-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-family: "Poppins", sans-serif;
                    overflow: hidden;
                    transition: background 0.5s ease;
                }

                /* Dark mode (default) */
                .login-container.dark {
                    background: #0c0c0c;
                }

                /* Light mode */
                .login-container.light {
                    background: #f0f2f5;
                }

                /* Theme toggle button */
                .theme-toggle {
                    position: fixed;
                    top: 24px;
                    right: 24px;
                    z-index: 10;
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    border: 2px solid rgba(255, 107, 53, 0.3);
                    cursor: pointer;
                    font-size: 22px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }

                .dark .theme-toggle {
                    background: rgba(255, 255, 255, 0.05);
                }

                .light .theme-toggle {
                    background: rgba(0, 0, 0, 0.05);
                    border-color: rgba(255, 107, 53, 0.4);
                }

                .theme-toggle:hover {
                    transform: scale(1.1) rotate(20deg);
                    border-color: #FF6B35;
                    box-shadow: 0 0 20px rgba(255, 107, 53, 0.3);
                }

                .ring-wrapper {
                    position: relative;
                    width: 256px;
                    height: 256px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .ring-wrapper :global(.ring-bar) {
                    position: absolute;
                    left: 0;
                    width: 32px;
                    height: 6px;
                    border-radius: 8px;
                    transform-origin: 128px;
                    animation: animateBlink 3s linear infinite;
                    transition: background 0.5s ease;
                }

                .dark .ring-wrapper :global(.ring-bar) {
                    background: #2c4766;
                }

                .light .ring-wrapper :global(.ring-bar) {
                    background: #c8d0da;
                }

                @keyframes animateBlink {
                    0% {
                        background: #FF6B35;
                    }
                    25% {
                        background: inherit;
                    }
                }

                .login-box {
                    position: absolute;
                    width: 400px;
                    z-index: 1;
                }

                .login-box form {
                    width: 100%;
                    padding: 0 50px;
                }

                h2 {
                    font-size: 2em;
                    color: #FF6B35;
                    text-align: center;
                }

                .login-error {
                    text-align: center;
                    color: #ff4444;
                    font-size: 0.85em;
                    margin: 10px 50px;
                    padding: 8px 12px;
                    background: rgba(255, 68, 68, 0.1);
                    border: 1px solid rgba(255, 68, 68, 0.3);
                    border-radius: 8px;
                }

                .input-box {
                    position: relative;
                    margin: 25px 0;
                }

                .input-box input {
                    width: 100%;
                    height: 50px;
                    background: transparent;
                    outline: none;
                    border-radius: 40px;
                    font-size: 1em;
                    padding: 0 20px;
                    transition: 0.5s;
                    font-family: "Poppins", sans-serif;
                }

                .dark .input-box input {
                    border: 2px solid #2c4766;
                    color: #fff;
                }

                .light .input-box input {
                    border: 2px solid #bcc3ce;
                    color: #1a1a2e;
                }

                .input-box input:focus,
                .input-box input:valid {
                    border-color: #FF6B35;
                }

                .input-box label {
                    position: absolute;
                    top: 50%;
                    left: 20px;
                    transform: translateY(-50%);
                    font-size: 1em;
                    pointer-events: none;
                    transition: 0.5s ease;
                }

                .dark .input-box label {
                    color: #fff;
                }

                .light .input-box label {
                    color: #555;
                }

                .input-box input:focus ~ label,
                .input-box input:valid ~ label {
                    top: 1px;
                    font-size: 0.8em;
                    padding: 0 6px;
                    color: #FF6B35;
                }

                .dark .input-box input:focus ~ label,
                .dark .input-box input:valid ~ label {
                    background-color: #0c0c0c;
                }

                .light .input-box input:focus ~ label,
                .light .input-box input:valid ~ label {
                    background-color: #f0f2f5;
                }

                .forgot-password {
                    margin: -15px 0 10px;
                    text-align: center;
                }

                .forgot-password a {
                    font-size: 0.85em;
                    text-decoration: none;
                    transition: color 0.3s;
                }

                .dark .forgot-password a {
                    color: #fff;
                }

                .light .forgot-password a {
                    color: #555;
                }

                .forgot-password a:hover {
                    text-decoration: underline;
                    color: #FF6B35;
                }

                .login-btn {
                    width: 100%;
                    height: 45px;
                    border-radius: 45px;
                    background: #FF6B35;
                    border: none;
                    outline: none;
                    cursor: pointer;
                    font-size: 1em;
                    color: #fff;
                    font-weight: 600;
                    font-family: "Poppins", sans-serif;
                    transition: 0.3s;
                }

                .login-btn:hover {
                    background: #E85D26;
                    transform: scale(1.02);
                }

                .login-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                    transform: none;
                }

                .signup-link {
                    margin: 20px 0 10px;
                    text-align: center;
                }

                .signup-link :global(a) {
                    font-size: 1em;
                    color: #FF6B35;
                    text-decoration: none;
                    font-weight: 600;
                }

                .signup-link :global(a:hover) {
                    text-decoration: underline;
                }
            `}</style>
        </div>
    );
}
