---
layout: blog
author: Phil
full-name: Phil Reynolds
short-title: ryalto--sdlc-controls
full-title: Ryalto Software Development Life Cycle Controls
summary: A response to a customer questionnaire about our software development process.
file-type: md
publish-date: May 29
publish-year: 2024
published: true
---

## Note
This was written for a customer questionnaire about our development process.

AMS asked for further information. The following prompt includes the question they asked

------

As part of a supplier compliance questionnaire we've been asked to answer the following question as part of a clarification.

"So, in the absence of this, please confirm and evidence the below at a minimum, as part of your SDLC controls:

- Conduct code reviews for vulnerabilities (e.g. DAST and SAST)
- Manage access to the source code
- Manage and ensure open source code is safe."

Please can you use the following information, to provide a really detailed answer. It needs to include information about what each of the named tools are and how they are used in the context of a ruby on rails application.

Automated code and dependency scanning using Brakeman, Dependabot, Bunder Audit, Rubocop including details of how these work for SAST.

AppCheck as automated penetration testing and vulnerability scanning for DAST.

Access to source code is managed via GitHub

------

**SDLC Controls Confirmation and Evidence:**

As part of our Software Development Life Cycle (SDLC) controls, we ensure the security and integrity of our Ruby on Rails applications through comprehensive processes and tools. Below, we confirm and provide evidence of our practices regarding code reviews for vulnerabilities, source code access management, and open source code safety.

1. **Conduct Code Reviews for Vulnerabilities (SAST and DAST):**

   a. **Static Application Security Testing (SAST):**

   We utilize several automated tools for Static Application Security Testing (SAST) to identify potential vulnerabilities in our Ruby on Rails applications during the development process. These tools analyze the source code for security flaws without executing the code. Our key SAST tools include:

    - **Brakeman:**
        - Brakeman is a static analysis tool specifically designed for Ruby on Rails applications. It scans the application's codebase to detect security vulnerabilities such as SQL injection, cross-site scripting (XSS), and other common Rails security issues.
        - **How it works:** Brakeman analyzes the Rails codebase and checks for patterns that indicate potential security risks. It inspects routes, controllers, views, and configuration files to identify unsafe code practices.
        - **Example:** Brakeman can detect if user input is directly used in a SQL query without proper sanitization, flagging it as a potential SQL injection vulnerability.
    - **Rubocop:**
        - Rubocop is a static code analyzer and formatter for Ruby. While primarily used for enforcing coding standards and style guidelines, it also includes security-related checks through plugins like Rubocop Security.
        - **How it works:** Rubocop scans the code for stylistic issues, potential bugs, and security vulnerabilities based on predefined rulesets. It integrates well with CI/CD pipelines to ensure code quality.
        - **Example:** Rubocop can identify the use of insecure cryptographic algorithms or detect methods that may introduce security risks.
    - **Bundler Audit:**
        - Bundler Audit is a tool that checks for known vulnerabilities in Ruby dependencies. It audits the project's Gemfile.lock for dependencies with known security advisories.
        - **How it works:** Bundler Audit cross-references the dependencies listed in the Gemfile.lock against a database of known vulnerabilities, such as those maintained by the Ruby Advisory Database.
        - **Example:** If a gem used in the project has a reported vulnerability, Bundler Audit will alert the developers to update or replace the affected gem.
    - **Dependabot:**
        - Dependabot is a dependency management tool that automatically scans for outdated dependencies and creates pull requests to update them. It includes security updates to address vulnerabilities in dependencies.
        - **How it works:** Dependabot periodically checks the project's dependencies for updates, including security patches. It generates pull requests with the necessary changes, allowing for easy integration of safe dependencies.
        - **Example:** If a dependency has a security update, Dependabot will create a pull request to update the dependency to the latest secure version.

   b. **Dynamic Application Security Testing (DAST):**

   We employ Dynamic Application Security Testing (DAST) to identify vulnerabilities in our applications during runtime. This approach tests the application in an operational state, simulating real-world attacks to uncover security weaknesses. Our primary DAST tool is:

    - **AppCheck:**
        - AppCheck is an automated penetration testing and vulnerability scanning tool that performs comprehensive security assessments of web applications.
        - **How it works:** AppCheck conducts scans by interacting with the live application, identifying security vulnerabilities such as XSS, SQL injection, and other web application vulnerabilities. It mimics the behavior of an attacker to find exploitable weaknesses.
        - **Example:** AppCheck can detect issues like cross-site scripting by injecting malicious scripts into input fields and observing the application's response.

2. **Manage Access to Source Code:**

   Access to our source code is strictly managed and controlled via GitHub, ensuring that only authorized personnel can access and modify the codebase. Our access management practices include:

    - **Role-Based Access Control (RBAC):**
        - We implement role-based access control to assign permissions based on the roles and responsibilities of team members. This ensures that individuals only have access to the repositories and branches necessary for their work.
    - **Two-Factor Authentication (2FA):**
        - We enforce two-factor authentication for all GitHub accounts, adding an extra layer of security to prevent unauthorized access.
    - **Protected Branches:**
        - Critical branches, such as the main and production branches, are protected. This means that direct commits are restricted, and changes must go through a pull request and review process.
    - **Code Reviews:**
        - All changes to the codebase are subject to mandatory code reviews. This practice ensures that code is reviewed by multiple team members before being merged, enhancing code quality and security.
    - **Audit Logs:**
        - GitHub provides audit logs that track all activities related to the repositories. We regularly review these logs to monitor access and identify any suspicious activities.

3. **Manage and Ensure Open Source Code is Safe:**

   We take several measures to ensure the safety of open source code used in our projects:

    - **Dependency Scanning and Management:**
        - As mentioned earlier, tools like Dependabot and Bundler Audit are used to monitor and update dependencies, ensuring that any vulnerabilities in third-party libraries are promptly addressed.
    - **Vulnerability Databases:**
        - We leverage vulnerability databases such as the Ruby Advisory Database to stay informed about known security issues in open source components.
    - **Code Reviews:**
        - Open source code contributions are subject to the same rigorous code review process as proprietary code. This includes reviewing the code for security issues and ensuring compliance with our coding standards.
    - **Security Patches:**
        - We promptly apply security patches to our open source dependencies and regularly review the security posture of these components as part of our maintenance process.

------

These practices demonstrate our commitment to maintaining a secure development environment and ensuring the integrity and safety of our Ruby on Rails applications throughout their lifecycle. If you require further details or specific examples of our implementations, please feel free to contact us.