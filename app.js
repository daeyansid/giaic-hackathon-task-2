var ResumeBuilder = /** @class */ (function () {
    function ResumeBuilder() {
        this.educationList = [];
        this.experienceList = [];
        this.skills = [];
        this.isFormLocked = false;
        this.currentSection = 'personalInfo';
        this.initializeEventListeners();
        this.loadSavedData();
        this.initializeNavigation();
    }
    ResumeBuilder.prototype.initializeEventListeners = function () {
        var _this = this;
        var _a, _b, _c, _d, _e;
        (_a = document.getElementById('addEducation')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () { return _this.addEducation(); });
        (_b = document.getElementById('addExperience')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () { return _this.addExperience(); });
        (_c = document.getElementById('addSkill')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', function () { return _this.addSkill(); });
        (_d = document.getElementById('saveBtn')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', function () { return _this.saveResume(); });
        (_e = document.getElementById('printBtn')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', function () { return _this.printResume(); });
    };
    ResumeBuilder.prototype.toggleFormFields = function (disable) {
        // Disable all input fields
        var inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(function (input) {
            input.disabled = disable;
        });
        // Disable all buttons except Save and Print
        var buttons = document.querySelectorAll('button:not(#saveBtn):not(#printBtn)');
        buttons.forEach(function (button) {
            button.disabled = disable;
        });
        // Visual feedback
        if (disable) {
            document.body.classList.add('form-locked');
            var saveBtn = document.getElementById('saveBtn');
            saveBtn.innerHTML = '<i class="fas fa-lock"></i> Unlock Form';
            saveBtn.classList.add('unlock-btn');
        }
        else {
            document.body.classList.remove('form-locked');
            var saveBtn = document.getElementById('saveBtn');
            saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Resume';
            saveBtn.classList.remove('unlock-btn');
        }
    };
    ResumeBuilder.prototype.addEducation = function () {
        var educationList = document.getElementById('educationList');
        var educationDiv = document.createElement('div');
        educationDiv.className = 'education-item';
        educationDiv.innerHTML = "\n            <input type=\"text\" placeholder=\"School Name\">\n            <input type=\"text\" placeholder=\"Degree\">\n            <input type=\"text\" placeholder=\"Year\">\n            <button onclick=\"this.parentElement.remove()\">Remove</button>\n        ";
        educationList === null || educationList === void 0 ? void 0 : educationList.appendChild(educationDiv);
    };
    ResumeBuilder.prototype.addExperience = function () {
        var experienceList = document.getElementById('experienceList');
        var experienceDiv = document.createElement('div');
        experienceDiv.className = 'experience-item';
        experienceDiv.innerHTML = "\n            <input type=\"text\" placeholder=\"Company\">\n            <input type=\"text\" placeholder=\"Position\">\n            <input type=\"text\" placeholder=\"Duration\">\n            <textarea placeholder=\"Description\"></textarea>\n            <button onclick=\"this.parentElement.remove()\">Remove</button>\n        ";
        experienceList === null || experienceList === void 0 ? void 0 : experienceList.appendChild(experienceDiv);
    };
    ResumeBuilder.prototype.addSkill = function () {
        var skillInput = document.getElementById('skillInput');
        var skillsList = document.getElementById('skillsList');
        if (skillInput.value.trim()) {
            var skillDiv_1 = document.createElement('div');
            skillDiv_1.className = 'skill-item';
            skillDiv_1.textContent = skillInput.value;
            skillDiv_1.onclick = function () { return skillDiv_1.remove(); };
            skillsList === null || skillsList === void 0 ? void 0 : skillsList.appendChild(skillDiv_1);
            this.skills.push(skillInput.value);
            skillInput.value = '';
        }
    };
    ResumeBuilder.prototype.collectEducationData = function () {
        var educationList = [];
        var educationItems = document.querySelectorAll('#educationList .education-item');
        educationItems.forEach(function (item) {
            var inputs = item.querySelectorAll('input');
            educationList.push({
                school: inputs[0].value,
                degree: inputs[1].value,
                year: inputs[2].value
            });
        });
        return educationList;
    };
    ResumeBuilder.prototype.collectExperienceData = function () {
        var experienceList = [];
        var experienceItems = document.querySelectorAll('#experienceList .experience-item');
        experienceItems.forEach(function (item) {
            var inputs = item.querySelectorAll('input');
            var description = item.querySelector('textarea');
            experienceList.push({
                company: inputs[0].value,
                position: inputs[1].value,
                duration: inputs[2].value,
                description: description.value
            });
        });
        return experienceList;
    };
    ResumeBuilder.prototype.saveResume = function () {
        this.isFormLocked = !this.isFormLocked;
        this.toggleFormFields(this.isFormLocked);
        if (this.isFormLocked) {
            var personalInfo = {
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value
            };
            // Collect all data
            this.educationList = this.collectEducationData();
            this.experienceList = this.collectExperienceData();
            var resumeData = {
                personalInfo: personalInfo,
                education: this.educationList,
                experience: this.experienceList,
                skills: this.skills
            };
            localStorage.setItem('resumeData', JSON.stringify(resumeData));
            this.showResumePreview(resumeData);
        }
    };
    ResumeBuilder.prototype.showResumePreview = function (data) {
        var previewWindow = window.open('', '_blank');
        if (!previewWindow)
            return;
        var previewHTML = "\n            <!DOCTYPE html>\n            <html>\n            <head>\n                <title>".concat(data.personalInfo.fullName, " - Resume</title>\n                <style>\n                    body {\n                        font-family: 'Arial', sans-serif;\n                        line-height: 1.6;\n                        max-width: 800px;\n                        margin: 40px auto;\n                        padding: 20px;\n                        background-color: #f8fafc;\n                    }\n                    .header {\n                        text-align: center;\n                        margin-bottom: 30px;\n                        padding-bottom: 20px;\n                        border-bottom: 2px solid #2563eb;\n                    }\n                    .section {\n                        margin-bottom: 25px;\n                        padding: 20px;\n                        background: white;\n                        border-radius: 8px;\n                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);\n                    }\n                    .section-title {\n                        color: #2563eb;\n                        margin-bottom: 15px;\n                    }\n                    .skill-tag {\n                        display: inline-block;\n                        background: #e9ecef;\n                        padding: 5px 10px;\n                        margin: 3px;\n                        border-radius: 15px;\n                        font-size: 14px;\n                    }\n                    .contact-info {\n                        margin: 10px 0;\n                    }\n                    .experience-item, .education-item {\n                        margin-bottom: 15px;\n                        padding-bottom: 15px;\n                        border-bottom: 1px solid #e5e7eb;\n                    }\n                    @media print {\n                        body {\n                            background: white;\n                        }\n                        .section {\n                            box-shadow: none;\n                            border: 1px solid #e5e7eb;\n                        }\n                    }\n                    .back-button {\n                        position: fixed;\n                        top: 20px;\n                        left: 20px;\n                        padding: 10px 20px;\n                        background-color: #2563eb;\n                        color: white;\n                        border: none;\n                        border-radius: 8px;\n                        cursor: pointer;\n                        font-size: 16px;\n                        transition: background-color 0.3s ease;\n                        display: flex;\n                        align-items: center;\n                        gap: 8px;\n                    }\n                    \n                    .back-button:hover {\n                        background-color: #1e40af;\n                    }\n                    \n                    @media print {\n                        .back-button {\n                            display: none;\n                        }\n                    }\n                </style>\n            </head>\n            <body>\n                <button class=\"back-button\" onclick=\"window.close()\">\n                    \u2190 Back to Editor\n                </button>\n                <div class=\"header\">\n                    <h1>").concat(data.personalInfo.fullName, "</h1>\n                    <div class=\"contact-info\">\n                        <p>\uD83D\uDCE7 ").concat(data.personalInfo.email, " | \uD83D\uDCDE ").concat(data.personalInfo.phone, "</p>\n                        <p>\uD83D\uDCCD ").concat(data.personalInfo.address, "</p>\n                    </div>\n                </div>\n\n                <div class=\"section\">\n                    <h2 class=\"section-title\">Education</h2>\n                    ").concat(data.education.map(function (edu) { return "\n                        <div class=\"education-item\">\n                            <h3>".concat(edu.degree, "</h3>\n                            <p>").concat(edu.school, "</p>\n                            <p>").concat(edu.year, "</p>\n                        </div>\n                    "); }).join(''), "\n                </div>\n\n                <div class=\"section\">\n                    <h2 class=\"section-title\">Experience</h2>\n                    ").concat(data.experience.map(function (exp) { return "\n                        <div class=\"experience-item\">\n                            <h3>".concat(exp.position, "</h3>\n                            <p><strong>").concat(exp.company, "</strong> | ").concat(exp.duration, "</p>\n                            <p>").concat(exp.description, "</p>\n                        </div>\n                    "); }).join(''), "\n                </div>\n\n                <div class=\"section\">\n                    <h2 class=\"section-title\">Skills</h2>\n                    <div>\n                        ").concat(data.skills.map(function (skill) { return "\n                            <span class=\"skill-tag\">".concat(skill, "</span>\n                        "); }).join(''), "\n                    </div>\n                </div>\n            </body>\n            </html>\n        ");
        previewWindow.document.write(previewHTML);
        previewWindow.document.close();
    };
    ResumeBuilder.prototype.loadSavedData = function () {
        var savedData = localStorage.getItem('resumeData');
        if (savedData) {
            var data = JSON.parse(savedData);
            // Populate fields with saved data
            Object.entries(data.personalInfo).forEach(function (_a) {
                var key = _a[0], value = _a[1];
                var element = document.getElementById(key);
                if (element)
                    element.value = value;
            });
            // Load other sections...
        }
    };
    ResumeBuilder.prototype.printResume = function () {
        window.print();
    };
    ResumeBuilder.prototype.initializeNavigation = function () {
        var _this = this;
        var navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(function (item) {
            item.addEventListener('click', function (e) {
                var section = e.currentTarget.dataset.section;
                if (section) {
                    _this.navigateToSection(section);
                }
            });
        });
        // Monitor scroll for section highlighting
        document.addEventListener('scroll', this.handleScroll.bind(this));
    };
    ResumeBuilder.prototype.navigateToSection = function (sectionId) {
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(function (item) {
            item.classList.remove('active');
        });
        // Add active class to clicked nav item
        var navItem = document.querySelector("[data-section=\"".concat(sectionId, "\"]"));
        navItem === null || navItem === void 0 ? void 0 : navItem.classList.add('active');
        // Scroll to section
        var section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
        this.currentSection = sectionId;
        this.updateProgress();
    };
    ResumeBuilder.prototype.handleScroll = function () {
        var _this = this;
        var sections = document.querySelectorAll('.section');
        var scrollPosition = window.scrollY;
        sections.forEach(function (section) {
            var sectionTop = section.offsetTop;
            var sectionHeight = section.clientHeight;
            if (scrollPosition >= sectionTop - 100 &&
                scrollPosition < sectionTop + sectionHeight - 100) {
                var sectionId = section.id;
                _this.highlightNavItem(sectionId);
            }
        });
    };
    ResumeBuilder.prototype.highlightNavItem = function (sectionId) {
        document.querySelectorAll('.nav-item').forEach(function (item) {
            item.classList.remove('active');
        });
        var activeNav = document.querySelector("[data-section=\"".concat(sectionId, "\"]"));
        activeNav === null || activeNav === void 0 ? void 0 : activeNav.classList.add('active');
    };
    ResumeBuilder.prototype.updateProgress = function () {
        var sections = ['personalInfo', 'education', 'experience', 'skills'];
        var currentIndex = sections.indexOf(this.currentSection);
        var progress = ((currentIndex + 1) / sections.length) * 100;
        var progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = "".concat(progress, "%");
        }
    };
    return ResumeBuilder;
}());
// Initialize the resume builder
new ResumeBuilder();
// Add these styles to your CSS
var styles = "\n.form-locked input:disabled,\n.form-locked textarea:disabled {\n    background-color: #f3f4f6;\n    cursor: not-allowed;\n    opacity: 0.7;\n}\n\n.unlock-btn {\n    background-color: #dc2626 !important;\n}\n\n.toast {\n    position: fixed;\n    bottom: 20px;\n    right: 20px;\n    padding: 12px 24px;\n    border-radius: 8px;\n    color: white;\n    display: flex;\n    align-items: center;\n    gap: 8px;\n    animation: slideIn 0.3s ease, slideOut 0.3s ease 2.7s;\n}\n\n.toast.success {\n    background-color: #22c55e;\n}\n\n@keyframes slideIn {\n    from {\n        transform: translateX(100%);\n        opacity: 0;\n    }\n    to {\n        transform: translateX(0);\n        opacity: 1;\n    }\n}\n\n@keyframes slideOut {\n    from {\n        transform: translateX(0);\n        opacity: 1;\n    }\n    to {\n        transform: translateX(100%);\n        opacity: 0;\n    }\n}\n";
