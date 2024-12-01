// app.ts
interface Education {
    school: string;
    degree: string;
    year: string;
}

interface Experience {
    company: string;
    position: string;
    duration: string;
    description: string;
}

class ResumeBuilder {
    private educationList: Education[] = [];
    private experienceList: Experience[] = [];
    private skills: string[] = [];
    private isFormLocked: boolean = false;
    private currentSection: string = 'personalInfo';

    constructor() {
        this.initializeEventListeners();
        this.loadSavedData();
        this.initializeNavigation();
    }

    private initializeEventListeners(): void {
        document.getElementById('addEducation')?.addEventListener('click', () => this.addEducation());
        document.getElementById('addExperience')?.addEventListener('click', () => this.addExperience());
        document.getElementById('addSkill')?.addEventListener('click', () => this.addSkill());
        document.getElementById('saveBtn')?.addEventListener('click', () => this.saveResume());
        document.getElementById('printBtn')?.addEventListener('click', () => this.printResume());
    }

    private toggleFormFields(disable: boolean): void {
        // Disable all input fields
        const inputs = document.querySelectorAll('input, textarea') as NodeListOf<HTMLInputElement | HTMLTextAreaElement>;
        inputs.forEach(input => {
            input.disabled = disable;
        });

        // Disable all buttons except Save and Print
        const buttons = document.querySelectorAll('button:not(#saveBtn):not(#printBtn)') as NodeListOf<HTMLButtonElement>;
        buttons.forEach(button => {
            button.disabled = disable;
        });

        // Visual feedback
        if (disable) {
            document.body.classList.add('form-locked');
            const saveBtn = document.getElementById('saveBtn') as HTMLButtonElement;
            saveBtn.innerHTML = '<i class="fas fa-lock"></i> Unlock Form';
            saveBtn.classList.add('unlock-btn');
        } else {
            document.body.classList.remove('form-locked');
            const saveBtn = document.getElementById('saveBtn') as HTMLButtonElement;
            saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Resume';
            saveBtn.classList.remove('unlock-btn');
        }
    }

    private addEducation(): void {
        const educationList = document.getElementById('educationList');
        const educationDiv = document.createElement('div');
        educationDiv.className = 'education-item';
        educationDiv.innerHTML = `
            <input type="text" placeholder="School Name">
            <input type="text" placeholder="Degree">
            <input type="text" placeholder="Year">
            <button onclick="this.parentElement.remove()">Remove</button>
        `;
        educationList?.appendChild(educationDiv);
    }

    private addExperience(): void {
        const experienceList = document.getElementById('experienceList');
        const experienceDiv = document.createElement('div');
        experienceDiv.className = 'experience-item';
        experienceDiv.innerHTML = `
            <input type="text" placeholder="Company">
            <input type="text" placeholder="Position">
            <input type="text" placeholder="Duration">
            <textarea placeholder="Description"></textarea>
            <button onclick="this.parentElement.remove()">Remove</button>
        `;
        experienceList?.appendChild(experienceDiv);
    }

    private addSkill(): void {
        const skillInput = document.getElementById('skillInput') as HTMLInputElement;
        const skillsList = document.getElementById('skillsList');
        
        if (skillInput.value.trim()) {
            const skillDiv = document.createElement('div');
            skillDiv.className = 'skill-item';
            skillDiv.textContent = skillInput.value;
            skillDiv.onclick = () => skillDiv.remove();
            skillsList?.appendChild(skillDiv);
            this.skills.push(skillInput.value);
            skillInput.value = '';
        }
    }

    private collectEducationData(): Education[] {
        const educationList: Education[] = [];
        const educationItems = document.querySelectorAll('#educationList .education-item');
        
        educationItems.forEach(item => {
            const inputs = item.querySelectorAll('input');
            educationList.push({
                school: (inputs[0] as HTMLInputElement).value,
                degree: (inputs[1] as HTMLInputElement).value,
                year: (inputs[2] as HTMLInputElement).value
            });
        });
        
        return educationList;
    }

    private collectExperienceData(): Experience[] {
        const experienceList: Experience[] = [];
        const experienceItems = document.querySelectorAll('#experienceList .experience-item');
        
        experienceItems.forEach(item => {
            const inputs = item.querySelectorAll('input');
            const description = item.querySelector('textarea') as HTMLTextAreaElement;
            experienceList.push({
                company: (inputs[0] as HTMLInputElement).value,
                position: (inputs[1] as HTMLInputElement).value,
                duration: (inputs[2] as HTMLInputElement).value,
                description: description.value
            });
        });
        
        return experienceList;
    }

    private saveResume(): void {
        this.isFormLocked = !this.isFormLocked;
        this.toggleFormFields(this.isFormLocked);

        if (this.isFormLocked) {
            const personalInfo = {
                fullName: (document.getElementById('fullName') as HTMLInputElement).value,
                email: (document.getElementById('email') as HTMLInputElement).value,
                phone: (document.getElementById('phone') as HTMLInputElement).value,
                address: (document.getElementById('address') as HTMLTextAreaElement).value
            };

            // Collect all data
            this.educationList = this.collectEducationData();
            this.experienceList = this.collectExperienceData();

            const resumeData = {
                personalInfo,
                education: this.educationList,
                experience: this.experienceList,
                skills: this.skills
            };

            localStorage.setItem('resumeData', JSON.stringify(resumeData));
            this.showResumePreview(resumeData);
        }
    }

    private showResumePreview(data: any): void {
        const previewWindow = window.open('', '_blank');
        if (!previewWindow) return;

        const previewHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${data.personalInfo.fullName} - Resume</title>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        line-height: 1.6;
                        max-width: 800px;
                        margin: 40px auto;
                        padding: 20px;
                        background-color: #f8fafc;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                        padding-bottom: 20px;
                        border-bottom: 2px solid #2563eb;
                    }
                    .section {
                        margin-bottom: 25px;
                        padding: 20px;
                        background: white;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    .section-title {
                        color: #2563eb;
                        margin-bottom: 15px;
                    }
                    .skill-tag {
                        display: inline-block;
                        background: #e9ecef;
                        padding: 5px 10px;
                        margin: 3px;
                        border-radius: 15px;
                        font-size: 14px;
                    }
                    .contact-info {
                        margin: 10px 0;
                    }
                    .experience-item, .education-item {
                        margin-bottom: 15px;
                        padding-bottom: 15px;
                        border-bottom: 1px solid #e5e7eb;
                    }
                    @media print {
                        body {
                            background: white;
                        }
                        .section {
                            box-shadow: none;
                            border: 1px solid #e5e7eb;
                        }
                    }
                    .back-button {
                        position: fixed;
                        top: 20px;
                        left: 20px;
                        padding: 10px 20px;
                        background-color: #2563eb;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 16px;
                        transition: background-color 0.3s ease;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }
                    
                    .back-button:hover {
                        background-color: #1e40af;
                    }
                    
                    @media print {
                        .back-button {
                            display: none;
                        }
                    }
                </style>
            </head>
            <body>
                <button class="back-button" onclick="window.close()">
                    ← Back to Editor
                </button>
                <div class="header">
                    <h1>${data.personalInfo.fullName}</h1>
                    <div class="contact-info">
                        <p>📧 ${data.personalInfo.email} | 📞 ${data.personalInfo.phone}</p>
                        <p>📍 ${data.personalInfo.address}</p>
                    </div>
                </div>

                <div class="section">
                    <h2 class="section-title">Education</h2>
                    ${data.education.map((edu: Education) => `
                        <div class="education-item">
                            <h3>${edu.degree}</h3>
                            <p>${edu.school}</p>
                            <p>${edu.year}</p>
                        </div>
                    `).join('')}
                </div>

                <div class="section">
                    <h2 class="section-title">Experience</h2>
                    ${data.experience.map((exp: Experience) => `
                        <div class="experience-item">
                            <h3>${exp.position}</h3>
                            <p><strong>${exp.company}</strong> | ${exp.duration}</p>
                            <p>${exp.description}</p>
                        </div>
                    `).join('')}
                </div>

                <div class="section">
                    <h2 class="section-title">Skills</h2>
                    <div>
                        ${data.skills.map((skill: string) => `
                            <span class="skill-tag">${skill}</span>
                        `).join('')}
                    </div>
                </div>
            </body>
            </html>
        `;

        previewWindow.document.write(previewHTML);
        previewWindow.document.close();
    }

    private loadSavedData(): void {
        const savedData = localStorage.getItem('resumeData');
        if (savedData) {
            const data = JSON.parse(savedData);
            // Populate fields with saved data
            Object.entries(data.personalInfo).forEach(([key, value]) => {
                const element = document.getElementById(key) as HTMLInputElement;
                if (element) element.value = value as string;
            });
            // Load other sections...
        }
    }

    private printResume(): void {
        window.print();
    }

    private initializeNavigation(): void {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const section = (e.currentTarget as HTMLElement).dataset.section;
                if (section) {
                    this.navigateToSection(section);
                }
            });
        });

        // Monitor scroll for section highlighting
        document.addEventListener('scroll', this.handleScroll.bind(this));
    }

    private navigateToSection(sectionId: string): void {
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to clicked nav item
        const navItem = document.querySelector(`[data-section="${sectionId}"]`);
        navItem?.classList.add('active');

        // Scroll to section
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }

        this.currentSection = sectionId;
        this.updateProgress();
    }

    private handleScroll(): void {
        const sections = document.querySelectorAll('.section');
        const scrollPosition = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop - 100 && 
                scrollPosition < sectionTop + sectionHeight - 100) {
                const sectionId = section.id;
                this.highlightNavItem(sectionId);
            }
        });
    }

    private highlightNavItem(sectionId: string): void {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        const activeNav = document.querySelector(`[data-section="${sectionId}"]`);
        activeNav?.classList.add('active');
    }

    private updateProgress(): void {
        const sections = ['personalInfo', 'education', 'experience', 'skills'];
        const currentIndex = sections.indexOf(this.currentSection);
        const progress = ((currentIndex + 1) / sections.length) * 100;

        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }
}

// Initialize the resume builder
new ResumeBuilder();

// Add these styles to your CSS
const styles = `
.form-locked input:disabled,
.form-locked textarea:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
    opacity: 0.7;
}

.unlock-btn {
    background-color: #dc2626 !important;
}

.toast {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 24px;
    border-radius: 8px;
    color: white;
    display: flex;
    align-items: center;
    gap: 8px;
    animation: slideIn 0.3s ease, slideOut 0.3s ease 2.7s;
}

.toast.success {
    background-color: #22c55e;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOut {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}
`;