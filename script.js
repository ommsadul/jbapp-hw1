// JBApp - Job Board Application JavaScript

class JobBoard {
    constructor() {
        this.jobs = this.loadJobs();
        this.filteredJobs = [...this.jobs];
        this.currentUser = this.loadCurrentUser();
        this.users = this.loadUsers();
        this.applications = this.loadApplications();
        this.init();
    }

    init() {
        this.initializeView();
        this.bindEvents();
        this.updateAuthDisplay();
    }

    initializeView() {
        // Both sections are now visible, just load the jobs
        this.displayJobs();
        this.updateJobCount();
    }

    bindEvents() {
        // Landing page
        const enterAppBtn = document.getElementById('enterAppBtn');
        if (enterAppBtn) {
            enterAppBtn.addEventListener('click', () => this.scrollToMainApp());
        }

        // Authentication buttons
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const postJobBtn = document.getElementById('postJobBtn');

        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLoginModal();
            });
        }
        if (signupBtn) {
            signupBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSignupModal();
            });
        }
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
        if (postJobBtn) {
            postJobBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showPostJobModal();
            });
        }

        // Modal controls
        this.bindModalEvents();

        // Form submissions (only bind if in main app view)
        const jobForm = document.getElementById('jobForm');
        if (jobForm) {
            jobForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addJob();
            });
        }

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const filterPosition = document.getElementById('filterPosition');
        const clearFilters = document.getElementById('clearFilters');

        if (searchInput) searchInput.addEventListener('input', () => this.filterJobs());
        if (filterPosition) filterPosition.addEventListener('change', () => this.filterJobs());
        if (clearFilters) clearFilters.addEventListener('click', () => this.clearFilters());
    }

    bindModalEvents() {
        // Login modal
        const loginModal = document.getElementById('loginModal');
        const closeLoginModal = document.getElementById('closeLoginModal');
        const loginForm = document.getElementById('loginForm');
        const switchToSignup = document.getElementById('switchToSignup');

        if (closeLoginModal) closeLoginModal.addEventListener('click', () => this.hideModal('loginModal'));
        if (loginForm) loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        if (switchToSignup) switchToSignup.addEventListener('click', (e) => {
            e.preventDefault();
            this.hideModal('loginModal');
            this.showSignupModal();
        });

        // Signup modal
        const signupModal = document.getElementById('signupModal');
        const closeSignupModal = document.getElementById('closeSignupModal');
        const signupForm = document.getElementById('signupForm');
        const switchToLogin = document.getElementById('switchToLogin');

        if (closeSignupModal) closeSignupModal.addEventListener('click', () => this.hideModal('signupModal'));
        if (signupForm) signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        if (switchToLogin) switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            this.hideModal('signupModal');
            this.showLoginModal();
        });

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModal(e.target.id);
            }
        });

        // Post Job modal
        const postJobModal = document.getElementById('postJobModal');
        const closePostJobModal = document.getElementById('closePostJobModal');

        if (closePostJobModal) closePostJobModal.addEventListener('click', () => this.hideModal('postJobModal'));
    }

    scrollToMainApp() {
        const mainApp = document.getElementById('mainApp');
        
        if (mainApp) {
            mainApp.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    showLoginModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.style.display = 'block';
            // Clear form
            const form = document.getElementById('loginForm');
            if (form) form.reset();
        }
    }

    showSignupModal() {
        const modal = document.getElementById('signupModal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.style.display = 'block';
            // Clear form
            const form = document.getElementById('signupForm');
            if (form) form.reset();
        }
    }

    showPostJobModal() {
        // Check if user is logged in
        if (!this.currentUser) {
            alert('Please sign in to post a job.');
            this.showLoginModal();
            return;
        }
        
        const modal = document.getElementById('postJobModal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.style.display = 'block';
            // Clear form
            const form = document.getElementById('jobForm');
            if (form) form.reset();
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            modal.classList.add('hidden');
        }
    }

    handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = user;
            this.saveCurrentUser();
            this.updateAuthDisplay();
            this.hideModal('loginModal');
            this.showSuccessMessage('Successfully signed in!');
        } else {
            alert('Invalid email or password. Please try again.');
        }
    }

    handleSignup(e) {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validation
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        if (this.users.find(u => u.email === email)) {
            alert('An account with this email already exists!');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            name,
            email,
            password,
            dateJoined: new Date().toISOString().split('T')[0]
        };

        this.users.push(newUser);
        this.saveUsers();
        
        this.currentUser = newUser;
        this.saveCurrentUser();
        
        this.updateAuthDisplay();
        this.hideModal('signupModal');
        this.showSuccessMessage('Account created successfully! Welcome to JBApp!');
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('jbapp-current-user');
        this.updateAuthDisplay();
        this.showSuccessMessage('Successfully signed out!');
    }

    updateAuthDisplay() {
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');
        const userMenu = document.getElementById('userMenu');
        const userName = document.getElementById('userName');

        if (this.currentUser) {
            // User is logged in
            if (loginBtn) loginBtn.classList.add('hidden');
            if (signupBtn) signupBtn.classList.add('hidden');
            if (userMenu) userMenu.classList.remove('hidden');
            if (userName) userName.textContent = `Welcome, ${this.currentUser.name}`;
        } else {
            // User is not logged in
            if (loginBtn) loginBtn.classList.remove('hidden');
            if (signupBtn) signupBtn.classList.remove('hidden');
            if (userMenu) userMenu.classList.add('hidden');
        }
    }

    applyForJob(jobId) {
        if (!this.currentUser) {
            alert('Please sign in to apply for jobs!');
            this.showLoginModal();
            return;
        }

        const job = this.jobs.find(j => j.id === jobId);
        if (!job) {
            alert('Job not found!');
            return;
        }

        // Check if already applied
        const existingApplication = this.applications.find(
            app => app.jobId === jobId && app.userId === this.currentUser.id
        );

        if (existingApplication) {
            alert('You have already applied for this job!');
            return;
        }

        // Create application
        const application = {
            id: Date.now(),
            jobId,
            userId: this.currentUser.id,
            dateApplied: new Date().toISOString().split('T')[0],
            status: 'Applied'
        };

        this.applications.push(application);
        this.saveApplications();
        
        // Show immediate feedback
        alert(`✅ Successfully applied for ${job.title} at ${job.company}!`);
        this.showSuccessMessage(`Successfully applied for ${job.title} at ${job.company}!`);
        
        // Update the display to show application status
        this.displayJobs();
    }

    addJob() {
        const form = document.getElementById('jobForm');
        const formData = new FormData(form);
        
        // Create job object
        const job = {
            id: Date.now(), // Simple ID generation
            title: formData.get('jobTitle').trim(),
            company: formData.get('company').trim(),
            position: formData.get('position'),
            location: formData.get('location').trim(),
            salary: formData.get('salary').trim(),
            startDate: formData.get('startDate'),
            description: formData.get('description').trim(),
            datePosted: new Date().toISOString().split('T')[0]
        };

        // Validate required fields
        if (!job.title || !job.company) {
            alert('Please fill in all required fields (Title and Company)');
            return;
        }

        // Add job to array
        this.jobs.unshift(job); // Add to beginning of array
        
        // Save to localStorage
        this.saveJobs();
        
        // Clear form
        form.reset();
        
        // Close the modal
        this.hideModal('postJobModal');
        
        // Update display
        this.filterJobs();
        this.updateJobCount();
        
        // Show success message
        this.showSuccessMessage('Job posted successfully!');
        
        // Scroll to job listings
        document.getElementById('jobListings').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }

    filterJobs() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const positionFilter = document.getElementById('filterPosition').value;

        this.filteredJobs = this.jobs.filter(job => {
            const matchesSearch = !searchTerm || 
                job.title.toLowerCase().includes(searchTerm) ||
                job.company.toLowerCase().includes(searchTerm) ||
                job.description.toLowerCase().includes(searchTerm) ||
                job.location.toLowerCase().includes(searchTerm);

            const matchesPosition = !positionFilter || job.position === positionFilter;

            return matchesSearch && matchesPosition;
        });

        this.displayJobs();
        this.updateJobCount();
    }

    clearFilters() {
        document.getElementById('searchInput').value = '';
        document.getElementById('filterPosition').value = '';
        this.filteredJobs = [...this.jobs];
        this.displayJobs();
        this.updateJobCount();
    }

    displayJobs() {
        const jobListings = document.getElementById('jobListings');
        
        if (this.filteredJobs.length === 0) {
            jobListings.innerHTML = `
                <div class="empty-state">
                    <h3>No jobs found</h3>
                    <p>Try adjusting your search criteria or post a new job.</p>
                </div>
            `;
            return;
        }

        jobListings.innerHTML = this.filteredJobs.map(job => this.createJobCard(job)).join('');
    }

    createJobCard(job) {
        const hasApplied = this.currentUser && this.applications.some(
            app => app.jobId === job.id && app.userId === this.currentUser.id
        );

        return `
            <div class="job-card" data-job-id="${job.id}">
                <div class="job-header">
                    <div>
                        <div class="job-title">${this.escapeHtml(job.title)}</div>
                        <div class="job-company">${this.escapeHtml(job.company)}</div>
                    </div>
                    <div class="job-date">Posted: ${this.formatDate(job.datePosted)}</div>
                </div>
                
                <div class="job-details">
                    <div class="job-detail">
                        <strong>Type:</strong>
                        <span class="position-badge">${job.position}</span>
                    </div>
                    ${job.location ? `
                        <div class="job-detail">
                            <strong>Location:</strong> ${this.escapeHtml(job.location)}
                        </div>
                    ` : ''}
                    ${job.salary ? `
                        <div class="job-detail">
                            <strong>Salary:</strong> ${this.escapeHtml(job.salary)}
                        </div>
                    ` : ''}
                    ${job.startDate ? `
                        <div class="job-detail">
                            <strong>Start Date:</strong> ${this.formatDate(job.startDate)}
                        </div>
                    ` : ''}
                </div>
                
                ${job.description ? `
                    <div class="job-description">
                        <strong>Description:</strong><br>
                        ${this.escapeHtml(job.description)}
                    </div>
                ` : ''}
                
                <div class="job-actions">
                    ${hasApplied ? `
                        <div class="application-status">✓ Applied</div>
                    ` : `
                        <button class="apply-btn" onclick="jobBoard.applyForJob(${job.id})">
                            Apply for Job
                        </button>
                    `}
                </div>
            </div>
        `;
    }

    updateJobCount() {
        const jobCount = document.getElementById('jobCount');
        const count = this.filteredJobs.length;
        
        jobCount.textContent = `${count} job${count !== 1 ? 's' : ''} found`;
    }

    showSuccessMessage(message) {
        // Remove any existing success message
        const existingMessage = document.querySelector('.success-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create and show new success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        
        // Add to body for simplicity
        document.body.appendChild(successDiv);
        
        // Auto-remove after 4 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 4000);
    }

    loadCurrentUser() {
        try {
            const stored = localStorage.getItem('jbapp-current-user');
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error('Error loading current user:', error);
            return null;
        }
    }

    saveCurrentUser() {
        try {
            localStorage.setItem('jbapp-current-user', JSON.stringify(this.currentUser));
        } catch (error) {
            console.error('Error saving current user:', error);
        }
    }

    loadUsers() {
        try {
            const stored = localStorage.getItem('jbapp-users');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading users:', error);
            return [];
        }
    }

    saveUsers() {
        try {
            localStorage.setItem('jbapp-users', JSON.stringify(this.users));
        } catch (error) {
            console.error('Error saving users:', error);
        }
    }

    loadApplications() {
        try {
            const stored = localStorage.getItem('jbapp-applications');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading applications:', error);
            return [];
        }
    }

    saveApplications() {
        try {
            localStorage.setItem('jbapp-applications', JSON.stringify(this.applications));
        } catch (error) {
            console.error('Error saving applications:', error);
        }
    }

    loadJobs() {
        try {
            const stored = localStorage.getItem('jbapp-jobs');
            const jobs = stored ? JSON.parse(stored) : [];
            
            // If we have less than 12 jobs, refresh with new sample data
            if (jobs.length < 12) {
                const newJobs = this.getSampleJobs();
                localStorage.setItem('jbapp-jobs', JSON.stringify(newJobs));
                return newJobs;
            }
            
            return jobs;
        } catch (error) {
            console.error('Error loading jobs from localStorage:', error);
            return this.getSampleJobs();
        }
    }

    saveJobs() {
        try {
            localStorage.setItem('jbapp-jobs', JSON.stringify(this.jobs));
        } catch (error) {
            console.error('Error saving jobs to localStorage:', error);
            alert('Unable to save job. Your browser may not support local storage.');
        }
    }

    getSampleJobs() {
        return [
            // Full-time positions
            {
                id: 1,
                title: 'Software Engineer',
                company: 'Tech Solutions Inc.',
                position: 'Full-time',
                location: 'Baltimore, MD',
                salary: '$70,000 - $90,000',
                startDate: '2025-10-01',
                description: 'We are looking for a talented software engineer to join our growing team. Experience with JavaScript, Python, and modern web technologies required.',
                datePosted: '2025-09-10'
            },
            {
                id: 2,
                title: 'Data Analyst',
                company: 'Data Insights Corp',
                position: 'Full-time',
                location: 'Washington, DC',
                salary: '$55,000 - $75,000',
                startDate: '2025-09-30',
                description: 'Join our data team to help analyze and interpret complex datasets. Strong skills in SQL, Python, and data visualization tools required.',
                datePosted: '2025-09-12'
            },
            {
                id: 3,
                title: 'Product Manager',
                company: 'Innovation Labs',
                position: 'Full-time',
                location: 'Annapolis, MD',
                salary: '$80,000 - $100,000',
                startDate: '2025-10-15',
                description: 'Lead product development initiatives and coordinate with cross-functional teams. Experience in agile methodologies and product strategy required.',
                datePosted: '2025-09-13'
            },
            // Part-time positions
            {
                id: 4,
                title: 'Customer Support Specialist',
                company: 'Service Pro LLC',
                position: 'Part-time',
                location: 'Remote',
                salary: '$20/hour',
                startDate: '2025-10-01',
                description: 'Provide excellent customer support via chat, email, and phone. Flexible hours, perfect for students or career changers.',
                datePosted: '2025-09-11'
            },
            {
                id: 5,
                title: 'Social Media Assistant',
                company: 'Digital Marketing Hub',
                position: 'Part-time',
                location: 'Baltimore, MD',
                salary: '$18/hour',
                startDate: '2025-10-05',
                description: 'Help manage social media accounts and create engaging content. 20 hours per week, flexible schedule.',
                datePosted: '2025-09-14'
            },
            {
                id: 6,
                title: 'Bookkeeping Assistant',
                company: 'Financial Services Group',
                position: 'Part-time',
                location: 'Columbia, MD',
                salary: '$22/hour',
                startDate: '2025-10-08',
                description: 'Support accounting team with data entry, invoice processing, and basic bookkeeping tasks. QuickBooks experience preferred.',
                datePosted: '2025-09-15'
            },
            // Contract positions
            {
                id: 7,
                title: 'Web Developer',
                company: 'Freelance Projects Inc.',
                position: 'Contract',
                location: 'Remote',
                salary: '$50/hour',
                startDate: '2025-09-25',
                description: '6-month contract to build responsive websites for small businesses. Portfolio and React experience required.',
                datePosted: '2025-09-09'
            },
            {
                id: 8,
                title: 'Graphic Designer',
                company: 'Creative Studios',
                position: 'Contract',
                location: 'Washington, DC',
                salary: '$45/hour',
                startDate: '2025-10-10',
                description: '3-month project to design marketing materials and brand assets. Adobe Creative Suite expertise essential.',
                datePosted: '2025-09-12'
            },
            {
                id: 9,
                title: 'Technical Writer',
                company: 'Software Documentation Co.',
                position: 'Contract',
                location: 'Remote',
                salary: '$40/hour',
                startDate: '2025-10-01',
                description: 'Create user manuals and API documentation for software products. Technical writing experience required.',
                datePosted: '2025-09-13'
            },
            // Internship positions
            {
                id: 10,
                title: 'Marketing Intern',
                company: 'Creative Agency',
                position: 'Internship',
                location: 'Remote',
                salary: '$15/hour',
                startDate: '2025-10-15',
                description: 'Great opportunity for students to gain hands-on experience in digital marketing, social media management, and content creation.',
                datePosted: '2025-09-14'
            },
            {
                id: 11,
                title: 'Software Development Intern',
                company: 'Tech Startup',
                position: 'Internship',
                location: 'Baltimore, MD',
                salary: '$18/hour',
                startDate: '2025-10-01',
                description: 'Learn modern web development practices while contributing to real projects. Perfect for computer science students.',
                datePosted: '2025-09-10'
            },
            {
                id: 12,
                title: 'Data Science Intern',
                company: 'Analytics Firm',
                position: 'Internship',
                location: 'Washington, DC',
                salary: '$16/hour',
                startDate: '2025-10-20',
                description: 'Work with senior data scientists on machine learning projects. Python and statistics background preferred.',
                datePosted: '2025-09-15'
            }
        ];
    }

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.jobBoard = new JobBoard();
});

// Add some basic error handling
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
});

// Handle localStorage quota exceeded
window.addEventListener('storage', (e) => {
    if (e.key === 'jbapp-jobs' || e.key === 'jbapp-users' || e.key === 'jbapp-applications') {
        console.log('Data updated in another tab');
    }
});