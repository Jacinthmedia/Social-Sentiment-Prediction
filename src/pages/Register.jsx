import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const { signup, user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const firstNameRef = useRef(null);

  useEffect(() => {
    console.log("🔍 Register component mounted - User state:", user);
    firstNameRef.current?.focus();
    
    if (user) {
      console.log("✅ User already logged in, redirecting to dashboard");
      startRedirectSequence();
    }
  }, [user, navigate]);

  const startRedirectSequence = () => {
    setRedirecting(true);
    
    setTimeout(() => {
      setSuccess("🎉 Registration successful! Redirecting...");
    }, 500);
    
    setTimeout(() => {
      const container = document.querySelector('[data-register-container]');
      if (container) {
        container.style.opacity = '0';
        container.style.transform = 'translateY(-20px) scale(0.95)';
      }
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 600);
    }, 2000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return false;
    }

    if (formData.firstName.length < 2) {
      setError("First name must be at least 2 characters");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (!formData.agreeToTerms) {
      setError("Please agree to the Terms and Privacy Policy");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📝 Register form submitted");
    
    setError("");
    setSuccess("");
    setRedirecting(false);
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const displayName = `${formData.firstName} ${formData.lastName}`;
      await signup(formData.email, formData.password, displayName);
      
      console.log("🎉 Registration successful");
      startRedirectSequence();
      
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false
      });
      
    } catch (err) {
      setSuccess("");
      setRedirecting(false);
      
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("Email already exists. Please sign in.");
          break;
        case "auth/invalid-email":
          setError("Invalid email address.");
          break;
        case "auth/weak-password":
          setError("Password is too weak.");
          break;
        case "auth/network-request-failed":
          setError("Network error. Check your connection.");
          break;
        default:
          setError(`Registration failed: ${err.message || "Please try again"}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      setLoading(true);
      
      await signInWithGoogle();
      startRedirectSequence();
      
    } catch (err) {
      switch (err.code) {
        case "auth/popup-closed-by-user":
          setError("Google sign up cancelled.");
          break;
        case "auth/popup-blocked":
          setError("Popup blocked. Please allow popups.");
          break;
        case "auth/email-already-in-use":
          setError("Email already exists. Please sign in.");
          break;
        default:
          setError(`Google sign up failed: ${err.message || "Please try again"}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: 0, label: "", color: "#e2e8f0" };
    if (password.length < 6) return { strength: 33, label: "Weak", color: "#fc8181" };
    if (password.length < 8) return { strength: 66, label: "Medium", color: "#f6ad55" };
    return { strength: 100, label: "Strong", color: "#48bb78" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div 
      style={styles.container}
      data-register-container
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
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>Join BlockDAG Analyzer</p>
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
              Sign up with Google
            </button>

            <div style={styles.divider}>
              <span style={styles.dividerText}>or</span>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.nameGrid}>
                <div style={styles.formGroup}>
                  <input
                    ref={firstNameRef}
                    name="firstName"
                    type="text"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      ...(loading && styles.inputDisabled),
                      ...(error && styles.inputError)
                    }}
                    disabled={loading}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <input
                    name="lastName"
                    type="text"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      ...(loading && styles.inputDisabled),
                      ...(error && styles.inputError)
                    }}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    ...styles.input,
                    ...(loading && styles.inputDisabled),
                    ...(error && styles.inputError)
                  }}
                  disabled={loading}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <div style={styles.passwordContainer}>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      ...(loading && styles.inputDisabled),
                      ...(error && styles.inputError)
                    }}
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.togglePassword}
                    disabled={loading}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {formData.password && (
                  <div style={styles.passwordStrength}>
                    <div style={styles.strengthBar}>
                      <div 
                        style={{
                          ...styles.strengthFill,
                          width: `${passwordStrength.strength}%`,
                          backgroundColor: passwordStrength.color
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div style={styles.formGroup}>
                <div style={styles.passwordContainer}>
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      ...(loading && styles.inputDisabled),
                      ...(error && styles.inputError),
                      ...(formData.confirmPassword && formData.password !== formData.confirmPassword && styles.inputError),
                      ...(formData.confirmPassword && formData.password === formData.confirmPassword && styles.inputSuccess)
                    }}
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.togglePassword}
                    disabled={loading}
                  >
                    {showConfirmPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <div style={styles.termsGroup}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    style={styles.checkbox}
                    disabled={loading}
                  />
                  <span style={styles.checkboxText}>
                    I agree to the <Link to="/terms" style={styles.termsLink}>Terms</Link> and <Link to="/privacy" style={styles.termsLink}>Privacy</Link>
                  </span>
                </label>
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
                    Creating Account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div style={styles.footer}>
              <p style={styles.loginText}>
                Already have an account?{" "}
                <Link to="/login" style={styles.link}>
                  Sign in
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;

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
  nameGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginBottom: "0",
  },
  formGroup: {
    marginBottom: "16px",
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
  inputSuccess: {
    borderColor: "#48bb78",
    backgroundColor: "#f0fff4",
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
  },
  passwordStrength: {
    marginTop: "6px",
  },
  strengthBar: {
    height: "3px",
    backgroundColor: "#e2e8f0",
    borderRadius: "2px",
    overflow: "hidden",
  },
  strengthFill: {
    height: "100%",
    borderRadius: "2px",
    transition: "all 0.3s ease",
  },
  termsGroup: {
    marginBottom: "20px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    cursor: "pointer",
    fontSize: "13px",
    color: "#4a5568",
    lineHeight: "1.3",
  },
  checkbox: {
    marginTop: "1px",
    transform: "scale(1.1)",
  },
  checkboxText: {
    lineHeight: "1.3",
  },
  termsLink: {
    color: "#667eea",
    textDecoration: "none",
    fontWeight: "500",
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
  },
  buttonLoading: {
    opacity: 0.7,
    cursor: "not-allowed",
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
  footer: {
    textAlign: "center",
    paddingTop: "20px",
    borderTop: "1px solid #e2e8f0",
  },
  loginText: {
    fontSize: "13px",
    color: "#718096",
    margin: 0,
  },
  link: {
    color: "#667eea",
    textDecoration: "none",
    fontWeight: "600",
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

[data-register-container] {
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
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.innerText = additionalStyles;
document.head.appendChild(styleSheet);