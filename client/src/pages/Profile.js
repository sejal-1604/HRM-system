import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import './Profile.css';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [privateInfo, setPrivateInfo] = useState(null);
  const [salaryInfo, setSalaryInfo] = useState(null);
  const [resumeInfo, setResumeInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('resume');
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState(null);
  const [editData, setEditData] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    try {
      // Mock profile data - replace with real API call when backend is ready
      const isOwnProfile = !id || id == currentUser?.id;
      const mockProfile = isOwnProfile ? currentUser : {
        id: parseInt(id),
        name: 'John Doe',
        login_id: 'john',
        email: 'john@company.com',
        phone: '+1 234 567 8900',
        company_name: 'Tech Company',
        department: 'Engineering',
        manager: 'Jane Smith',
        location: 'New York',
        profile_picture: null,
        job_position: 'Senior Developer'
      };

      const mockPrivateInfo = {
        date_of_birth: '1990-01-15',
        residing_address: '123 Main St, New York, NY',
        nationality: 'American',
        gender: 'Male',
        personal_email: 'john.personal@email.com',
        marital_status: 'Single',
        date_of_joining: '2022-01-15',
        account_number: '1234567890',
        bank_name: 'Chase Bank',
        ifsc_code: 'CHAS012345',
        pan_no: 'ABCDE1234F',
        uan_no: '123456789012',
        emp_code: 'EMP001'
      };

      const mockSalaryInfo = {
        basic_salary: '5000',
        allowances: '1000',
        deductions: '500',
        net_salary: '5500',
        monthly_wage: '5500',
        yearly_wage: '66000',
        working_days_per_week: 5,
        break_time_hours: 1,
        hra: '1500',
        hra_percentage: 30,
        standard_allowance: '800',
        standard_allowance_percentage: 16,
        performance_bonus: '500',
        performance_bonus_percentage: 10,
        lta: '200',
        lta_percentage: 4,
        fixed_allowance: '300',
        fixed_allowance_percentage: 6,
        employee_pf: '600',
        employee_pf_percentage: 12,
        employer_pf: '600',
        employer_pf_percentage: 12,
        professional_tax: '200'
      };

      const mockResumeInfo = {
        about: 'Experienced software developer with expertise in React, Node.js, and cloud technologies. Passionate about building scalable applications and mentoring junior developers.',
        what_i_love: 'I love solving complex problems and creating intuitive user experiences. The opportunity to work with cutting-edge technologies and collaborate with talented teams keeps me motivated every day.',
        interests_hobbies: 'When not coding, I enjoy hiking, photography, and contributing to open-source projects. I also love reading about emerging technologies and attending tech meetups.',
        skills: 'JavaScript, React, Node.js, Python, AWS, Docker, MongoDB, PostgreSQL, Git, Agile methodologies',
        certifications: 'AWS Certified Developer, Google Cloud Professional, MongoDB Certified Developer'
      };

      setProfile(mockProfile);
      setPrivateInfo(mockPrivateInfo);
      setSalaryInfo(mockSalaryInfo);
      setResumeInfo(mockResumeInfo);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleEdit = (section, data) => {
    setEditingSection(section);
    setEditData(data || {});
  };

  const handleSave = async (section) => {
    try {
      // Mock save - replace with real API call
      console.log(`Saving ${section}:`, editData);
      
      // Update local state
      switch(section) {
        case 'profile':
          setProfile({...profile, ...editData});
          break;
        case 'private':
          setPrivateInfo({...privateInfo, ...editData});
          break;
        case 'salary':
          setSalaryInfo({...salaryInfo, ...editData});
          break;
        case 'resume':
          setResumeInfo({...resumeInfo, ...editData});
          break;
      }
      
      setEditingSection(null);
      setEditData({});
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const handleCancel = () => {
    setEditingSection(null);
    setEditData({});
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({...profile, profile_picture: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const isAdmin = currentUser?.role === 'admin';
  const isOwnProfile = !id || id == currentUser?.id;
  const canEdit = isOwnProfile || isAdmin;

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-image-section">
            <img
              src={profile?.profile_picture || 'https://via.placeholder.com/120'}
              alt={profile?.name}
              className="profile-picture"
            />
            {canEdit && (
              <div className="image-upload-overlay">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <button 
                  className="upload-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  📷 Change Photo
                </button>
              </div>
            )}
          </div>
          
          <div className="profile-info">
            <h2>{profile?.name}</h2>
            <p>Login ID: {profile?.login_id}</p>
            <p>Email: {profile?.email}</p>
            <p>Mobile: {profile?.phone}</p>
            <p>Position: {profile?.job_position || 'N/A'}</p>
          </div>
          
          <div className="profile-details">
            <p>Company: {profile?.company_name}</p>
            <p>Department: {profile?.department || 'N/A'}</p>
            <p>Manager: {profile?.manager || 'N/A'}</p>
            <p>Location: {profile?.location || 'N/A'}</p>
            {canEdit && (
              <button 
                className="edit-btn"
                onClick={() => handleEdit('profile', profile)}
              >
                ✏️ Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="profile-tabs">
          <button
            className={activeTab === 'resume' ? 'active' : ''}
            onClick={() => setActiveTab('resume')}
          >
            Resume
          </button>
          <button
            className={activeTab === 'private' ? 'active' : ''}
            onClick={() => setActiveTab('private')}
          >
            Private Info
          </button>
          {(isAdmin || isOwnProfile) && (
            <button
              className={activeTab === 'salary' ? 'active' : ''}
              onClick={() => setActiveTab('salary')}
            >
              Salary Info
            </button>
          )}
        </div>

        <div className="profile-content">
          {activeTab === 'resume' && (
            <div className="tab-content">
              {editingSection === 'resume' ? (
                <div className="edit-form">
                  <h3>Edit Resume Information</h3>
                  <div className="form-group">
                    <label>About</label>
                    <textarea
                      value={editData.about || resumeInfo?.about || ''}
                      onChange={(e) => setEditData({...editData, about: e.target.value})}
                      rows={4}
                    />
                  </div>
                  <div className="form-group">
                    <label>What I love about my job</label>
                    <textarea
                      value={editData.what_i_love || resumeInfo?.what_i_love || ''}
                      onChange={(e) => setEditData({...editData, what_i_love: e.target.value})}
                      rows={3}
                    />
                  </div>
                  <div className="form-group">
                    <label>Interests and Hobbies</label>
                    <textarea
                      value={editData.interests_hobbies || resumeInfo?.interests_hobbies || ''}
                      onChange={(e) => setEditData({...editData, interests_hobbies: e.target.value})}
                      rows={3}
                    />
                  </div>
                  <div className="form-group">
                    <label>Skills</label>
                    <input
                      type="text"
                      value={editData.skills || resumeInfo?.skills || ''}
                      onChange={(e) => setEditData({...editData, skills: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Certifications</label>
                    <input
                      type="text"
                      value={editData.certifications || resumeInfo?.certifications || ''}
                      onChange={(e) => setEditData({...editData, certifications: e.target.value})}
                    />
                  </div>
                  <div className="form-actions">
                    <button onClick={() => handleSave('resume')} className="btn-save">Save</button>
                    <button onClick={handleCancel} className="btn-cancel">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="section-header">
                    <h3>About</h3>
                    {canEdit && (
                      <button onClick={() => handleEdit('resume', resumeInfo)} className="edit-section-btn">
                        ✏️
                      </button>
                    )}
                  </div>
                  <p>{resumeInfo?.about || 'No information provided'}</p>
                  
                  <div className="section-header">
                    <h3>What I love about my job</h3>
                    {canEdit && (
                      <button onClick={() => handleEdit('resume', resumeInfo)} className="edit-section-btn">
                        ✏️
                      </button>
                    )}
                  </div>
                  <p>{resumeInfo?.what_i_love || 'No information provided'}</p>
                  
                  <div className="section-header">
                    <h3>My interests and hobbies</h3>
                    {canEdit && (
                      <button onClick={() => handleEdit('resume', resumeInfo)} className="edit-section-btn">
                        ✏️
                      </button>
                    )}
                  </div>
                  <p>{resumeInfo?.interests_hobbies || 'No information provided'}</p>
                  
                  <div className="section-header">
                    <h3>Skills</h3>
                    {canEdit && (
                      <button onClick={() => handleEdit('resume', resumeInfo)} className="edit-section-btn">
                        ✏️
                      </button>
                    )}
                  </div>
                  <p>{resumeInfo?.skills || 'No skills listed'}</p>
                  
                  <div className="section-header">
                    <h3>Certifications</h3>
                    {canEdit && (
                      <button onClick={() => handleEdit('resume', resumeInfo)} className="edit-section-btn">
                        ✏️
                      </button>
                    )}
                  </div>
                  <p>{resumeInfo?.certifications || 'No certifications listed'}</p>
                </>
              )}
            </div>
          )}

          {activeTab === 'private' && (
            <div className="tab-content">
              {editingSection === 'private' ? (
                <div className="edit-form">
                  <h3>Edit Private Information</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Date of Birth</label>
                      <input
                        type="date"
                        value={editData.date_of_birth || privateInfo?.date_of_birth || ''}
                        onChange={(e) => setEditData({...editData, date_of_birth: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Gender</label>
                      <select
                        value={editData.gender || privateInfo?.gender || ''}
                        onChange={(e) => setEditData({...editData, gender: e.target.value})}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Marital Status</label>
                      <select
                        value={editData.marital_status || privateInfo?.marital_status || ''}
                        onChange={(e) => setEditData({...editData, marital_status: e.target.value})}
                      >
                        <option value="">Select Status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Nationality</label>
                      <input
                        type="text"
                        value={editData.nationality || privateInfo?.nationality || ''}
                        onChange={(e) => setEditData({...editData, nationality: e.target.value})}
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Residing Address</label>
                      <textarea
                        value={editData.residing_address || privateInfo?.residing_address || ''}
                        onChange={(e) => setEditData({...editData, residing_address: e.target.value})}
                        rows={3}
                      />
                    </div>
                    <div className="form-group">
                      <label>Personal Email</label>
                      <input
                        type="email"
                        value={editData.personal_email || privateInfo?.personal_email || ''}
                        onChange={(e) => setEditData({...editData, personal_email: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Date of Joining</label>
                      <input
                        type="date"
                        value={editData.date_of_joining || privateInfo?.date_of_joining || ''}
                        onChange={(e) => setEditData({...editData, date_of_joining: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Employee Code</label>
                      <input
                        type="text"
                        value={editData.emp_code || privateInfo?.emp_code || ''}
                        onChange={(e) => setEditData({...editData, emp_code: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Bank Name</label>
                      <input
                        type="text"
                        value={editData.bank_name || privateInfo?.bank_name || ''}
                        onChange={(e) => setEditData({...editData, bank_name: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Account Number</label>
                      <input
                        type="text"
                        value={editData.account_number || privateInfo?.account_number || ''}
                        onChange={(e) => setEditData({...editData, account_number: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>IFSC Code</label>
                      <input
                        type="text"
                        value={editData.ifsc_code || privateInfo?.ifsc_code || ''}
                        onChange={(e) => setEditData({...editData, ifsc_code: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>PAN Number</label>
                      <input
                        type="text"
                        value={editData.pan_no || privateInfo?.pan_no || ''}
                        onChange={(e) => setEditData({...editData, pan_no: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>UAN Number</label>
                      <input
                        type="text"
                        value={editData.uan_no || privateInfo?.uan_no || ''}
                        onChange={(e) => setEditData({...editData, uan_no: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button onClick={() => handleSave('private')} className="btn-save">Save</button>
                    <button onClick={handleCancel} className="btn-cancel">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="info-grid">
                  <div>
                    <label>Date of Birth:</label>
                    <p>{privateInfo?.date_of_birth || 'N/A'}</p>
                  </div>
                  <div>
                    <label>Gender:</label>
                    <p>{privateInfo?.gender || 'N/A'}</p>
                  </div>
                  <div>
                    <label>Marital Status:</label>
                    <p>{privateInfo?.marital_status || 'N/A'}</p>
                  </div>
                  <div>
                    <label>Nationality:</label>
                    <p>{privateInfo?.nationality || 'N/A'}</p>
                  </div>
                  <div className="full-width">
                    <label>Residing Address:</label>
                    <p>{privateInfo?.residing_address || 'N/A'}</p>
                  </div>
                  <div>
                    <label>Personal Email:</label>
                    <p>{privateInfo?.personal_email || 'N/A'}</p>
                  </div>
                  <div>
                    <label>Date of Joining:</label>
                    <p>{privateInfo?.date_of_joining || 'N/A'}</p>
                  </div>
                  <div>
                    <label>Employee Code:</label>
                    <p>{privateInfo?.emp_code || 'N/A'}</p>
                  </div>
                  <div>
                    <label>Bank Name:</label>
                    <p>{privateInfo?.bank_name || 'N/A'}</p>
                  </div>
                  <div>
                    <label>Account Number:</label>
                    <p>{privateInfo?.account_number || 'N/A'}</p>
                  </div>
                  <div>
                    <label>IFSC Code:</label>
                    <p>{privateInfo?.ifsc_code || 'N/A'}</p>
                  </div>
                  <div>
                    <label>PAN Number:</label>
                    <p>{privateInfo?.pan_no || 'N/A'}</p>
                  </div>
                  <div>
                    <label>UAN Number:</label>
                    <p>{privateInfo?.uan_no || 'N/A'}</p>
                  </div>
                  {canEdit && (
                    <div className="full-width">
                      <button onClick={() => handleEdit('private', privateInfo)} className="btn-edit">
                        ✏️ Edit Private Info
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'salary' && (isAdmin || isOwnProfile) && (
            <div className="tab-content">
              {editingSection === 'salary' ? (
                <div className="edit-form">
                  <h3>Edit Salary Information</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Monthly Wage</label>
                      <input
                        type="number"
                        value={editData.monthly_wage || salaryInfo?.monthly_wage || ''}
                        onChange={(e) => setEditData({...editData, monthly_wage: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Yearly Wage</label>
                      <input
                        type="number"
                        value={editData.yearly_wage || salaryInfo?.yearly_wage || ''}
                        onChange={(e) => setEditData({...editData, yearly_wage: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Basic Salary</label>
                      <input
                        type="number"
                        value={editData.basic_salary || salaryInfo?.basic_salary || ''}
                        onChange={(e) => setEditData({...editData, basic_salary: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>HRA</label>
                      <input
                        type="number"
                        value={editData.hra || salaryInfo?.hra || ''}
                        onChange={(e) => setEditData({...editData, hra: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Standard Allowance</label>
                      <input
                        type="number"
                        value={editData.standard_allowance || salaryInfo?.standard_allowance || ''}
                        onChange={(e) => setEditData({...editData, standard_allowance: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Performance Bonus</label>
                      <input
                        type="number"
                        value={editData.performance_bonus || salaryInfo?.performance_bonus || ''}
                        onChange={(e) => setEditData({...editData, performance_bonus: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>LTA</label>
                      <input
                        type="number"
                        value={editData.lta || salaryInfo?.lta || ''}
                        onChange={(e) => setEditData({...editData, lta: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Fixed Allowance</label>
                      <input
                        type="number"
                        value={editData.fixed_allowance || salaryInfo?.fixed_allowance || ''}
                        onChange={(e) => setEditData({...editData, fixed_allowance: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Employee PF</label>
                      <input
                        type="number"
                        value={editData.employee_pf || salaryInfo?.employee_pf || ''}
                        onChange={(e) => setEditData({...editData, employee_pf: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Employer PF</label>
                      <input
                        type="number"
                        value={editData.employer_pf || salaryInfo?.employer_pf || ''}
                        onChange={(e) => setEditData({...editData, employer_pf: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Professional Tax</label>
                      <input
                        type="number"
                        value={editData.professional_tax || salaryInfo?.professional_tax || ''}
                        onChange={(e) => setEditData({...editData, professional_tax: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Working Days/Week</label>
                      <input
                        type="number"
                        value={editData.working_days_per_week || salaryInfo?.working_days_per_week || ''}
                        onChange={(e) => setEditData({...editData, working_days_per_week: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Break Time (Hours)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={editData.break_time_hours || salaryInfo?.break_time_hours || ''}
                        onChange={(e) => setEditData({...editData, break_time_hours: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button onClick={() => handleSave('salary')} className="btn-save">Save</button>
                    <button onClick={handleCancel} className="btn-cancel">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="info-grid">
                  <div>
                    <label>Monthly Wage:</label>
                    <p>${salaryInfo?.monthly_wage || 'N/A'}</p>
                  </div>
                  <div>
                    <label>Yearly Wage:</label>
                    <p>${salaryInfo?.yearly_wage || 'N/A'}</p>
                  </div>
                  <div>
                    <label>Basic Salary:</label>
                    <p>${salaryInfo?.basic_salary || 'N/A'}</p>
                  </div>
                  <div>
                    <label>HRA:</label>
                    <p>${salaryInfo?.hra || 'N/A'}</p>
                  </div>
                  <div>
                    <label>Standard Allowance:</label>
                    <p>${salaryInfo?.standard_allowance || 'N/A'}</p>
                  </div>
                  <div>
                    <label>Performance Bonus:</label>
                    <p>${salaryInfo?.performance_bonus || 'N/A'}</p>
                  </div>
                  <div>
                    <label>LTA:</label>
                    <p>${salaryInfo?.lta || 'N/A'}</p>
                  </div>
                  <div>
                    <label>Fixed Allowance:</label>
                    <p>${salaryInfo?.fixed_allowance || 'N/A'}</p>
                  </div>
                  <div>
                    <label>Employee PF:</label>
                    <p>${salaryInfo?.employee_pf || 'N/A'}</p>
                  </div>
                  <div>
                    <label>Employer PF:</label>
                    <p>${salaryInfo?.employer_pf || 'N/A'}</p>
                  </div>
                  <div>
                    <label>Professional Tax:</label>
                    <p>${salaryInfo?.professional_tax || 'N/A'}</p>
                  </div>
                  <div>
                    <label>Working Days/Week:</label>
                    <p>{salaryInfo?.working_days_per_week || 'N/A'}</p>
                  </div>
                  <div>
                    <label>Break Time (Hours):</label>
                    <p>{salaryInfo?.break_time_hours || 'N/A'}</p>
                  </div>
                  <div className="full-width">
                    <label>Net Salary:</label>
                    <p className="net-salary"><strong>${salaryInfo?.net_salary || 'N/A'}</strong></p>
                  </div>
                  {canEdit && (
                    <div className="full-width">
                      <button onClick={() => handleEdit('salary', salaryInfo)} className="btn-edit">
                        ✏️ Edit Salary Info
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;