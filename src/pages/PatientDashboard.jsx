import React, { useState } from 'react';
import { Activity, UploadCloud, Cpu, Database, ChevronRight, CheckCircle, Shield, AlertTriangle, MessageSquare, Terminal, User, FileText, Settings, Heart, ActivitySquare, Plus, Bell } from 'lucide-react';
import './PatientDashboard.css';

const PatientDashboard = () => {
  const [visitType, setVisitType] = useState(null); // 'new' or 'returning'
  const [step, setStep] = useState(0); // 0 = select visit type
  const [isProcessing, setIsProcessing] = useState(false);
  const [terminalLog, setTerminalLog] = useState('');
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  
  // Department routing
  const [department, setDepartment] = useState('autonomous');

  const startFlow = (type) => {
    setVisitType(type);
    setStep(1);
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const [aiReport, setAiReport] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // Prompt 5: Mapped POST request to custom Gemini API
      const token = localStorage.getItem('aegis_token');
      const userRaw = localStorage.getItem('aegis_user');
      const user = userRaw ? JSON.parse(userRaw) : { age: 45, weight: 68 };
      
      const res = await fetch('http://localhost:5000/api/ai/generate-plan', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
         },
         body: JSON.stringify({
            patientMetrics: { age: user.age || 45, weight: user.weight || 68 },
            currentPrediction: department === 'cardiology' ? 'High Risk Cardiology Anomaly' : 'General Monitoring'
         })
      });

      const result = await res.json();
      if (result.success && result.data) {
         setAiReport(result.data);
      }
    } catch(err) {
      console.error(err);
    }

    const logs = `[SYS] Allocating memory for Local LLM & Routing to MongoDB Backend...\n[NET] Hitting POST /api/ai/generate-plan...\n[MODEL] Awaiting LLM Gemini Architecture Payload...\n[ANALYSIS] Validating structured output format.\n[NET] LLM Payload received and decrypted.\n[SYS] Complete.`;
    
    let i = 0;
    const interval = setInterval(() => {
      setTerminalLog(logs.slice(0, i));
      i += 4;
      if (i > logs.length) {
        clearInterval(interval);
        setAnalysisComplete(true);
      }
    }, 10);
  };

  return (
    <div className="patient-wrapper">
      
      {/* Top Navbar */}
      <div className="header-nav glass-panel w-full-nav animate-fade-in">
        <div className="nav-brand">
           <Activity size={20} className="text-brand"/> Aegis Edge Patient Portal
        </div>
        
        {/* RIGHT SIDE PROFILE AREA */}
        <div className="profile-area">
           <button className="icon-btn"><Bell size={18}/></button>
           <button className="icon-btn"><Settings size={18}/></button>
           <div className="user-profile-widget">
              <div className="avatar">E</div>
              <div className="user-details">
                 <span className="name">Eleanor Vance</span>
                 <span className="id">PAT-1094</span>
              </div>
           </div>
        </div>
      </div>

      <div className="patient-content-grid">
        
        {/* Left Sidebar - Edge Processing Monitor */}
        <div className="glass-panel patient-sidebar animate-fade-in" style={{animationDelay: '0.1s'}}>
           <div className="system-status">
              <h3><Cpu size={14}/> Edge Compute Status</h3>
              <div className="status-indicator">
                <span className={`pulse-dot ${isProcessing ? 'active' : ''}`}></span>
                <span>{isProcessing ? 'Model Running Locally' : 'Standby Mode'}</span>
              </div>
              
              {isProcessing && (
                <div className="ram-usage animate-fade-in">
                  <div className="usage-bar"><div className="usage-fill" style={{width: '60%'}}></div></div>
                  <span>RAM: 4.8 GB / 8.0 GB Limit</span>
                </div>
              )}
           </div>

           <div className="health-core-container">
              <div className={`health-core ${isProcessing ? 'pulsing' : ''}`}></div>
              <p className="core-label text-center mt-3">Digital Twin Core</p>
           </div>
        </div>

        {/* Main Center Form */}
        <div className="patient-main-content">
          <div className="glass-panel form-panel animate-fade-in" style={{animationDelay: '0.2s'}}>
            
            {!isProcessing ? (
              <>
                <div className="form-header">
                  <h2>{step === 0 ? "Welcome to Intake" : "Autonomous Pre-Triage Assessment"}</h2>
                  {step > 0 && <div className="step-indicator">Step {step} of 3</div>}
                </div>

                {/* STEP 0: First Visit vs Returning */}
                {step === 0 && (
                  <div className="visit-type-selector animate-fade-in">
                    <p className="text-muted mb-4">Please select how you would like to proceed with your assessment today.</p>
                    <div className="type-cards">
                       <div className="type-card" onClick={() => startFlow('new')}>
                          <User size={32} className="text-brand mb-3"/>
                          <h3>First Visit Intake</h3>
                          <p>Start a comprehensive medical history profile from scratch.</p>
                       </div>
                       <div className="type-card returning" onClick={() => startFlow('returning')}>
                          <FileText size={32} className="text-success mb-3"/>
                          <h3>Returning Patient</h3>
                          <p>Continue securely with your past medical history and baseline.</p>
                       </div>
                    </div>
                  </div>
                )}

                {/* Returning Patient Auto-Load Notice */}
                {step === 1 && visitType === 'returning' && (
                  <div className="history-loaded-alert mb-4">
                     <CheckCircle size={18} className="text-success"/>
                     <div>
                       <strong>Past Medical History Loaded</strong>
                       <p>We found your previous records from 2 months ago (Mild hyperthyroidism). We will use this as your baseline.</p>
                     </div>
                  </div>
                )}

                <form onSubmit={step === 3 ? handleSubmit : handleNext}>
                  
                  {/* STEP 1: Department & Symptoms */}
                  {step === 1 && (
                    <div className="form-step animate-fade-in">
                      <h3><ActivitySquare size={18} className="text-brand"/> Inter-Departmental Triage</h3>
                      
                      <div className="input-group">
                        <label>Target Department Routing</label>
                        <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                          <option value="autonomous">Autonomous AI Routing (Recommended)</option>
                          <option value="cardiology">Cardiology</option>
                          <option value="neurology">Neurology</option>
                          <option value="general">General Practice</option>
                          <option value="dermatology">Dermatology</option>
                        </select>
                      </div>

                      <div className="input-group mt-4">
                        <label>Current Symptoms & Vitals (Heart Rate / Temp)</label>
                        <textarea rows="3" placeholder="Describe how you are feeling today..." required></textarea>
                      </div>

                      <div className="btn-group mt-4">
                        <button type="submit" className="btn btn-primary">Continue <ChevronRight size={16}/></button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Lab Tests / Details */}
                  {step === 2 && (
                    <div className="form-step animate-fade-in">
                      <h3><Database size={18} className="text-brand"/> Lab Test Integrations</h3>
                      <p className="text-muted mb-4">If you have at-home test data or external lab results, input them to combine domains.</p>
                      
                      <div className="input-group">
                        <label>White Blood Cell Count (WBC) - Immunology</label>
                        <input type="number" step="0.1" placeholder="x 10^9/L" />
                      </div>
                      <div className="input-group">
                        <label>Lactate Levels - Hematology</label>
                        <input type="number" step="0.1" placeholder="mmol/L" />
                      </div>

                      <div className="btn-group mt-4">
                        <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
                        <button type="submit" className="btn btn-primary">Continue <ChevronRight size={16}/></button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Multi-modal */}
                  {step === 3 && (
                    <div className="form-step animate-fade-in">
                      <h3><UploadCloud size={18} className="text-brand"/> Multi-modal Triage (Image Upload)</h3>
                      <p className="text-muted mb-4">Upload an image of your symptom (e.g., rash, swelling) for local Vision AI analysis.</p>
                      
                      <div className="upload-box">
                        <UploadCloud size={48} className="text-muted mb-2"/>
                        <p>Drag & Drop medical image here</p>
                        <span className="text-secondary" style={{fontSize: '12px'}}>(Processed entirely on-device)</span>
                        <input type="file" className="file-input" />
                      </div>

                      <div className="btn-group mt-4">
                        <button type="button" className="btn btn-outline" onClick={() => setStep(2)}>Back</button>
                        <button type="submit" className="btn btn-primary submit-pulse animate-pulse">Initiate Local Analysis</button>
                      </div>
                    </div>
                  )}
                </form>
              </>
            ) : (
              
              /* PROCESSING TERMINAL */
              <div className="processing-stage animate-fade-in">
                <div className="terminal-container">
                  <div className="terminal-header">
                    <span className="dot red"></span><span className="dot yellow"></span><span className="dot green"></span>
                    <span className="terminal-title">EDGE_RUNNER // LOCAL INFERENCE ACTIVE</span>
                    <span className="secure-badge"><Shield size={12}/> Secure</span>
                  </div>
                  <div className="terminal-body border-glow">
                    <pre>{terminalLog}</pre>
                  </div>
                </div>

                {analysisComplete && (
                   <div className="analysis-complete-banner animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <CheckCircle size={24} className="text-success"/>
                        <h4>Analysis Complete & Dispatched</h4>
                      </div>
                      
                      {aiReport && (
                        <div className="ai-report-payload bg-black/30 p-4 border border-brand/30 rounded-md">
                           <h5 className="text-brand mb-2"><Activity size={14} className="inline mr-1"/> LLM Diet Plan Output</h5>
                           <p className="text-sm text-gray-300 mb-4">{aiReport.dietPlan}</p>
                           
                           <h5 className="text-success mb-2"><Shield size={14} className="inline mr-1"/> Reliable Solution Protocol</h5>
                           <p className="text-sm text-gray-300">{aiReport.reliableSolution}</p>
                        </div>
                      )}
                   </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Patient Profile & Integrations */}
        <div className="glass-panel right-sidebar animate-fade-in" style={{animationDelay: '0.3s'}}>
           <div className="sidebar-section">
              <h3>Profile Summary</h3>
              <div className="profile-card">
                 <div className="profile-detail"><span>Age/Sex:</span> 45F</div>
                 <div className="profile-detail"><span>Blood Type:</span> O+</div>
                 <div className="profile-detail"><span>Allergies:</span> Penicillin</div>
              </div>
           </div>

           <div className="sidebar-section mt-4">
              <h3>Connected Devices</h3>
              <ul className="device-list">
                 <li><Activity size={14} className="text-success"/> Apple Watch Series 8</li>
                 <li><Heart size={14} className="text-success"/> Omron BP Monitor</li>
                 <li className="add-device"><Plus size={14}/> Add Medical Device</li>
              </ul>
           </div>

           {visitType === 'returning' && (
             <div className="sidebar-section mt-4">
                <h3>Past Interventions</h3>
                <div className="history-card">
                   <div className="date">Oct 12, 2023</div>
                   <div>Prescription: Low-dose beta-blocker</div>
                   <div className="text-muted" style={{fontSize: '11px', marginTop: '4px'}}>Department: Cardiology</div>
                </div>
             </div>
           )}
        </div>

      </div>

      {/* Floating Explainability Chat */}
      {analysisComplete && (
        <div className={`xai-chat-widget ${chatOpen ? 'open' : ''}`}>
           <div className="chat-header" onClick={() => setChatOpen(!chatOpen)}>
             <span><MessageSquare size={16}/> Explainable AI (XAI)</span>
             <ChevronRight size={16} style={{transform: chatOpen ? 'rotate(90deg)' : 'rotate(-90deg)', transition: '0.3s'}}/>
           </div>
           {chatOpen && (
             <div className="chat-body">
                <div className="message ai">
                   <p>Based on your input, my diagnostic layer routed your case heavily to Cardiology protocols due to elevated Lactate levels combined with visual markers.</p>
                </div>
                <div className="message user">
                   <p>Is this connected to my previous visits?</p>
                </div>
                <div className="message ai">
                   <p>Yes. By authenticating as a Returning Patient, I compared today's inputs against your baseline from Oct 12, confirming a mild negative trajectory.</p>
                </div>
                <input type="text" placeholder="Ask your data..." className="chat-input"/>
             </div>
           )}
        </div>
      )}

    </div>
  );
};

export default PatientDashboard;
