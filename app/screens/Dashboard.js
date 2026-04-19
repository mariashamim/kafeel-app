"use client";
import { useState } from "react";

export default function Dashboard({ role }) {
  const [activeTab, setActiveTab] = useState("home");

  // Get role-specific title
  const getRoleTitle = () => {
    switch(role) {
      case "elderly": return "Patient Dashboard";
      case "caregiver": return "Caregiver Dashboard";
      case "volunteer": return "Volunteer Dashboard";
      case "donor": return "Donor Dashboard";
      case "admin": return "Admin Dashboard";
      default: return "Dashboard";
    }
  };

  // Get role-specific greeting
  const getRoleGreeting = () => {
    switch(role) {
      case "elderly": return "Take care of your health today";
      case "caregiver": return "You have 3 patients to attend today";
      case "volunteer": return "Thank you for your service";
      case "donor": return "Your generosity saves lives";
      case "admin": return "Manage the platform";
      default: return "Welcome to Kafeel";
    }
  };

  // Role-specific stats
  const getStats = () => {
    switch(role) {
      case "elderly":
        return [
          { label: "💊 Medications", value: "2 pending", color: "text-orange-500" },
          { label: "❤️ Vitals", value: "Normal", color: "text-green-600" },
          { label: "📅 Appointments", value: "1 today", color: "text-blue-600" },
        ];
      case "caregiver":
        return [
          { label: "👴 Patients", value: "3 active", color: "text-blue-600" },
          { label: "⏰ Tasks", value: "5 today", color: "text-orange-500" },
          { label: "✅ Completed", value: "12 this week", color: "text-green-600" },
        ];
      case "volunteer":
        return [
          { label: "🤝 Hours", value: "24 hrs", color: "text-green-600" },
          { label: "👥 Helped", value: "8 people", color: "text-blue-600" },
          { label: "⭐ Rating", value: "4.9", color: "text-yellow-600" },
        ];
      case "donor":
        return [
          { label: "💰 Donated", value: "$500", color: "text-green-600" },
          { label: "🎯 Impact", value: "12 lives", color: "text-blue-600" },
          { label: "📊 Rank", value: "Gold", color: "text-yellow-600" },
        ];
      case "admin":
        return [
          { label: "👥 Users", value: "1,234", color: "text-blue-600" },
          { label: "💊 Meds", value: "456 orders", color: "text-orange-500" },
          { label: "💰 Revenue", value: "$12.5K", color: "text-green-600" },
        ];
      default:
        return [
          { label: "💊 Medications", value: "2 pending", color: "text-orange-500" },
          { label: "❤️ Vitals", value: "Normal", color: "text-green-600" },
          { label: "📅 Appointments", value: "1 today", color: "text-blue-600" },
        ];
    }
  };

  // Role-specific medications
  const getMedications = () => {
    switch(role) {
      case "elderly":
        return [
          { name: "Aspirin", dosage: "75mg", time: "8:00 AM", status: "taken" },
          { name: "Metformin", dosage: "500mg", time: "1:00 PM", status: "pending" },
          { name: "Lisinopril", dosage: "10mg", time: "6:00 PM", status: "pending" },
        ];
      case "caregiver":
        return [
          { name: "Mr. Ahmed - Aspirin", dosage: "75mg", time: "8:00 AM", status: "given" },
          { name: "Mrs. Fatima - Insulin", dosage: "10 units", time: "12:00 PM", status: "pending" },
          { name: "Mr. Yusuf - BP Meds", dosage: "5mg", time: "6:00 PM", status: "pending" },
        ];
      case "volunteer":
        return [
          { name: "Visit Mrs. Fatima", dosage: "Check-up", time: "10:00 AM", status: "pending" },
          { name: "Medication Pickup", dosage: "For Mr. Ahmed", time: "2:00 PM", status: "pending" },
        ];
      case "donor":
        return [
          { name: "Monthly Donation", dosage: "Auto-renew", time: "Due in 5 days", status: "upcoming" },
          { name: "Campaign", dosage: "Winter Drive", time: "Active", status: "active" },
        ];
      case "admin":
        return [
          { name: "User Reports", dosage: "Pending review", time: "3 requests", status: "pending" },
          { name: "System Update", dosage: "Version 2.0", time: "Scheduled", status: "upcoming" },
        ];
      default:
        return [
          { name: "Aspirin", dosage: "75mg", time: "8:00 AM", status: "taken" },
          { name: "Metformin", dosage: "500mg", time: "1:00 PM", status: "pending" },
        ];
    }
  };

  const stats = getStats();
  const medications = getMedications();

  const nextAppointment = {
    doctor: role === "elderly" ? "Dr. Sarah Ahmed" : "Team Meeting",
    specialty: role === "elderly" ? "Cardiologist" : "Staff Coordination",
    time: "Tomorrow, 10:00 AM",
    location: role === "elderly" ? "City Medical Center" : "Main Office",
  };

  return (
    <div className="min-h-screen bg-[#F5F2ED] pb-20">
      {/* Header with Logo */}
      <div className="bg-white border-b border-[#E8E3D8] px-5 pt-8 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-[#1C3123] w-8 h-8 rounded-xl flex items-center justify-center">
              <span className="text-[#F5F2ED] text-xl">❤️</span>
            </div>
            <h1 className="text-2xl font-bold text-[#1C3123]">
              Kafeel<span className="text-[#1C3123]/50">.</span>
            </h1>
          </div>
          <div className="w-10 h-10 bg-[#F5F2ED] rounded-full flex items-center justify-center">
            <span className="text-[#1C3123]">👤</span>
          </div>
        </div>
        
        <div className="mt-6">
          <p className="text-[#1C3123]/50 text-sm">Welcome back,</p>
          <h2 className="text-2xl font-semibold text-[#1C3123]">Ahmed M. 👋</h2>
          <p className="text-xs text-[#1C3123]/40 mt-1">{getRoleTitle()}</p>
          <p className="text-xs text-[#1C3123]/60 mt-2">{getRoleGreeting()}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-5 py-6">
        
        {/* Stats Row - Dynamic based on role */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-3 shadow-sm border border-[#E8E3D8]">
              <p className="text-[#1C3123]/40 text-xs mb-1">{stat.label}</p>
              <p className="text-lg font-bold text-[#1C3123]">{stat.value.split(' ')[0]}</p>
              <p className={`text-xs ${stat.color}`}>{stat.value.split(' ').slice(1).join(' ')}</p>
            </div>
          ))}
        </div>

        {/* Next Appointment Card */}
        <div className="bg-[#1C3123] rounded-2xl p-5 mb-6 text-[#F5F2ED]">
          <p className="text-[#F5F2ED]/70 text-xs mb-2">
            {role === "elderly" ? "📅 NEXT APPOINTMENT" : "📋 NEXT TASK"}
          </p>
          <p className="text-xl font-semibold mb-1">{nextAppointment.doctor}</p>
          <p className="text-[#F5F2ED]/70 text-sm mb-3">{nextAppointment.specialty}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[#F5F2ED]/50">🕐</span>
              <span className="text-sm">{nextAppointment.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#F5F2ED]/50">📍</span>
              <span className="text-sm">{nextAppointment.location}</span>
            </div>
          </div>
        </div>

        {/* Today's Items - Dynamic based on role */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8E3D8] mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#1C3123]">
              {role === "elderly" ? "💊 Today's Medications" : 
               role === "caregiver" ? "👴 Today's Tasks" :
               role === "volunteer" ? "🤝 Today's Activities" :
               role === "donor" ? "🎯 Active Campaigns" : "📊 Pending Reviews"}
            </h3>
            <button className="text-[#1C3123]/60 text-sm">View All →</button>
          </div>
          
          <div className="space-y-3">
            {medications.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-[#F5F2ED]">
                <div>
                  <p className="font-medium text-[#1C3123]">{item.name} {item.dosage}</p>
                  <p className="text-xs text-[#1C3123]/40">{item.time}</p>
                </div>
                <button 
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === "taken" || item.status === "given" || item.status === "active"
                      ? "bg-green-100 text-[#1C3123]" 
                      : item.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {item.status === "taken" ? "✓ Taken" : 
                   item.status === "given" ? "✓ Given" :
                   item.status === "active" ? "● Active" :
                   item.status === "upcoming" ? "⏰ Upcoming" : "⏰ Due"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions - Dynamic based on role */}
        <div className="grid grid-cols-2 gap-3">
          {role === "elderly" && (
            <>
              <button className="bg-[#1C3123]/10 text-[#1C3123] py-3 rounded-xl font-medium text-sm">
                📝 Log Vitals
              </button>
              <button className="bg-red-100 text-red-700 py-3 rounded-xl font-medium text-sm">
                🚨 Emergency
              </button>
            </>
          )}
          {role === "caregiver" && (
            <>
              <button className="bg-[#1C3123]/10 text-[#1C3123] py-3 rounded-xl font-medium text-sm">
                👴 Check Patients
              </button>
              <button className="bg-blue-100 text-blue-700 py-3 rounded-xl font-medium text-sm">
                📋 Add Report
              </button>
            </>
          )}
          {role === "volunteer" && (
            <>
              <button className="bg-[#1C3123]/10 text-[#1C3123] py-3 rounded-xl font-medium text-sm">
                🤝 Check Tasks
              </button>
              <button className="bg-green-100 text-green-700 py-3 rounded-xl font-medium text-sm">
                ⭐ Log Hours
              </button>
            </>
          )}
          {role === "donor" && (
            <>
              <button className="bg-[#1C3123]/10 text-[#1C3123] py-3 rounded-xl font-medium text-sm">
                💰 Make Donation
              </button>
              <button className="bg-green-100 text-green-700 py-3 rounded-xl font-medium text-sm">
                📊 View Impact
              </button>
            </>
          )}
          {role === "admin" && (
            <>
              <button className="bg-[#1C3123]/10 text-[#1C3123] py-3 rounded-xl font-medium text-sm">
                👥 Manage Users
              </button>
              <button className="bg-purple-100 text-purple-700 py-3 rounded-xl font-medium text-sm">
                ⚙️ Settings
              </button>
            </>
          )}
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8E3D8] px-6 py-3">
        <div className="flex items-center justify-between max-w-sm mx-auto">
          <button 
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center ${activeTab === "home" ? "text-[#1C3123]" : "text-[#1C3123]/40"}`}
          >
            <span className="text-xl">🏠</span>
            <span className="text-xs mt-1">Home</span>
          </button>
          <button 
            onClick={() => setActiveTab("schedule")}
            className={`flex flex-col items-center ${activeTab === "schedule" ? "text-[#1C3123]" : "text-[#1C3123]/40"}`}
          >
            <span className="text-xl">📅</span>
            <span className="text-xs mt-1">Schedule</span>
          </button>
          <button 
            onClick={() => setActiveTab("medications")}
            className={`flex flex-col items-center ${activeTab === "medications" ? "text-[#1C3123]" : "text-[#1C3123]/40"}`}
          >
            <span className="text-xl">💊</span>
            <span className="text-xs mt-1">Meds</span>
          </button>
          <button 
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center ${activeTab === "profile" ? "text-[#1C3123]" : "text-[#1C3123]/40"}`}
          >
            <span className="text-xl">👤</span>
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}