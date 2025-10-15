import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const { login, user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const emailRef = useRef(null);

  useEffect(() => {
    console.log("🔍 Login component mounted - User state:", user);
    emailRef.current?.focus();
    
    if (user) {
      console.log("✅ User already logged in, redirecting to dashboard");
      startRedirectSequence();
    }
  }, [user, navigate]);

  const startRedirectSequence = () => {
    setRedirecting(true);
    
    setTimeout(() => {
      setSuccess("🎉 Login successful! Preparing your dashboard...");
    }, 500);
    
    setTimeout(() => {
      const container = document.querySelector('[data-login-container]');
      if (container) {
        container.style.opacity = '0';
        container.style.transform = 'translateY(-20px) scale(0.95)';
        container.style.transition = 'all 0.6s ease';
      }
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 600);
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📝 Login form submitted");
    
    setError("");
    setSuccess("");
    setRedirecting(false);
    
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      console.log("🔐 Attempting login with:", { 
        email: email, 
        passwordLength: password.length 
      });
      
      await login(email, password);
      
      console.log("🎉 Login successful in handleSubmit");
      startRedirectSequence();
      setEmail("");
      setPassword("");
      
    } catch (err) {
      console.error("❌ Login error details:", {
        code: err.code,
        message: err.message,
        timestamp: new Date().toISOString()
      });
      
      setSuccess("");
      setRedirecting(false);
      
      switch (err.code) {
        case "auth/user-not-found":
          setError("No account found with this email. Please sign up first.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password. Please try again.");
          break;
        case "auth/invalid-email":
          setError("Invalid email address format.");
          break;
        case "auth/invalid-credential":
          setError("Invalid email or password combination.");
          break;
        case "auth/too-many-requests":
          setError("Too many failed attempts. Please try again later or reset your password.");
          break;
        case "auth/network-request-failed":
          setError("Network error. Please check your internet connection.");
          break;
        case "auth/user-disabled":
          setError("This account has been disabled. Please contact support.");
          break;
        default:
          setError(`Login failed: ${err.message || "Please try again"}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      setLoading(true);
      
      console.log("🔐 Attempting Google sign in");
      await signInWithGoogle();
      console.log("🎉 Google sign in successful");
      startRedirectSequence();
      
    } catch (err) {
      console.error("❌ Google sign in error:", err);
      
      switch (err.code) {
        case "auth/popup-closed-by-user":
          setError("Google sign in was cancelled.");
          break;
        case "auth/popup-blocked":
          setError("Popup was blocked by your browser. Please allow popups for this site.");
          break;
        case "auth/network-request-failed":
          setError("Network error. Please check your internet connection.");
          break;
        default:
          setError(`Google sign in failed: ${err.message || "Please try again"}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const fillTestCredentials = () => {
    setEmail("test01@example.com");
    setPassword("test123456");
    console.log("🧪 Test credentials filled");
  };

  return (
    <div 
      style={styles.container}
      data-login-container
      className={redirecting ? 'redirecting' : ''}
    >
      <div style={{
        ...styles.card,
        ...(redirecting && styles.cardRedirecting)
      }}>
        {redirecting && (
          <div style={styles.redirectOverlay}>
            <div style={styles.redirectSpinner}></div>
          </div>
        )}

        <div style={styles.header}>
          <h2 style={styles.title}>Welcome Back 👋</h2>
          <p style={styles.subtitle}>Sign in to your BlockDAG Analyzer account</p>
        </div>

        {success && (
          <div style={styles.success}>
            <div style={styles.successHeader}>
              <span style={styles.successIcon}>✅</span>
              <span style={styles.successText}>{success}</span>
            </div>
            {redirecting && (
              <div style={styles.progressBar}>
                <div 
                  style={styles.progressFill}
                  className="progress-animation"
                ></div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div style={styles.error}>
            <span style={styles.errorIcon}>⚠️</span>
            <span style={styles.errorText}>{error}</span>
          </div>
        )}

        {!redirecting && (
          <>
            <button 
              onClick={handleGoogleSignIn}
              style={{
                ...styles.googleButton,
                ...(loading && styles.buttonDisabled)
              }}
              disabled={loading}
              type="button"
            >
              <img 
                src="https://developers.google.com/identity/images/g-logo.png" 
                alt="Google" 
                style={styles.googleIcon}
              />
              Continue with Google
            </button>

            <div style={styles.divider}>
              <span style={styles.dividerText}>or</span>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label htmlFor="email" style={styles.label}>
                  Email Address
                </label>
                <input
                  ref={emailRef}
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    ...styles.input,
                    ...(loading && styles.inputDisabled),
                    ...(error && styles.inputError)
                  }}
                  disabled={loading}
                  required
                  autoComplete="email"
                />
              </div>

              <div style={styles.formGroup}>
                <div style={styles.passwordHeader}>
                  <label htmlFor="password" style={styles.label}>
                    Password
                  </label>
                  <Link to="/forgot-password" style={styles.forgotLink}>
                    Forgot password?
                  </Link>
                </div>
                <div style={styles.passwordContainer}>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      ...styles.input,
                      ...(loading && styles.inputDisabled),
                      ...(error && styles.inputError)
                    }}
                    disabled={loading}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.togglePassword}
                    disabled={loading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                style={{
                  ...styles.button,
                  ...(loading && styles.buttonLoading)
                }} 
                disabled={loading}
              >
                {loading ? (
                  <div style={styles.loadingContent}>
                    <div style={styles.spinner}></div>
                    Signing In...
                  </div>
                ) : (
                  "Sign In with Email"
                )}
              </button>
            </form>

            <div style={styles.testSection}>
              <button 
                type="button" 
                onClick={fillTestCredentials}
                style={styles.testButton}
                disabled={loading}
              >
                🧪 Fill Test Credentials
              </button>
            </div>

            <div style={styles.footer}>
              <p style={styles.signupText}>New to BlockDAG Analyzer?</p>
                Don't have an account?{" "}
                <Link to="/register" style={styles.link}>
                  Create an account
                </Link>
               <p style={styles.signupSubtext}>Get started with powerful analytics tools</p>
            </div>
                    {/* Security Note */}
        <div style={styles.securityNote}>
          <span style={styles.securityIcon}>🔒</span>
          Your data is securely encrypted and protected
        </div>
       </>
                   )}


        

        {!redirecting && (
          <div style={styles.debugPanel}>
            <details style={styles.debugDetails}>
              <summary style={styles.debugSummary}>Debug Info</summary>
              <div style={styles.debugContent}>
                <p><strong>User State:</strong> {user ? "Logged In" : "Not Logged In"}</p>
                <p><strong>Loading:</strong> {loading ? "Yes" : "No"}</p>
                <p><strong>Success:</strong> {success ? "Yes" : "No"}</p>
                <p><strong>Redirecting:</strong> {redirecting ? "Yes" : "No"}</p>
                <p><strong>Email:</strong> {email || "Not set"}</p>
                <p><strong>Password Length:</strong> {password.length} characters</p>
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};


export default Login;

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    padding: "16px",
    transition: 'all 0.6s ease',
  },
  card: {
    background: "white",
    padding: "24px",
    borderRadius: "20px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
    position: "relative",
    transition: 'all 0.6s ease',
    overflow: 'hidden',
  },
  cardRedirecting: {
    transform: 'scale(0.98)',
    filter: 'blur(2px)',
  },
  redirectOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    borderRadius: '20px',
  },
  redirectSpinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #f3f3f3',
    borderTop: '3px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  header: {
    textAlign: "center",
    marginBottom: "24px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "4px",
    color: "#1a202c",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  subtitle: {
    fontSize: "14px",
    color: "#718096",
    lineHeight: "1.4",
  },
  googleButton: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "2px solid #e2e8f0",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    cursor: "pointer",
    background: "white",
    transition: "all 0.3s ease",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  googleIcon: {
    width: "18px",
    height: "18px",
  },
  divider: {
    position: "relative",
    textAlign: "center",
    marginBottom: "20px",
  },
  dividerText: {
    background: "white",
    padding: "0 12px",
    color: "#718096",
    fontSize: "13px",
    position: "relative",
    zIndex: 2,
  },
  form: {
    marginBottom: "20px",
  },
  formGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#2d3748",
  },
  passwordHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "6px",
  },
  forgotLink: {
    fontSize: "13px",
    color: "#667eea",
    textDecoration: "none",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "2px solid #e2e8f0",
    fontSize: "14px",
    transition: "all 0.2s ease",
    boxSizing: "border-box",
  },
  inputDisabled: {
    backgroundColor: "#f7fafc",
    cursor: "not-allowed",
    opacity: 0.7,
  },
  inputError: {
    borderColor: "#fc8181",
    backgroundColor: "#fff5f5",
  },
  passwordContainer: {
    position: "relative",
  },
  togglePassword: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "none",
    cursor: "pointer",
    fontSize: "16px",
    padding: "6px",
    borderRadius: "6px",
    transition: "background-color 0.2s ease",
  },
    signupSubtext: {
    fontSize: '13px',
    color: '#a0aec0',
    margin: '0',
    fontStyle: 'italic',
  },
  securityNote: {
    textAlign: 'center',
    fontSize: '12px',
    color: '#a0aec0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #f7fafc',
  },
  securityIcon: {
    fontSize: '12px',
  },
  button: {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    fontSize: "14px",
    fontWeight: "600",
    color: "white",
    cursor: "pointer",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    transition: "all 0.3s ease",
    marginTop: "8px",
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
    transform: "none",
  },
  buttonLoading: {
    opacity: 0.7,
    cursor: "not-allowed",
    transform: "none",
  },
  loadingContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  spinner: {
    width: "14px",
    height: "14px",
    border: "2px solid transparent",
    borderTop: "2px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  success: {
    background: "#c6f6d5",
    color: "#22543d",
    padding: "16px",
    borderRadius: "10px",
    marginBottom: "20px",
    border: "1px solid #9ae6b4",
  },
  successHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
  },
  successIcon: {
    fontSize: "18px",
  },
  successText: {
    flex: 1,
    fontSize: "13px",
    fontWeight: "500",
  },
  progressBar: {
    width: "100%",
    height: "3px",
    backgroundColor: "#9ae6b4",
    borderRadius: "2px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#38a169",
    width: "0%",
  },
  error: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#fed7d7",
    color: "#c53030",
    padding: "14px",
    borderRadius: "10px",
    marginBottom: "20px",
    border: "1px solid #feb2b2",
  },
  errorIcon: {
    fontSize: "16px",
  },
  errorText: {
    flex: 1,
    fontSize: "13px",
    fontWeight: "500",
  },
  testSection: {
    marginBottom: "20px",
    textAlign: "center",
  },
  testButton: {
    background: "none",
    border: "1px dashed #cbd5e0",
    color: "#718096",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12px",
    transition: "all 0.2s ease",
  },
  footer: {
    textAlign: "center",
    paddingTop: "20px",
    borderTop: "1px solid #e2e8f0",
  },
  signupText: {
    fontSize: "13px",
    color: "#718096",
    margin: 0,
  },
  link: {
    color: "#667eea",
    textDecoration: "none",
    fontWeight: "600",
  },
  debugPanel: {
    marginTop: "20px",
    paddingTop: "16px",
    borderTop: "1px dashed #e2e8f0",
  },
  debugDetails: {
    fontSize: "12px",
    color: "#718096",
  },
  debugSummary: {
    cursor: "pointer",
    padding: "8px",
    borderRadius: "6px",
    transition: "background-color 0.2s ease",
  },
  debugContent: {
    marginTop: "8px",
    padding: "12px",
    background: "#f7fafc",
    borderRadius: "8px",
    fontSize: "11px",
    lineHeight: "1.6",
  },

};

// Add CSS animations
const additionalStyles = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes progressFill {
  0% { width: 0%; }
  100% { width: 100%; }
}

.redirecting {
  opacity: 0.9;
  transform: translateY(-10px);
}

.progress-animation {
  animation: progressFill 2s ease-in-out forwards;
}

[data-login-container] {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.google-button:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #cbd5e0;
  transform: translateY(-1px);
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e2e8f0;
  z-index: 1;
}

/* Mobile-specific optimizations */
@media (max-width: 480px) {
  .container {
    padding: 12px;
    align-items: flex-start;
    padding-top: 40px;
  }
  
  .card {
    padding: 20px;
    border-radius: 16px;
  }
  
  .title {
    font-size: 22px;
  }
  
  .subtitle {
    font-size: 13px;
  }
  
  .googleButton,
  .button {
    padding: 12px;
    font-size: 13px;
  }
  
  .input {
    padding: 10px 12px;
    font-size: 13px;
  }
  
  .testButton {
    font-size: 11px;
    padding: 6px 12px;
  }
  
  .debugPanel {
    display: none; /* Hide debug on very small screens */
  }
}

@media (max-width: 320px) {
  .container {
    padding: 8px;
    padding-top: 30px;
  }
  
  .card {
    padding: 16px;
  }
  
  .title {
    font-size: 20px;
  }
  
  .passwordHeader {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .forgotLink {
    align-self: flex-end;
  }
}

/* Touch device optimizations */
@media (hover: none) and (pointer: coarse) {
  .googleButton:active,
  .button:active {
    transform: scale(0.98);
  }
  
  .togglePassword:active {
    background-color: #f1f5f9;
  }
}
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.innerText = additionalStyles;
document.head.appendChild(styleSheet);
