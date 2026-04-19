"use client";
import { useState, useEffect } from "react";
import SplashScreen from "./screens/SplashScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import RoleSelectionScreen from "./screens/RoleSelectionScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import Dashboard from "./screens/Dashboard";
import ForgetPasswordScreen from "./screens/ForgetPasswordScreen";
import VerifyCodeScreen from "./screens/VerifyCodeScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";

export default function Home() {
  const [appState, setAppState] = useState("splash");
  const [resetEmail, setResetEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppState("welcome");
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => setAppState("roleSelection");
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setAppState("login");
  };
  const handleBackToWelcome = () => setAppState("welcome");
  const handleLogin = () => setAppState("dashboard");
  const handleSignup = () => setAppState("dashboard");
  const handleBackToLogin = () => setAppState("login");
  const handleBackToSignup = () => setAppState("signup");
  const handleForgotPassword = () => setAppState("forgetPassword");
  const handleForgetPasswordNext = (email) => {
    setResetEmail(email);
    setAppState("verifyCode");
  };
  const handleVerifyCode = (code) => {
    console.log("Verification code:", code);
    setAppState("resetPassword");
  };
  const handleResetPassword = (newPassword) => {
    console.log("New password set:", newPassword);
    setAppState("login");
  };
  const handleBackToLoginFromReset = () => setAppState("login");

  switch (appState) {
    case "splash":
      return <SplashScreen />;
    case "welcome":
      return <WelcomeScreen onContinue={handleContinue} />;
    case "roleSelection":
      return <RoleSelectionScreen onContinue={handleRoleSelect} onBack={handleBackToWelcome} />;
    case "login":
      return (
        <LoginScreen 
          onLogin={handleLogin} 
          onSignup={handleBackToSignup}
          onForgotPassword={handleForgotPassword}
          role={selectedRole}
        />
      );
    case "signup":
      return <SignupScreen onSignup={handleSignup} onLogin={handleBackToLogin} role={selectedRole} />;
    case "forgetPassword":
      return <ForgetPasswordScreen onBack={handleBackToLogin} onNext={handleForgetPasswordNext} />;
    case "verifyCode":
      return <VerifyCodeScreen email={resetEmail} onBack={() => setAppState("forgetPassword")} onVerify={handleVerifyCode} />;
    case "resetPassword":
      return <ResetPasswordScreen onReset={handleResetPassword} onBack={handleBackToLoginFromReset} />;
    case "dashboard":
      return <Dashboard role={selectedRole} />;
    default:
      return <SplashScreen />;
  }
}