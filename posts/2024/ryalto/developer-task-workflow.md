---
layout: blog
author: Phil
full-name: Phil Reynolds
short-title: ryalto--developer-task-workflow
full-title: Ryalto Developer Task Workflow
summary: A guide to the standard workflow for completing development tasks at Ryalto.
file-type: md
publish-date: May 29
publish-year: 2024
published: true
---

# Developer Task Workflow

This document walks though the standard workflow for completing tasks that our developers should* follow on a daily basis. From picking a task from their backlog to merging their code into the main codebase.

*This isn’t always going to be the case, but this aims to set out the best practice for effective collaboration as our team grows and we have more people contributing to our codebases.

## Tasks on Jira

We use Jira for managing our development tasks. We have a [Jira Workflow](https://docs.google.com/document/d/1Xh_GPDy2iREZCShjtdA6XCcBh1LMsR2168fqQtjj0hI/edit#heading=h.4lglz8z6ubqu) doc which goes into a bit more detail about the workflow on Jira.

### **How big is a task?**

Generally, a task on JIra should be about 2-days of work - sometimes a bit more, sometimes a bit less.

A Task should be a clearly discrete packet of work, as close to an atomic task as possible. An atomic task is one that cannot be broken down any further!

### **Creating a Task**

When creating a new Task, ensure that it is tagged with the version of the app it relates to (V3 or V4), whether it is frontend or backend (Rails or Flutter), and the area of the app that it’s related to.

**Important:**
If your task involves UI changes, make sure to assign it the UI-Changes label.

### **Choosing a Task**

It’s easiest to start from the [Jira Board](https://ryaltogroup.atlassian.net/jira/software/projects/RYAL/boards/2). The board is designed to be each developer's standard view.

You can filter the board to only show tickets assigned to you by clicking on your profile picture next to the search box.

Normally, each developer should have a couple of tickets in the “Next Up” column, and a couple in the “Backlog” column. The project manager or product owner (in an ideal world, at the moment it’s just Phil) will arrange these columns by priority, with the top of the column being higher priority.

This is only a rough guide though. If you want to pick up a ticket that isn’t right at the top, but is on the board, then that’s fine. If you’re unsure, ask about it.

In the same vein, tickets in “Next Up” should generally be worked on before tickets in “Backlog”. If there’s something in “Backlog” that you want to pick up first - double check, but 9 times out of 10, there won’t be any issues with that.

### **Lacking Details?**

If you feel as though a ticket that is assigned to you is missing details, then it can be moved to “Blocked / Info Needed”. Add a comment to the ticket to explain what the problem is, and the ticket creator should jump in to discuss.

### **Task Too Big?**

If you think a task is going to take substantially more than 2 days worth of work to complete, you can either:

- Work with the ticket creator to split the ticket into smaller tasks with new tickets; or:
- Break the work into smaller pull requests under the same task name.

We should be looking to create a pull request 2-3 times a week, even if there are multiple pull requests for a single task. More information about pull requests will follow.

## **Coding and Collaborating (with Git and GitHub)**

We use Git for version control. Our code is hosted on GitHub, which is where we manage our code repositories and collaborative code reviews.

There are *loads* of resources available that explain what Git is. If you’re not familiar with the *what* or *why* of Git, then have a quick glance through [this tutorial from Atlassian](https://www.atlassian.com/git/tutorials/what-is-git) or [this one from GitHub](https://docs.github.com/en/get-started/using-git/about-git). There are loads of other easily searchable explanations too.

If you need help figuring out the initial setup of our GitHub repository, reach out to one of the team and we’ll be happy to help.

Whether you want to use a Git GUI tool (such as the one built into RubyMIne) or the Git CLI is entirely up to you. Personally, I use the CLI for most of my tasks and use the GUI for slightly more complex tasks such as cherry picking, interactive rebasing, and merge conflicts.

Information about other Git GUI tools is available [here](https://docs.google.com/document/d/1F5C-TvTiOXruPInJv47KHHQR28I8O-qpTjxjK6sXyUs/edit#heading=h.hzcibeihfpac).

### **Starting a task - Creating a branch**

When you start work on a new task, you should first checkout to the main branch and ensure that you’re locally up to date:

```zsh
git checkout main 
git pull 
```

You’ll then want to create a new branch for your task. The branch name should start with the ticket ID, followed by a short description of the ticket. Check out some old branches for examples.

`git checkout -b RYAL-2432-Add-some-extra-functionality`

(the -b flag creates a new branch and switches to it)

You can also click on the Create Branch button inside the Jira ticket, which will automatically do the naming for you in the selected repository.

### **Committing progress**

As you start working on an issue, you should commit your progress. We recommend you commit whenever you get to a point you might want to be able to revert to in the future. One way to think about it would be to make a commit whenever you would hit CTRL + S when working on an essay (or when you’d create a save file in a video game!).

Normally, you would stage the changes you want to commit with:

`git add /path/to/file`

This means that you don’t have to commit all your changed files at once.

The next step is to commit those changes with:

```zsh
git commit -m "sensible messages about the changes"
```



We don’t have any recommendations for commit messages while working on a branch. These commits are ephemeral, as we merge pull requests by squashing. That being said, the commit messages should form part of the story that your pull request tells.

When you’ve finished working on a ticket:

- Test that the changes you’ve made are working locally
- Run any applicable tests and code quality checks (e.g. rubocop)
- Push your changes to GitHub

You’ll then have an opportunity to create a pull request.

### **Finishing a task - Creating a pull request**

When you’re happy that your task is complete, and you’ve pushed your branch to GitHub, head over to the repo on GitHub. If you’ve pushed recently, there should be a banner which lets you “Create a Pull Request”.

Alternatively:

1. Click the **branches** button from the repository main page
2. From the list of branches, find the section labeled **Your Branches**
3. Pick the right branch by name from the list, or use **Search**
4. Click the **New pull request** button next to the branch name.

Your pull request description should tell the story of your code changes and how it solves the ticket, as well as:

- Include screenshots if there are any user interface changes. This is especially important for our customer success team and would help them a great deal!
- Highlight any code sections you would like your reviewers to look at. This could be code you’re particularly proud of, or code you have questions about.

Your pull request description is important because it will end up linked in the permanent Git commit history. It is easily editable, but only until the PR is merged.

There are lots of good resources out there for how to write good pull requests if you want some extra ideas.

### **Reviewing Pull Requests**

When reviewing a pull request, you should read through all the code changes.

You're looking to ensure that all the changes make sense, and that there aren’t any obvious errors, improvements or optimisations.

You should also check that you understand all of the code. Don’t be afraid to ask questions about specific approaches, or comment on code which could be clearer. PRs are also a great way to learn from each other.

If the PR is anything other than a really small change, you should also pull the code branch and check everything is working locally before approving it:

``` zsh
git checkout main
git pull
git checklout RYAL-2432
```

This is a little bit of QA work, but it is important that developers do this as well as the QA team.

### **Merging code - Squash Merging**

When your pull request is approved, all the tests have passed, and other CI checks have gone green, select the **Squash and merge** option when merging your PR.

Ensure that the title of the merge commit includes the ticket ID from JIRA and a short description. Add a longer summary of the code changes in the second box, and merge away.

This will trigger a deployment to the Demo environment. Ensure that the ticket has a complete and up to date description with enough information for the QA team. Check the changes are working as expected on Demo, and move the ticket to QA on JIRA.

## **GUI tools for working with Git**

If you don’t want to use the Git command line to handle the version control, you can opt to use one of the available GUI tools instead.

Each tool offers a different level of support for the various Git commands. Not all tools provide a GUI equivalent for every command otherwise available through the CLI.

Fork, GitHub Desktop and SourceTree are worth investigating.

## **Questions?**

If you have any questions about anything, or if there is anything you’re uncertain about, please ask the questions!

If requested I can add more info on checking out other branches, stashing changes or merge conflicts then let me know.