---
layout: blog
author: Phil
full-name: Phil Reynolds
short-title: ryalto--jira-workflow
full-title: Ryalto Jira Workflow
summary: A guide to our Jira workflow and how we use it to manage our development tasks.
file-type: md
publish-date: May 29
publish-year: 2024
published: true
---

# Jira Workflow

[24/05/22] We’ve just updated our Jira workflow to more closely match our real-world workflow. This document outlines the new process and who is responsible for each stage in the process. -PR

[13/05/23] I’ve updated this doc with some further details about how we use Jira as our main project management tool. We can reference this document alongside the [Developer Task Workflow](https://docs.google.com/document/d/1F5C-TvTiOXruPInJv47KHHQR28I8O-qpTjxjK6sXyUs/edit#heading=h.bikg4aaxtqd7) document which has a more developer focused version of this workflow. -PR

[22/03/24] Updated with new ticket labels, types and the change from “backlog” to “future”

## Diagram

This diagram is also available by going to the three dots on the top right of the RYAL board, then “Manage Workflow”

![jira-workflow.png](/assets/images/posts/2024/jira-workflow.png)

### Tickets

Note: Tickets are referred to as “Tasks” or “Issues” fairly interchangeably.

There are several areas of a ticket that need to be added when creating a ticket. These help developers know what they’re working on, they are also important to help non developers understand the ticket and are used for reporting.

### **Epic**

Each ticket should belong to an epic.

### **Details**

A ticket should have a short, descriptive title. The title should be a 1-liner which could summarise the task as a whole. Jira calls the title the “Summary”

If needed (and if possible) a description should be added with further details to ensure that what the developer builds is what was intended.

### **Types**

There are 7 types of tickets.

- Task
- Epic
- Flutter Bug
- Rails Bug
- Rails Task
- Flutter Task
- Design Task

PR: Please let me know if we need an explanation here of any of the types, I hope they’re fairly self explanatory.

### **Labels**

Tickets should all also be labelled. The labels help apply filters for reporting and observability

- **Feature:** If a ticket adds or changes a piece of Ryalto functionality.
- **UI-Changes**: If the task alters part of the user interface.
- **Fix**: A bug fix - this is optional if the Issue Type is “bug”.
- **Maintenance**: Not a feature, or a bug fix but a task that is maintaining the app.
- **Refactor**: Refactoring code without any functional changes.
- **Testing**: Adding or improving automated tests.
- **Dependency-Updates**: A task to update a dependency.



There are also additional labels for the area of the app that the task relates to, such as **Chat**, **News-Feed**, **Admin**, and **Work-Logs.**

Finally there are labels for features that have been requested by a specific client; **Bristol-Ambulance**, **Cloud4**



Note: We are no longer using the “Rails”, “Flutter”, “V3” and “V4” tags.

## Ticket Views

### **Board**

The board is used to see what is being worked on at the moment and used to plan the next tasks for developers. You can filter the board by a specific developer or tags on tickets. Further details of the task process are below.



The board is expected to be the default view for Ryalto developers, by filtering it down to tickets assigned to you, or using the Rails / Flutter label, you should be able to see what work you have in progress, and what you have lined up next

### **Timeline**

One of the views in Jira that I find most useful is the Timeline view.

The Timeline is used to plan development work from next month for onwards.

This view shows the “Epics'' that have been created to manage the various phases of development of larger projects. Each epic is intended to be a deliverable project related to a specific area of the application. The roadmap view allows you to easily see the progression through each of the epics, which epics are in progress and planned next while also allowing you to dive into the epics and see the individual tasks which they contain.

By zooming out, either by moving from “Months” to “Quarters” or entering “Full Screen” in the bottom right, you can see the planned development focus for the next 6-12 months.



Note: Timeline used to be called “Roadmap”

### **Filters**

From the top menu you can access saved, shared ticket filters.

## Task Process

### **Before Assignment**

Before a ticket has been assigned to a developer it lives in the Backlog pile.

The backlog section shows you all tickets, grouped by “Board” and “Backlog”. All tickets in the “Backlog” section should have the status of “Future” and not be assigned to a developer. It is important to note that these tickets do not appear on the board. Tickets will automatically move to the board when they are assigned to a developer.

#### Ownership

The Product Owner looks after the "Backlog" before tickets get to the board. They organise this by priority and ensure that there is a good amount of information on the ticket before it gets moved to the board for developers.

The “Product Owner” is Gary, Emma and Phil

### **On The Board - Future and Next Up**

“Future” and “Next Up” are the To-Do statuses.

When a ticket from the backlog is assigned to a developer it will be automatically moved to the board.

The Engineering Manager works with each developer to assign and prioritise their upcoming tasks. Ideally, there shouldn’t be more than one or two tickets per developer in the Next Up status. When a developer finishes work on their current ticket, they can grab another one from Next Up.

The “Engineering Manager” is Phil

### **In Progress**

When a developer starts working on a ticket they should move it to “In Progress”. Ideally, a developer should only have one or two tickets in progress at once. These are the tickets that they should be providing daily updates on in standup.

### **Code Review**

When a developer finishes work on a ticket, they create a pull request to allow their code to be peer reviewed. After the PR is approved, it gets merged, deployed to the demo environment and moved to the QA status.

Before the QA team begins their review, the developer should update the ticket with details of the changes and ensure that the ticket has enough information for the QA team.

### **QA**

The QA team checks that the changes work. Identify any additional bugs that may have been created and that the changes actually address what the ticket described.

More details can be found in the [New QA Process](https://docs.google.com/document/d/1Kpd3mfvW-JUz5RQrAaFd9UdRb8c8lcNke7Isbb4SQC8/edit#heading=h.sa5j2975tmn7) document.

### **Deploy**

When QA are happy, they move the ticket to Deploy. The tickets in this status column are ready to go but not live yet.

The CTO gives a green light for a ticket to be deployed to production by reviewing the ticket’s in the deploy column and tagging them as “ready to deploy”.

### **Done**

When a ticket is deployed to production it is done. It moves to this column and is archived in peace.

### **Blocked / Info Needed**

If work pauses on a ticket, whether a blocking issue has been encountered or more information about the requirements is needed, it gets moved into this status column to be discussed. Tickets in this status have pending problems which need to be resolved. If there is another task which needs to be completed first, then a new ticket should be created for that task and linked as a blocking issue, then this issue can be moved back to the backlog.

### **Closed / Won’t Do**

Requirements change. Sometimes a ticket is no longer needed. This status column is the figurative bin.
