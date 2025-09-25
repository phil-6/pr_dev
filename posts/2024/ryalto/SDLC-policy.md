---
layout: blog
author: Phil
full-name: Phil Reynolds
short-title: ryalto--sdlc-policy
full-title: Ryalto Software Development Life Cycle Policy
summary: A response to a customer questionnaire about our software development process.
file-type: md
publish-date: May 29
publish-year: 2024
published: true
---

## Note
This was written for a customer questionnaire about our development process

## Software Development Policy

### Overview

Our software development team is structured as follows:

- **Chief Technology Officer (CTO)**
- **Head of Software Engineering**
- **Front-End Team**:
    - Lead Engineer
    - Mid-Level Engineer
    - Junior Engineer
- **Back-End Team**:
    - Two Senior Engineers
    - Two Mid-Level Engineers
- **Dedicated QA Engineer**
- **Junior Developer** (focused on web front end and design)

### Development Approach

We adopt a Kanban-style development methodology, inspired by the Shape-Up approach created by 37 Signals. This methodology is thoroughly documented in the books "Getting Real" and "Shape Up." The Shape-Up approach emphasises defining clear project boundaries and ensuring disciplined execution within a set timeframe, while the Kanban method facilitates continuous delivery by visualising the workflow and limiting work-in-progress.

### Task and Roadmap Management

**Tools**: Our primary tool for task management and roadmap tracking is Jira.

#### Timeline View

The Timeline view in Jira is a critical component for managing our high-level product roadmap. It provides a visual representation of the entire project, showing the status and progress of various epics and their associated tasks. The Timeline view is collaboratively managed by the Head of Software Engineering, CTO, Head of Operations, and the Customer Success Team. This view helps in aligning all stakeholders on the progress and priority of features and tasks.

Key features of the Timeline view:

- **Epic Tracking**: Each epic represents a significant feature or a collection of related tasks. Epics are broken down into smaller, manageable issues.
- **Progress Monitoring**: The Timeline view allows us to monitor the progress of each epic and its related tasks, helping to ensure that deadlines are met and that any potential roadblocks are identified early.
- **Collaborative Planning**: The Timeline view is used during planning sessions to discuss and prioritize upcoming work. This collaborative approach ensures that the roadmap aligns with business objectives and customer needs.
- **Dependency Management**: It allows us to manage dependencies between different tasks and epics, ensuring that work is sequenced appropriately and that resources are allocated efficiently.

#### Board View

The Board view in Jira is used for day-to-day task management and execution. It provides a detailed and real-time view of the status of individual tasks and helps the development team stay organized and focused.

Key columns in the Board view:

1. **Future**: This column contains tasks that have been identified but are not yet ready for development. These tasks are essentially in the backlog, waiting for further refinement and prioritization.
2. **Next Up**: Tasks in this column are ready for immediate assignment and prioritization. These are the next set of tasks that developers will work on.
3. **In Progress**: Tasks move to this column when a developer starts working on them. This column provides visibility into what each team member is currently working on.
4. **Review**: Once a developer completes the code for a task, they create a pull request (PR). The task then moves to this column for peer review. A senior or peer engineer reviews the code to ensure it meets our quality standards.
5. **QA**: After the pull request is reviewed and approved, the code is merged into the main branch. This triggers an automatic deployment to our staging environment, and the task moves to QA for thorough testing.
6. **Deploy**: Upon passing QA, the task moves to this column, indicating it is ready for deployment to production. This status shows that the task has been validated and is awaiting a production release.
7. **Done**: Once the task is successfully deployed to production and is live, it is moved to the Done column, marking its completion.

### Task Assignment and Prioritization

- **Task Assignment**: The Head of Software Engineering assigns tasks to developers as they appear on the board. This assignment process is informed by the priority and complexity of tasks, as well as the current workload of each developer.
- **Prioritization Discussions**: The Head of Software Engineering holds regular discussions with each developer to review their assigned tasks and help prioritize their workload. These discussions ensure that developers are clear on which tasks are most critical and should be worked on next.
- **Developer Autonomy**: While the Head of Software Engineering provides guidance and prioritization, developers have the autonomy to decide which tasks to tackle next from their assigned tasks. This autonomy empowers developers to manage their workload effectively and take ownership of their work.

### Detailed Task Progression

1. **In Progress**: When a developer begins work on a task, they move it from "Next Up" to "In Progress". This indicates that the task is actively being worked on.
2. **Review**: Upon completing the code for a task, the developer creates a pull request. The task is then moved to the "Review" column. A peer or senior engineer reviews the code, ensuring it meets our quality standards and adheres to best practices.
3. **QA**: After the pull request is reviewed and approved, it is merged into the main branch. This triggers an automated deployment to our staging environment, and the task is passed to the QA engineer for thorough testing. The QA engineer tests the task to ensure it functions as expected and does not introduce new issues.
4. **Deploy**: Once the QA engineer validates the task, confirming it meets all requirements, the task moves to the "Deploy" column. This status indicates that the task is ready for deployment to the production environment.
5. **Done**: After the task is successfully deployed to production and is live, it is moved to the "Done" column, marking its completion.

### Testing and Deployment

- **Automated Testing**: We maintain a high standard of code quality with extensive automated testing, ensuring 95% line coverage through unit and integration tests.
- **System Tests**: Automated end-to-end system tests are conducted for key features to validate their functionality in real-world scenarios.
- **Continuous Integration (CI) and Continuous Deployment (CD)**:
    - All unit and integration tests must pass before any code is merged into the main branch.
    - CI/CD pipelines automatically deploy code to the staging environment upon merging.
    - Production deployments are manually triggered, typically occurring 2-3 times per week. This allows us to control the timing and ensure readiness for live deployment.

### Automations

Our Jira board is equipped with multiple automations to facilitate the workflow and ensure smooth task progression. These automations help in moving tasks between columns based on predefined triggers, such as the creation of a pull request or the completion of a review.

### Additional Resources

For detailed information on our task management and Jira workflows, please refer to the following documents:

- Developer Task Workflow
- Jira Workflow

For further assistance or clarification, please contact Phil Reynolds, the Head of Software Engineering.

### Contact Information

For any queries regarding this policy or its implementation, please reach out to:

- **Head of Software Engineering**
- **CTO**

This policy is designed to ensure a streamlined and efficient development process, fostering collaboration and maintaining high standards of code quality and delivery.