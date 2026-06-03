import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

// Sourced direct image pathways from your local assets
import login1Mesh from '../assets/login1.png';
import login2Runner from '../assets/login2.jpg';

let API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
if (API_BASE_URL.endsWith('/')) {
  API_BASE_URL = API_BASE_URL.slice(0, -1);
}

export default function AuthView({ onLoginSuccess }) {
  const [authState, setAuthState] = useState('EMAIL'); // 'EMAIL' | 'OTP'
  const [inputValue, setInputValue] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState('');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const trimmedInput = inputValue.trim();

    if (!trimmedInput) {
      setErrorMsg('Please enter your email.');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedInput)) {
      setErrorMsg('Please enter a valid email format (e.g., name@domain.com).');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedInput }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setErrorMsg('');
        setAuthState('OTP');
      } else {
        setErrorMsg(data.message || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to connect to the server. Please ensure the backend is running.');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 6) {
      setErrorMsg('Please enter a valid 6-digit OTP');
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inputValue.trim(), otp: otpValue }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setErrorMsg('');
        onLoginSuccess(inputValue.trim());
      } else {
        setErrorMsg(data.message || 'Invalid OTP. Please check and try again.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to connect to the server. Please ensure the backend is running.');
    }
  };

  const handleResendOtp = async () => {
    const trimmedInput = inputValue.trim();
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedInput }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setErrorMsg('');
        alert('OTP has been resent successfully to your email.');
      } else {
        setErrorMsg(data.message || 'Failed to resend OTP. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to connect to the server. Please ensure the backend is running.');
    }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const nextOtp = [...otp];
    nextOtp[index] = element.value;
    setOtp(nextOtp);

    // Auto-focus next input field optimization
    if (element.value && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] overflow-hidden flex-row">
      
      {/* 1. LEFT SIDE: Visual Container with Your Custom High-Contrast Gradient and Mesh */}
      <div className="hidden lg:flex w-1/2 h-full p-6 items-center justify-center bg-[#F8FAFC]">
        <div className="w-full h-full max-w-[640px] rounded-3xl relative overflow-hidden flex items-center justify-center border border-gray-100 bg-white">
          
          {/* LAYER A: Your custom precise high-contrast background gradient */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(135deg, #010512 0%, #3007ff 45%, #ff4800 100%)'
            }}
          />

          {/* LAYER B: The Mesh Image loaded cleanly over your dark gradient with opacity */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(${login1Mesh})`,
              opacity: 0.85 
            }}
          />
          
          {/* Top-Left Brand Placement */}
          <div className="absolute top-8 left-8 flex items-center gap-1.5 z-20">
            <span className="text-xl font-bold tracking-tight text-white">Productr</span>
            <div className="flex gap-0.5 items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-400 opacity-90 shadow-xs"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-orange-600 -ml-1.5 shadow-xs"></span>
            </div>
          </div>

          {/* Centered Floating 3D Rounded Image Card */}
          <div className="w-[300px] h-[400px] rounded-[32px] shadow-2xl relative overflow-hidden flex flex-col justify-end p-6 border border-white/30 transform transition-transform duration-300 hover:scale-102 bg-neutral-950 z-10">
            <img 
              src={login2Runner} 
              alt="Uplist Product Showcase" 
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
            
            <div className="text-center space-y-1 z-20 text-white pb-2 drop-shadow-md">
              <p className="text-base font-semibold tracking-wide leading-tight">Uplist your</p>
              <p className="text-base font-semibold tracking-wide leading-tight">product to market</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. RIGHT SIDE: Dedicated Multi-State Authentication Form Processing Panel */}
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-between p-8 lg:p-20 bg-white">
        <div className="hidden lg:block h-8"></div>

        <div className="w-full max-w-[380px] mx-auto space-y-6">
          
          {/* VIEW A: Render Email Input Layout Form Panel */}
          {authState === 'EMAIL' && (
            <>
              {errorMsg && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium border border-red-100 animate-in fade-in duration-200">
                  <AlertCircle size={16} className="shrink-0" /> 
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleEmailSubmit} className="space-y-5">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold tracking-tight text-[#0B1953]">Login to your Productr Account</h2>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-700">Email or Phone number</label>
                  <input
                    type="text"
                    placeholder="Enter email or phone number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-hidden focus:border-[#0F1A80] focus:ring-1 focus:ring-[#0F1A80] transition-all"
                  />
                </div>

                <button type="submit" className="w-full bg-[#0F1A80] hover:bg-[#0A1260] text-white font-medium py-2.5 rounded-lg text-sm transition-colors cursor-pointer tracking-wide shadow-xs">
                  Login
                </button>
              </form>
            </>
          )}

          {/* VIEW B: Render Separated 6-Digit Verification OTP Form Panel */}
          {authState === 'OTP' && (
            <form onSubmit={handleOtpSubmit} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight text-[#0B1953]">Login to your Productr Account</h2>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-600">Enter OTP</label>
                
                {/* 6-Field Matrix Grid Layout Container */}
                <div className="flex gap-2 justify-between">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      type="text"
                      maxLength="1"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      data-lpignore="true" 
                      name={`otp-${idx}`}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target, idx)}
                      onKeyDown={(e) => handleKeyDown(e, idx)}
                      className={`w-12 h-11 text-center text-base font-medium border rounded-lg focus:outline-hidden focus:border-[#0F1A80] focus:ring-1 focus:ring-[#0F1A80] transition-colors ${
                        errorMsg ? 'border-red-500 bg-red-50/10 text-red-600' : 'border-gray-200 bg-white text-gray-900'
                      }`}
                    />
                  ))}
                </div>

                {/* Inline Red Error Message Component placed right underneath inputs */}
                {errorMsg && (
                  <p className="text-xs font-medium text-red-500 pt-1 animate-in fade-in duration-200">
                    {errorMsg}
                  </p>
                )}
              </div>

              <button type="submit" className="w-full bg-[#0F1A80] hover:bg-[#0A1260] text-white font-medium py-2.5 rounded-lg text-sm transition-colors cursor-pointer tracking-wide shadow-xs">
                Enter your OTP
              </button>

              {/* Action Links Context Footer Wrapper */}
              <div className="text-center pt-1">
                <p className="text-xs text-gray-500">
                  Didn't receive OTP? <span onClick={handleResendOtp} className="text-[#0F1A80] font-bold cursor-pointer hover:underline ml-1">Resend</span>
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Footer Link Box */}
        <div className="w-full max-w-[380px] mx-auto border border-gray-200/60 bg-gray-50/40 p-4 rounded-xl text-center text-xs text-gray-500 shadow-2xs">
          Don't have a Productr Account? <span className="text-[#0F1A80] font-semibold cursor-pointer hover:underline">SignUp Here</span>
        </div>
      </div>

    </div>
  );
}