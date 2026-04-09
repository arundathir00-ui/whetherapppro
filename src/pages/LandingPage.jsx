import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Sparkles, Activity, CheckCircle, XCircle, ArrowRight, Play, Server, Clock, ActivitySquare, Brain, Eye, UserCheck, Stethoscope, Lock, Heart, Database, Layout } from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');

  const handleEndVisit = () => {
    // Generate a simulated record
    const newRecord = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      name: 'Agent Intake (Live)',
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      severity: 'critical',
      score: 88,
      reason: 'Lactate levels / Visual Endpoints',
      vitals: {hr: '105 bpm', bp: '135/88', lactate: '3.1 mmol/L'}
    };
    
    // Sync via localStorage to DoctorDashboard
    const existingStr = localStorage.getItem('precords_sync');
    const existing = existingStr ? JSON.parse(existingStr) : [];
    existing.unshift(newRecord);
    localStorage.setItem('precords_sync', JSON.stringify(existing));
    
    // Dispatch event for same-window syncing
    window.dispatchEvent(new Event('precord_sync_event'));

    alert("Visit ended! Agent data synchronized. Visit the Doctor Dashboard to see the real-time ingest.");
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="landing-wrapper">
      
      {/* 1. STICKY NAVBAR */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-dark">AegisFlow</span><span className="logo-accent">AI</span>
          </div>
          <ul className="nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#pricing">Pricing</a></li>
          </ul>
          <div className="nav-actions">
            <button className="nav-ghost-btn" onClick={() => navigate('/login')}>Login</button>
            <button className="nav-primary-btn" onClick={() => navigate('/doctor-dashboard')}>Start Free Trial</button>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <header className="hero-section">
        <div className="hero-content">
          <h1>AI Assistants <br/>for <span className="text-accent">Medical Professionals</span></h1>
          <p className="hero-sub">Autonomous orchestration for triage, diagnostics, and real-time FHIR ingestion. Save 20+ hours a week avoiding administrative burnout.</p>
          
          <div className="hero-value-props">
            <span><CheckCircle size={14}/> No credit card required</span>
            <span><CheckCircle size={14}/> 14-day free trial</span>
            <span><CheckCircle size={14}/> 24/7 Support</span>
          </div>

          <div className="hero-cta-group">
            <button className="primary-btn-large" onClick={() => navigate('/doctor-dashboard')}>
              See Live Demo <ArrowRight size={18}/>
            </button>
            <button className="secondary-btn-large" onClick={() => navigate('/patient-dashboard')}>
              View Patient Portal <Play size={18}/>
            </button>
          </div>
        </div>

        {/* HERO MOCKUP */}
        <div className="hero-mockup-wrapper">
          <div className="dashboard-mockup">
            <div className="mockup-sidebar">
               <ul>
                 <li className={activeTab === 'Dashboard' ? 'active' : ''} onClick={() => setActiveTab('Dashboard')} style={{cursor: 'pointer'}}><Activity size={16}/> Dashboard</li>
                 <li className={activeTab === 'Patients' ? 'active' : ''} onClick={() => setActiveTab('Patients')} style={{cursor: 'pointer'}}><UserCheck size={16}/> Patients</li>
                 <li className={activeTab === 'Reports' ? 'active' : ''} onClick={() => setActiveTab('Reports')} style={{cursor: 'pointer'}}><Database size={16}/> Reports</li>
                 <li className={activeTab === 'FHIR_Nodes' ? 'active' : ''} onClick={() => setActiveTab('FHIR_Nodes')} style={{cursor: 'pointer'}}><Server size={16}/> FHIR Nodes</li>
               </ul>
            </div>
            <div className="mockup-main">
               <div className="mockup-header">
                 <h2>Welcome, Dr. Aris</h2>
                 <p>Consilium Engine Active</p>
               </div>
               
               {activeTab === 'Dashboard' && (
                 <div className="mockup-grid">
                    <div className="mockup-card timeline">
                       <h3><Clock size={16}/> Priority Timeline</h3>
                       <div className="timeline-item"><div className="status red"></div> Eleanor Vance (Tachycardia) <span>Pending</span></div>
                       <div className="timeline-item"><div className="status green"></div> Marcus Sterling (Checkup) <span>Clear</span></div>
                       <div className="timeline-item"><div className="status yellow"></div> Sarah J. (Lab Flag) <span>Review</span></div>
                    </div>
                    
                    <div className="mockup-card highlight floating-widget">
                       <div className="live-pill"><span className="pulse"></span> LIVE SBAR ORCHESTRATION</div>
                       <h3>Patient Consultation Agent</h3>
                       <div className="mockup-wave"></div>
                       <p className="mockup-transcript">"Evaluating Lactate levels against Visual Endpoints..."</p>
                       <div className="mockup-controls">
                         <button className="pause text-white bg-slate-800" onClick={() => setIsPaused(!isPaused)}>{isPaused ? 'Resume' : 'Pause'}</button>
                         <button className="end text-white bg-red-500" onClick={handleEndVisit}>End Visit</button>
                       </div>
                    </div>
                 </div>
               )}

               {activeTab === 'Patients' && (
                 <div className="mockup-grid" style={{gridTemplateColumns: 'minmax(0, 1fr)'}}>
                   <div className="mockup-card">
                     <h3 style={{marginBottom: '16px'}}><UserCheck size={16}/> Connected EHR Directory</h3>
                     <table style={{width: '100%', fontSize: '13px', borderCollapse: 'collapse'}}>
                       <thead><tr style={{borderBottom: '1px solid #E5E7EB', color: '#6B7280', textAlign: 'left', fontSize: '11px', textTransform:'uppercase'}}><th style={{paddingBottom: '8px'}}>ID</th><th style={{paddingBottom: '8px'}}>Name</th><th style={{paddingBottom: '8px'}}>Age</th><th style={{paddingBottom: '8px'}}>Risk Score</th></tr></thead>
                       <tbody>
                         <tr><td style={{padding: '12px 0 8px 0', borderBottom: '1px solid #F3F4F6'}}>#A9B2</td><td style={{padding: '12px 0 8px 0', borderBottom: '1px solid #F3F4F6', fontWeight: 600}}>Eleanor Vance</td><td style={{padding: '12px 0 8px 0', borderBottom: '1px solid #F3F4F6'}}>64</td><td style={{padding: '12px 0 8px 0', borderBottom: '1px solid #F3F4F6', color: '#EF4444', fontWeight: 'bold'}}>92 (Critical)</td></tr>
                         <tr><td style={{padding: '12px 0 8px 0', borderBottom: '1px solid #F3F4F6'}}>#F1C4</td><td style={{padding: '12px 0 8px 0', borderBottom: '1px solid #F3F4F6', fontWeight: 600}}>Sarah J.</td><td style={{padding: '12px 0 8px 0', borderBottom: '1px solid #F3F4F6'}}>34</td><td style={{padding: '12px 0 8px 0', borderBottom: '1px solid #F3F4F6', color: '#F59E0B', fontWeight: 'bold'}}>55 (Elevated)</td></tr>
                         <tr><td style={{padding: '12px 0 8px 0'}}>#B8X9</td><td style={{padding: '12px 0 8px 0', fontWeight: 600}}>Marcus Sterling</td><td style={{padding: '12px 0 8px 0'}}>42</td><td style={{padding: '12px 0 8px 0', color: '#10B981', fontWeight: 'bold'}}>12 (Stable)</td></tr>
                       </tbody>
                     </table>
                   </div>
                 </div>
               )}

               {activeTab === 'Reports' && (
                 <div className="mockup-grid" style={{gridTemplateColumns: 'minmax(0, 1fr)'}}>
                   <div className="mockup-card timeline">
                     <h3 style={{marginBottom: '16px'}}><Database size={16}/> SBAR Auto-Generations</h3>
                     <div className="timeline-item" style={{display: 'flex', alignItems: 'flex-start', padding: '16px'}}><div style={{flex: 1}}><strong>#SBAR-921</strong>: Eleanor V. / Tachycardia<div style={{fontSize: '11px', color: '#6B7280', marginTop: '6px', lineHeight: 1.4}}>Live telemetry ingested. Validated using NLM models. Recommended Action: Stat labs.</div></div><span style={{backgroundColor: '#EFF6FF', color: '#3B82F6', alignSelf: 'center'}}>Review</span></div>
                     <div className="timeline-item" style={{display: 'flex', alignItems: 'flex-start', padding: '16px'}}><div style={{flex: 1}}><strong>#SBAR-920</strong>: Marcus S. / Baseline Verification<div style={{fontSize: '11px', color: '#6B7280', marginTop: '6px', lineHeight: 1.4}}>Historical FHIR records mapped. Baseline stable. No adverse reactions observed.</div></div><span style={{backgroundColor: '#F3F4F6', alignSelf: 'center'}}>Archived</span></div>
                   </div>
                 </div>
               )}

               {activeTab === 'FHIR_Nodes' && (
                 <div className="mockup-grid" style={{gridTemplateColumns: 'minmax(0, 1fr)'}}>
                   <div className="mockup-card floating-widget" style={{position: 'relative'}}>
                      <div className="live-pill" style={{backgroundColor: '#111827'}}><span className="pulse" style={{backgroundColor: '#10B981', boxShadow: '0 0 10px #10B981'}}></span> ONLINE</div>
                      <h3><Server size={16}/> Epic Integration Node</h3>
                      <div style={{marginTop: '20px', fontSize: '13px', backgroundColor: 'rgba(0,0,0,0.1)', padding: '16px', borderRadius: '8px'}}>
                        <p style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px'}}><span style={{color: 'rgba(255,255,255,0.8)'}}>Protocol Structure:</span> <strong>FHIR R4 JSON</strong></p>
                        <p style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px'}}><span style={{color: 'rgba(255,255,255,0.8)'}}>End-to-End Latency:</span> <strong>14.2ms / Live</strong></p>
                        <p style={{display: 'flex', justifyContent: 'space-between'}}><span style={{color: 'rgba(255,255,255,0.8)'}}>Security Layer:</span> <strong>Zero-Net Airgapped AES-256</strong></p>
                      </div>
                   </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      </header>

      {/* 3. STATISTICS GRID */}
      <section className="stats-section">
         <div className="stats-container">
           <div className="stat-card">
              <h4>98%</h4>
              <p>Diagnostic Confidence</p>
           </div>
           <div className="stat-card">
              <h4>1M+</h4>
              <p>FHIR Interactions</p>
           </div>
           <div className="stat-card">
              <h4>80+</h4>
              <p>Medical Specialties</p>
           </div>
           <div className="stat-card">
              <h4>>25%</h4>
              <p>Physician Time Saved</p>
           </div>
         </div>
      </section>

      {/* 4. FEATURES 12-CARD SUITE */}
      <section id="features" className="features-section">
         <div className="section-header text-center">
            <h2 className="text-3xl font-bold mb-4">A complete autonomous suite</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Everything you need to automate clinical workflows safely and securely.</p>
         </div>

         <div className="features-grid">
            {[
              { icon: <Database />, title: "Live FHIR Ingestion", text: "Direct R4 standard fetching.", details: "Direct R4 standard fetching allows for seamless integration with existing EMRs, ensuring real-time patient data synchronization without manual data entry." },
              { icon: <ActivitySquare />, title: "SBAR Text Generation", text: "Autonomous documentation.", details: "Autonomous documentation organizes clinical notes into the Situation, Background, Assessment, Recommendation framework, reducing physician documentation time by formatting automatically." },
              { icon: <Brain />, title: "OpenFDA Risk Modeler", text: "Digital twin pathway testing.", details: "Digital twin pathway testing cross-references ongoing treatments and prescribed medications against the OpenFDA database to predict and mitigate adverse drug reactions." },
              { icon: <Eye />, title: "Multi-Modal Vision", text: "Edge-based image analysis.", details: "Edge-based image analysis empowers the system to analyze patient uploads—like rashes, wounds, or reports—and pre-triage conditions prior to the doctor's review." },
              { icon: <Shield />, title: "Zero-Net Security", text: "Local node processing.", details: "Local node processing guarantees that sensitive patient healthcare information (PHI) never leaves the local environment, adhering strongly to HIPAA compliance without relying on external cloud APIs." },
              { icon: <Stethoscope />, title: "PubMed Triangulation", text: "Real-time literature fetches.", details: "Real-time literature fetches pull the latest medical journals and studies based on the patient's symptoms, presenting the doctor with up-to-date, evidence-based recommendations." },
              { icon: <Layout />, title: "Dual Portals", text: "Isolated Doctor/Patient views.", details: "Isolated Doctor and Patient views ensure that patients receive gamified, simplified interfaces for engagement while doctors get high-density, actionable clinical dashboards." },
              { icon: <Heart />, title: "Tamagotchi Core", text: "Gamified patient adherence.", details: "Gamified patient adherence transforms recovery into an interactive journey, encouraging patients to stick to their treatment plans with visual feedback and rewards." }
            ].map((f, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
                <button type="button" className="learn-more" onClick={() => setSelectedFeature(f)} style={{background: 'none', border: 'none', cursor: 'pointer', padding: 0}}>Learn more <ArrowRight size={14}/></button>
              </div>
            ))}
         </div>
      </section>

      {/* 5. TYPICAL WORKFLOW */}
      <section id="how-it-works" className="workflow-section">
         <div className="section-header text-center">
            <h2 className="text-3xl font-bold mb-10">How AegisFlow Works</h2>
         </div>
         <div className="workflow-grid">
            <div className="workflow-step">
              <div className="step-circle">1</div>
              <h4>Patient Intake</h4>
              <p>Patients interact with multi-modal wizard.</p>
            </div>
            <div className="workflow-step">
              <div className="step-circle">2</div>
              <h4>Edge Processing</h4>
              <p>Local LLM analyzes symptoms.</p>
            </div>
            <div className="workflow-step">
              <div className="step-circle">3</div>
              <h4>Orchestration</h4>
              <p>PubMed and FHIR cross-reference.</p>
            </div>
            <div className="workflow-step">
              <div className="step-circle">4</div>
              <h4>Doctor Review</h4>
              <p>Pre-filled SBAR approved via dashboard.</p>
            </div>
         </div>
      </section>

      {/* 6. COMPARISON TABLE */}
      <section className="comparison-section">
         <div className="section-header text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Why AegisFlow AI?</h2>
         </div>
         <div className="comparison-table-wrapper">
           <table className="comparison-table">
             <thead>
               <tr>
                 <th>Feature</th>
                 <th className="highlight-col">AegisFlow AI</th>
                 <th>Legacy EMR Tools</th>
               </tr>
             </thead>
             <tbody>
               <tr>
                 <td>Live PubMed Triangulation</td>
                 <td className="highlight-col"><CheckCircle size={18} className="text-accent mx-auto"/></td>
                 <td><XCircle size={18} className="text-gray-300 mx-auto"/></td>
               </tr>
               <tr>
                 <td>Zero-Net Edge Processing</td>
                 <td className="highlight-col"><CheckCircle size={18} className="text-accent mx-auto"/></td>
                 <td><XCircle size={18} className="text-gray-300 mx-auto"/></td>
               </tr>
               <tr>
                 <td>Digital Twin Modeler</td>
                 <td className="highlight-col"><CheckCircle size={18} className="text-accent mx-auto"/></td>
                 <td><XCircle size={18} className="text-gray-300 mx-auto"/></td>
               </tr>
               <tr>
                 <td>Automated SBAR Formatting</td>
                 <td className="highlight-col"><CheckCircle size={18} className="text-accent mx-auto"/></td>
                 <td><XCircle size={18} className="text-gray-300 mx-auto"/></td>
               </tr>
             </tbody>
           </table>
         </div>
      </section>

      {/* 7. PRICING */}
      <section id="pricing" className="pricing-section">
         <div className="section-header text-center">
            <h2 className="text-3xl font-bold mb-10">Transparent Licensing</h2>
         </div>
         <div className="pricing-grid">
            <div className="pricing-card">
              <h3>Sandbox Tier</h3>
              <div className="price">$0<span>/mo</span></div>
              <p>For individuals and hackathons.</p>
              <button className="pricing-btn outline" onClick={() => navigate('/login')}>Get Started</button>
            </div>
            <div className="pricing-card popular">
              <div className="popular-badge">FLEXIBLE PRICING</div>
              <h3>Pay As You Go</h3>
              <div className="price">$0.99<span>/query</span></div>
              <p>For independent clinical practices.</p>
              <button className="pricing-btn solid" onClick={() => navigate('/login')}>Start Free Trial</button>
            </div>
            <div className="pricing-card">
              <h3>Enterprise Node</h3>
              <div className="price">Custom</div>
              <p>Full FHIR synchronization deployment.</p>
              <button className="pricing-btn outline">Contact Sales</button>
            </div>
         </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
         <div className="footer-content">
            <div className="footer-logo">
              <span className="logo-dark">AegisFlow</span><span className="logo-accent">AI</span>
            </div>
            <p className="text-gray-400">© 2026 AegisFlow AI Consortium.</p>
            
            <div className="emergent-badge">
              <Sparkles size={14}/> Clone Architecture
            </div>
         </div>
      </footer>

      {/* FEATURE MODAL */}
      {selectedFeature && (
        <div className="feature-modal-overlay" onClick={() => setSelectedFeature(null)}>
          <div className="feature-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="feature-modal-close" onClick={() => setSelectedFeature(null)}>
              <XCircle size={24} />
            </button>
            <div className="feature-modal-icon">
              {selectedFeature.icon}
            </div>
            <h2>{selectedFeature.title}</h2>
            <p className="feature-modal-subtitle">{selectedFeature.text}</p>
            <div className="feature-modal-divider"></div>
            <p className="feature-modal-details">{selectedFeature.details}</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default LandingPage;
