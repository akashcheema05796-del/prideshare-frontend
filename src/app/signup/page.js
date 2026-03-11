'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, scheduleAPI, buildingAPI } from '@/lib/api';
import { Upload, Plus, Trash2, Check, Loader2, Calendar, MapPin, Clock, UserPlus } from 'lucide-react';

const DAYS_OF_WEEK = [
  { id: 'monday', label: 'Monday', short: 'M' },
  { id: 'tuesday', label: 'Tuesday', short: 'T' },
  { id: 'wednesday', label: 'Wednesday', short: 'W' },
  { id: 'thursday', label: 'Thursday', short: 'Th' },
  { id: 'friday', label: 'Friday', short: 'F' },
];

export default function SignupPage() {
  const router = useRouter();
  
  // Multi-step form state
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // User data
  const [userData, setUserData] = useState({
    email: '',
    full_name: '',
    phone: '',
    home_zip: '',
    role: 'both',
  });
  
  const [userId, setUserId] = useState(null);
  
  // Schedule entry mode
  const [scheduleMode, setScheduleMode] = useState(null); // 'upload' or 'manual'
  const [uploadedFile, setUploadedFile] = useState(null);
  const [extractedSchedules, setExtractedSchedules] = useState([]);
  const [manualSchedules, setManualSchedules] = useState([]);
  const [buildings, setBuildings] = useState([]);
  
  // Current class being added manually
  const [currentClass, setCurrentClass] = useState({
    course_code: '',
    course_name: '',
    building_id: '',
    days: [],
    start_time: '',
    end_time: '',
  });
  
  // ============================================
  // STEP 1: USER REGISTRATION
  // ============================================
  
  const handleUserSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await authAPI.signup(userData);
      setUserId(response.data.user_id);
      setSuccess('Account created! Now add your schedule.');
      
      // Load buildings for next step
      const buildingsData = await buildingAPI.getBuildings();
      setBuildings(buildingsData);
      
      setTimeout(() => {
        setStep(2);
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // ============================================
  // STEP 2: SCHEDULE UPLOAD (OCR)
  // ============================================
  
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadedFile(file);
    setLoading(true);
    setError('');
    
    try {
      const response = await scheduleAPI.uploadSchedule(userId, file);
      
      if (response.success) {
        setExtractedSchedules(response.schedules);
        setSuccess(`Found ${response.schedules.length} classes in your schedule!`);
      } else {
        setError(response.error || 'Failed to process schedule. Try manual entry instead.');
      }
    } catch (err) {
      setError('Upload failed. Please try manual entry or check file format.');
    } finally {
      setLoading(false);
    }
  };
  
  const saveUploadedSchedule = async () => {
    setLoading(true);
    setError('');
    
    try {
      await scheduleAPI.addBulkClasses(userId, extractedSchedules);
      setSuccess('Schedule saved successfully!');
      
      setTimeout(() => {
        router.push(`/dashboard?user_id=${userId}`);
      }, 1500);
    } catch (err) {
      setError('Failed to save schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // ============================================
  // STEP 2: MANUAL SCHEDULE ENTRY
  // ============================================
  
  const handleAddManualClass = () => {
    if (!currentClass.course_code || !currentClass.building_id || currentClass.days.length === 0 || !currentClass.start_time || !currentClass.end_time) {
      setError('Please fill in all required fields');
      return;
    }
    
    setManualSchedules([...manualSchedules, { ...currentClass }]);
    setCurrentClass({
      course_code: '',
      course_name: '',
      building_id: '',
      days: [],
      start_time: '',
      end_time: '',
    });
    setError('');
  };
  
  const handleRemoveClass = (index) => {
    setManualSchedules(manualSchedules.filter((_, i) => i !== index));
  };
  
  const toggleDay = (dayId) => {
    setCurrentClass(prev => ({
      ...prev,
      days: prev.days.includes(dayId)
        ? prev.days.filter(d => d !== dayId)
        : [...prev.days, dayId]
    }));
  };
  
  const saveManualSchedule = async () => {
    if (manualSchedules.length === 0) {
      setError('Please add at least one class');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await scheduleAPI.addBulkClasses(userId, manualSchedules);
      setSuccess('Schedule saved successfully!');
      
      setTimeout(() => {
        router.push(`/dashboard?user_id=${userId}`);
      }, 1500);
    } catch (err) {
      setError('Failed to save schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // ============================================
  // RENDER
  // ============================================
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <div className="bg-black/30 border-b border-pnw-gold/20">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-pnw-gold">🚗 Pride Share</h1>
          <p className="text-gray-300 mt-1">Purdue Northwest Carpool Network</p>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm ${step >= 1 ? 'text-pnw-gold' : 'text-gray-500'}`}>
            1. Account
          </span>
          <span className={`text-sm ${step >= 2 ? 'text-pnw-gold' : 'text-gray-500'}`}>
            2. Schedule
          </span>
          <span className={`text-sm ${step >= 3 ? 'text-pnw-gold' : 'text-gray-500'}`}>
            3. Done
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-pnw-gold h-2 rounded-full transition-all duration-500"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-200 flex items-center gap-2">
            <Check size={20} />
            {success}
          </div>
        )}
        
        {/* STEP 1: USER REGISTRATION */}
        {step === 1 && (
          <div className="bg-gray-800 rounded-xl p-8 shadow-2xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <UserPlus className="text-pnw-gold" />
              Create Your Account
            </h2>
            <p className="text-gray-400 mb-6">Join the PNW carpool community</p>
            
            <form onSubmit={handleUserSignup} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  PNW Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="yourname@pnw.edu"
                  value={userData.email}
                  onChange={(e) => setUserData({...userData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pnw-gold focus:border-transparent outline-none"
                />
                <p className="text-xs text-gray-400 mt-1">Must be a valid @pnw.edu email</p>
              </div>
              
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={userData.full_name}
                  onChange={(e) => setUserData({...userData, full_name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pnw-gold focus:border-transparent outline-none"
                />
              </div>
              
              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number (optional)
                </label>
                <input
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={userData.phone}
                  onChange={(e) => setUserData({...userData, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pnw-gold focus:border-transparent outline-none"
                />
              </div>
              
              {/* ZIP Code */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Home ZIP Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="46323"
                  maxLength="5"
                  value={userData.home_zip}
                  onChange={(e) => setUserData({...userData, home_zip: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pnw-gold focus:border-transparent outline-none"
                />
                <p className="text-xs text-gray-400 mt-1">Used to find nearby carpoolers</p>
              </div>
              
              {/* Role */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  I'm looking to... *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'driver', label: '🚗 Offer Rides', desc: 'I drive to campus' },
                    { value: 'rider', label: '🎒 Find Rides', desc: 'I need a ride' },
                    { value: 'both', label: '🔄 Either', desc: 'Flexible' }
                  ].map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setUserData({...userData, role: option.value})}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        userData.role === option.value
                          ? 'border-pnw-gold bg-pnw-gold/20'
                          : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                      }`}
                    >
                      <div className="text-lg mb-1">{option.label}</div>
                      <div className="text-xs text-gray-400">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-pnw-gold text-black font-bold py-4 px-6 rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Continue to Schedule
                    <span className="text-xl">→</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
        
        {/* STEP 2: SCHEDULE ENTRY */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Mode Selection */}
            {!scheduleMode && (
              <div className="bg-gray-800 rounded-xl p-8 shadow-2xl border border-gray-700">
                <h2 className="text-2xl font-bold mb-2">Add Your Class Schedule</h2>
                <p className="text-gray-400 mb-6">Choose how you'd like to add your classes</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Upload Option */}
                  <button
                    onClick={() => setScheduleMode('upload')}
                    className="p-6 bg-gray-700 border-2 border-gray-600 rounded-lg hover:border-pnw-gold transition-all group"
                  >
                    <Upload className="text-pnw-gold mb-3 group-hover:scale-110 transition-transform" size={32} />
                    <h3 className="text-lg font-bold mb-2">Upload Schedule</h3>
                    <p className="text-sm text-gray-400">
                      Upload a PDF or screenshot of your schedule and we'll extract your classes automatically
                    </p>
                    <div className="mt-4 text-xs text-gray-500">
                      ⚡ Faster • AI-powered
                    </div>
                  </button>
                  
                  {/* Manual Entry Option */}
                  <button
                    onClick={() => setScheduleMode('manual')}
                    className="p-6 bg-gray-700 border-2 border-gray-600 rounded-lg hover:border-pnw-gold transition-all group"
                  >
                    <Plus className="text-pnw-gold mb-3 group-hover:scale-110 transition-transform" size={32} />
                    <h3 className="text-lg font-bold mb-2">Enter Manually</h3>
                    <p className="text-sm text-gray-400">
                      Add each class one by one with our simple form
                    </p>
                    <div className="mt-4 text-xs text-gray-500">
                      ✓ More control • Precise
                    </div>
                  </button>
                </div>
              </div>
            )}
            
            {/* UPLOAD MODE */}
            {scheduleMode === 'upload' && (
              <div className="bg-gray-800 rounded-xl p-8 shadow-2xl border border-gray-700">
                <h2 className="text-2xl font-bold mb-6">Upload Your Schedule</h2>
                
                {!uploadedFile && (
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-12 text-center">
                    <Upload className="mx-auto text-gray-500 mb-4" size={48} />
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <span className="bg-pnw-gold text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors inline-block">
                        Choose File
                      </span>
                    </label>
                    <p className="text-sm text-gray-400 mt-4">
                      Supported: PDF, PNG, JPG, JPEG
                    </p>
                  </div>
                )}
                
                {loading && (
                  <div className="text-center py-12">
                    <Loader2 className="animate-spin mx-auto text-pnw-gold mb-4" size={48} />
                    <p className="text-gray-300">Processing your schedule...</p>
                    <p className="text-sm text-gray-500 mt-2">This may take 10-15 seconds</p>
                  </div>
                )}
                
                {extractedSchedules.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg">Extracted Classes ({extractedSchedules.length})</h3>
                    
                    {extractedSchedules.map((schedule, index) => (
                      <div key={index} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-bold text-pnw-gold">{schedule.course_code}</h4>
                            {schedule.course_name && (
                              <p className="text-sm text-gray-400">{schedule.course_name}</p>
                            )}
                            <div className="mt-2 flex flex-wrap gap-4 text-sm">
                              <span className="flex items-center gap-1">
                                <MapPin size={16} className="text-gray-400" />
                                {schedule.building_id}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar size={16} className="text-gray-400" />
                                {schedule.days.map(d => d.charAt(0).toUpperCase()).join(', ')}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={16} className="text-gray-400" />
                                {schedule.start_time} - {schedule.end_time}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex gap-4">
                      <button
                        onClick={saveUploadedSchedule}
                        disabled={loading}
                        className="flex-1 bg-pnw-gold text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="animate-spin" size={20} />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check size={20} />
                            Save Schedule
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => {
                          setScheduleMode(null);
                          setUploadedFile(null);
                          setExtractedSchedules([]);
                        }}
                        className="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* MANUAL MODE */}
            {scheduleMode === 'manual' && (
              <div className="bg-gray-800 rounded-xl p-8 shadow-2xl border border-gray-700">
                <h2 className="text-2xl font-bold mb-6">Add Classes Manually</h2>
                
                {/* Add Class Form */}
                <div className="space-y-4 mb-6 p-6 bg-gray-700 rounded-lg">
                  <h3 className="font-bold">New Class</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Course Code *</label>
                      <input
                        type="text"
                        placeholder="CS 240"
                        value={currentClass.course_code}
                        onChange={(e) => setCurrentClass({...currentClass, course_code: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pnw-gold outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Course Name (optional)</label>
                      <input
                        type="text"
                        placeholder="Data Structures"
                        value={currentClass.course_name}
                        onChange={(e) => setCurrentClass({...currentClass, course_name: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pnw-gold outline-none"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Building *</label>
                    <select
                      value={currentClass.building_id}
                      onChange={(e) => setCurrentClass({...currentClass, building_id: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pnw-gold outline-none"
                    >
                      <option value="">Select building...</option>
                      {buildings.map(building => (
                        <option key={building.id} value={building.id}>
                          {building.name} ({building.id.toUpperCase()})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Days *</label>
                    <div className="flex gap-2">
                      {DAYS_OF_WEEK.map(day => (
                        <button
                          key={day.id}
                          type="button"
                          onClick={() => toggleDay(day.id)}
                          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                            currentClass.days.includes(day.id)
                              ? 'bg-pnw-gold text-black'
                              : 'bg-gray-800 text-gray-400 hover:bg-gray-600'
                          }`}
                        >
                          {day.short}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Start Time *</label>
                      <input
                        type="time"
                        value={currentClass.start_time}
                        onChange={(e) => setCurrentClass({...currentClass, start_time: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pnw-gold outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">End Time *</label>
                      <input
                        type="time"
                        value={currentClass.end_time}
                        onChange={(e) => setCurrentClass({...currentClass, end_time: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pnw-gold outline-none"
                      />
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleAddManualClass}
                    className="w-full bg-gray-800 text-pnw-gold font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={20} />
                    Add This Class
                  </button>
                </div>
                
                {/* Added Classes */}
                {manualSchedules.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg">Your Schedule ({manualSchedules.length} classes)</h3>
                    
                    {manualSchedules.map((schedule, index) => (
                      <div key={index} className="bg-gray-700 p-4 rounded-lg border border-gray-600 flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-pnw-gold">{schedule.course_code}</h4>
                          {schedule.course_name && (
                            <p className="text-sm text-gray-400">{schedule.course_name}</p>
                          )}
                          <div className="mt-2 flex flex-wrap gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <MapPin size={16} className="text-gray-400" />
                              {buildings.find(b => b.id === schedule.building_id)?.name || schedule.building_id}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={16} className="text-gray-400" />
                              {schedule.days.map(d => d.charAt(0).toUpperCase()).join(', ')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={16} className="text-gray-400" />
                              {schedule.start_time} - {schedule.end_time}
                            </span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveClass(index)}
                          className="ml-4 p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))}
                    
                    <div className="flex gap-4">
                      <button
                        onClick={saveManualSchedule}
                        disabled={loading}
                        className="flex-1 bg-pnw-gold text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="animate-spin" size={20} />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check size={20} />
                            Complete Signup
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => {
                          setScheduleMode(null);
                          setManualSchedules([]);
                          setCurrentClass({
                            course_code: '',
                            course_name: '',
                            building_id: '',
                            days: [],
                            start_time: '',
                            end_time: '',
                          });
                        }}
                        className="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
