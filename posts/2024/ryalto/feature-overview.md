---
layout: blog
author: Phil
full-name: Phil Reynolds
short-title: ryalto--feature-overview
full-title: Ryalto V4 Feature Overview
summary: A high level overview of Ryalto V4 features and changes from V3.
file-type: md
publish-date: April 5
publish-year: 2024
published: true
---

Note: 
This is a rough summary of all the features that my Team and I built into Ryalto V4

---

# Ryalto V4 Feature Overview

This document outlines the features of Ryalto V4 and initial changes from V3. It gives a high level overview of what Ryalto V4 does and what is coming soon.
[PR 13/03/24] This is a living document, please comment if you notice anything missing or incorrect.

# **Overview**

V4 is a fundamental overhaul of how the platform works in terms of its development, functionality and user experience.

Details for important changes and features are outlined in relevant sections below.

# **New Terms in V4**

### **Membership**

A user can be part of one or many organisations. We call this relationship between a user and an organisation a “membership”. We avoid using the term “membership” in the app as it could be confusing to users. A user can also be part of a site, and a department. We use the word membership here as well.

### **Audience**

An Audience is a selection of users who can be grouped together to receive some information. News Feed Articles and Announcements can be shared to audiences. An audience is made up of either the entire organisation or a selection of sites and departments.

We are going to be adding further audience controls in the future, in terms of the way to scope the users in an audience and things to be shared with an audience.

### **Interaction**

When a user views an “interactable” object, an interaction is created. This allows us to track view counts and allows the user to react.

“Interactable” objects are Chat Messages, Announcements, News Feed Articles and News Feed Article Comments. We’re likely to add more in future.

# **User Authentication**

Each user has a single login for Ryalto V4. This login works for the mobile app, the web app, all of the user’s organisations, and any admin roles they have within those organisations.

Ryalto V4 is accessible from a single URL: [https://ryalto.app](https://ryalto.app/) . In contrast, past versions of Ryalto used 4 different URLs.

## **Sign Up**

TODO: Add details about sign up process, including the process for signing up following an organisation invitation.

## **Resend Email Confirmation**

If a user doesn’t receive the email to confirm their account, a new email can be sent to them from the following url:

https://ryalto.app/users/confirmation/new

# **App / Web Feature parity**

All features are available on both the web app and the mobile app, unless noted otherwise.

**Important exception:** All admin features are only available on the web.

# **Organisation and User overview**

In Ryalto V4, a user’s account is independent of any Organisations that they are part of.

A User can:

- Be part of one or many Organisations.
- Easily switch between each of their Organisations.

All content, with the exception of notifications, is scoped to the organisation and will change when the user switches organisation.

A user’s relationship with an organisation is stored as an **Organisation Membership**. The Organisation membership also stores additional information, such as admin rights, employee number, compliance information and more.

A user’s Organisation Membership can be in one of four states: **Invited**, **Unverified**, **Active**, or **Suspended**. Only Active users can switch to the respective Organisation and perform actions.

The Organisation they are currently switched to is called the **Current** Organisation.

### **Unverified (Requested)**

A User can request to join an Organisation, provided the Organisation has enabled this setting, at which point their Organisation Membership is put into the Unverified state.

This sends an email to the Organisation Admins. Users must be verified by an Organisation Admin before they can join.

The Organisation can enable Auto Verification, in which case the User is automatically verified when they confirm an email address with a matching domain.

If an organisation has enabled user requests and does not require an email address, then it will be available for users to request to join when they sign up to Ryalto. This request will need to be verified by an Organisation Admin as above.

### **Invited**

Admins of an Organisation can invite a User to join it. At this point, the User’s Organisation Membership is put into the Invited state.

Their membership will be automatically verified when the invitation is accepted by an authorised User.

If the User does not yet have a Ryalto account, they must sign up using a unique link included in the invitation email, and confirm their email address.

### **Active**

Once a User is verified, or once they successfully accept the invitation, their Organisation Membership is moved to the Active state. It cannot return to the previous two states.

This is the standard state for users in an organisation.

### **Suspended**

Active Users may be suspended from an Organisation. This action is reversible.

If the Organisation requires a verified Organisation email address, the User’s Organisation Membership will be suspended until they have re-confirmed this address.

Suspended users cannot switch to the organisation, or perform actions in the organisation. When a user is suspended from their current organisation, they will be automatically switched to another organisation in which they are active. Suspended users are not considered part of the organisation for analytics. This is the state of user’s who have left an organisation.

## **Sites and Departments**

Each Organisation can have one or more Sites, and a Site can have one or many Departments.

A site is intended to be a physical location where an organisation operates, such as a hospital. Departments are areas of work within that site.

Users of an Organisation can be in one or more Sites within it. They can also be in multiple Departments within each Site.

A User can therefore hold multiple roles. For example:

At a small organisation, a User might be both a doctor and a shift admin; so they can create and manage shifts and also sign up to shifts. A nurse who works in a vaccination centre could also work as a receptionist in a hospital.

## **Categories, Levels and Roles**

There are several additional ways of grouping users in Ryalto. In each organisation, a User can have a Category, and a Level within that category. Within each department that a User is part of, they can also have a Role.

### **Categories**

A user’s category is their job type. A user can only have one category in each organisation they work for.

E.G. Doctor, Nurse, Admin, Management, Customer Success, Developer.

### **Level Type**

Each category also has a **Level Type** that corresponds to the pay level system that it uses, the default value is “Level” but can be replaced with “Grade”, “Band”, “Rank”, “Point” or anything else.

### **Level**

A user’s level is their seniority within their category. The levels are easily configurable within a category.

#### **Examples**

Customer Success Category: Associate < Executive < Specialist < Manager < Senior Manager < Director < Head of Customer Success

Engineering: Intern < Junior < Developer < Senior < Lead < Manager < Head of Engineering

### **Role**

Within each department that a user is part of they can have a Role. This is the job function they do within that department. User Department Roles are configured at the organisation level, so each organisation can have a single list of roles. A user can have multiple roles within an organisation, but only one for each department that they are part of.

## **The “Ryalto” Organisation**

All Ryalto V4 users are members of a default organisation called “Ryalto”:

- Directory and Chat are disabled in this organisation.
- The News Feed allows Ryalto Staff to publish articles to all users on the app.
- Ryalto Staff can access global analytics for all users on the platform from this Organisation.

## **Global Admin user type (Ryalto Staff)**

Global Admins are a special User type reserved only for Ryalto Staff members.

Unlike other types of Users, Global Admins can:

- Request to join any Organisation and then switch to it without approval.
- Create new Organisations from the Settings page.
- Act as Admins in each Organisation they switch to. They can complete Admin functions to support our other Admin users.
- Enable and disable application features from the Organisation admin page.
- Access additional details about a User of an Organisation on that User’s profile, such as their account email address.

Global Admins do not appear in any directories, user tables, or user search. Organisation Admins cannot see Global Admins in their dashboard, and Users of that Organisation cannot create a chat with a Global Admin. You’re a stealthy super-ninja!

## **New User Flow**

The diagram below shows the different ways a new user can join Ryalto.


![ryalto-new-user-flow.png](/assets/images/posts/2024/ryalto-new-user-flow.png)

# **News Feed**

A User’s news feed is made up of articles shared with their Organisation, Sites, Departments, Roles and Category.

The News Feed is tailored to each User based on their **Audience**. Further details on what an Audience is are found [here](https://docs.google.com/document/d/1iLJcHNieJ9V4VJpbdnhvYAl8Lp9yzls8refuotIIh88/edit#heading=h.o6how0g649ov).

### **View News Feed**

The News Feed is sorted into categories and can be searched. From here, a User can see:

- The number of new and unread articles
- The number of articles posted recently
- A separate tab for their bookmarked articles

The following is visible to the User for each Article:

- The article image, title, and description
- A time estimate for how long it should take them to read
- The number of reactions and comments
- The article’s author
- The date when the article was posted

### **View News Feed Article**

Allows the User to read an article.

### **React to Article**

The User can react to an article and see a list of other reactions and who made them. There are 4 available reactions for articles and article comments.

### **Comment on Article**

The User can add a comment that appears under the article. Comments can be left in reply to another comment. Comments can be deleted by News Feed admins and edited and deleted by the User who posted the comment.

### **React to a Comment**

A User can react to any comment and see a list of other reactions.

### **Bookmark Article**

The User can bookmark an article. Bookmarked articles appear in a separate list.

### **Share News Feed Article**

If an admin has allowed it, a User can get a public shareable link to an article.

# **Chat**

### **View All Chats**

A User can see all chats that they are part of, sorted by the chat which has the most recent activity. The chat with the most recent activity will open by default.

Users can:

- Search their chats using a button at the top of the chat list
- Create a new chat using a link at the top of the chat list
- See when they last viewed a chat, and when the last message was received
- See who sent the last message and the first part of that message

Chats can have announcements. The most recent announcement is pinned to the top of the chat list. If the User is an announcement admin, they can see a button to manage announcements.

### **View Chat**

Users can see a list of the messages in the chat, as well as the participants in the chat.

Users can send written messages, attach images, and send voice notes.

On the mobile app, the user can send a gif.

New messages will automatically appear in the chat.

The user can react and reply to messages. Message reactions can be any emoji.

Users can see a list of users in the chat.

The chat image in an individual chat should be the image of the other person.

Any user can create a chat with another user. If they try to create an individual chat with another user and that chat already exists, they’ll be redirected to the existing chat. Users can search and filter for other users on the create chat screen.

Users can pin a message in a chat, or a group chat. This message is bookmarked at the top of the chat window and can be clicked to bring the user’s view in the chat up to where the pinned message was posted. There is one pinned message in each chat shared by all chat users.

### **Group Chats**

Any User can create a group chat. The User who creates the chat is an admin and the creator. When creating a group chat a user can look through pages of fellow Ryalto users or search for them amongst the list to choose exactly whom they wish to connect with.

Group chats can have one or more admins.

Admins can add and remove Users.

Admins can add and remove other admins, but they cannot remove the chat creator.

Admins can update the group picture.

### **Public Chats**

When public chats are enabled for the organisation, the user has the option of creating a public chat. A public chat can be created with or without participants (in addition to the creator) present. A public chat has a title and a description and is displayed in the public chat menu. If a user is a part of a public chat it appears in their index, else when entering the public chat menu they will be able to see the titles and descriptions of all public chats in their organisations; the user can join public chats on this screen. Public chats have a label marking them as such in a user’s chat index.

Public chats can be disabled by the creator and organisation admins. Organisation admins can also mark a public chat as ‘Featured’.

When organisation admins join a public chat they will become an admin for the chat. If enabled, a notification to organisation admins is sent when public chats are created.

# **Calls**

A User can initiate a voice or video call with another User. They can do so from the directory, the User profile, or an existing chat.

Users will receive an incoming call notification as long as they are not on another call.

Users will receive a missed call notification if they do not answer the call before the call ends.

Call History can be seen on the web app in the chat section. At present it cannot be found in the mobile app. It displays who calls were with, the time on the call, and if the call was answered. **Important exception:** At present, calls are only available on the mobile app.

# **Announcements**

Users can view a list of announcements. Announcements appear in the chat window and are similar to chats. The User only sees announcements that they are in the audience for.

When creating an announcement a user can search for specific sites or select them manually from a list. The list also displays which departments are included in each site.

# **Directory**

Users can view a list of other Users in their organisation.

Users can filter the directory based on the User type, category, sites and departments.

Users can search the directory.

Users can navigate from a User card in the directory to that User’s profile or their chat.

A User may be hidden from the Directory by an Admin.

# **Notifications**

Users receive notifications for a variety of reasons.

Most notifications are delivered to the Android and iOS apps. They are stored in the database, so the User can view them later in the notification history.

Calls and Chat Message notifications won’t show up in the notification history.

### **Notification Index**

The notification list shows all historic notifications across all of the User’s organisations.

Each notification shows the type of notification, the Organisation it came from, and when it was sent.

If the organisation is not the user’s current organisation, the notification will have a button to switch to that organisation.

If it is the user’s current organisation, there will be a button to take the user to the item that the notification is about, for example a “View Article” button for a News Article notification.

Clicking the button on the notification will mark the notification as read.

The user can also mark multiple notifications, or all notifications as read.

The user can selectively mark notifications as unread to save them for later.

The user can also filter the notification index.

# **User Profile & Settings**

### **User Profile**

The user can view their own profile and the profile of any other user that they share an organisation with.

On their profile they can see details about their account, and the organisations that they are part of. They can also access quick links to edit their profile and their settings page.

If they are viewing a user, who is part of an organisation where they are an admin, they can perform quick user management actions.

### **Settings**

The user’s settings page is where they can see details about their current organisation, sites and departments. Switch or request to join organisations, and request to join new sites and departments.

# **Switch Organisation**

A user can be part of multiple organisations in Ryalto V4.

A user can easily switch between organisations from the switch organisation menu, their user profile or the settings page.

# **Other**

## **Help and Support**

A user can create a ticket with our support team directly in the app.

## **FAQs**

Users can read FAQs about how to use the app.

FAQs can be created and updated by global admins

# **Admin**

There are various different admin types in Ryalto. A user can have one or many of the admin permissions. For a more detailed explanation of the different admin types, please refer to the [Admins in Ryalto V4](https://docs.google.com/document/d/1DTIlYITGNo6WlZ_h0-95ucpnVvHoLEXCjj1V6zgsCnY/edit?usp=sharing) document.

## **User Membership**

A user can be a member of one or many organisations, sites and departments.

Please see the [Organisation and User Overview](https://docs.google.com/document/d/1iLJcHNieJ9V4VJpbdnhvYAl8Lp9yzls8refuotIIh88/edit#heading=h.nalu88l64x7o) section for more details

## **Organisation Administration**

### **Invite Users to Organisation**

An organisation admin can invite a single user to an organisation, this creates their organisation membership with category, level and other details. Then it will send an email to the user to invite them to the organisation.

Upload a CSV of users to their organisation. This will create an organisation membership and send an email invite to the user.

The email invite contains a unique sign up link for new users to Ryalto to create their Ryalto account with. Once the user has created their account with this link, and confirmed their email address they will be a confirmed user in the organisation.

Existing users of Ryalto must log in to their account on the web and then click a unique link in the invite link to accept the invitation.

An admin can see a list of invited users and resend or cancel the invites if needed.

### **Verify Users**

Admin can see the list of users who have requested to join their organisation. They can verify or reject individual users or in batches with a multi select. When rejecting users they can provide a rejection reason which will be provided to the user.

### **Admin and Active Users**

An organisation admin can see a list of admin users, and a list of active users in their organisation. They can easily give and remove admin user rights from users.

They can suspend active users.

From the user table, they can visit the user’s profile.

### **Disabled / Suspended users**

Admins can see a list of disabled users and re-enable them.

### **Settings**

An admin can manage the organisation settings. Settings include:

#### **General Settings**

| **Setting**           | **Description**                                              |
| --------------------- | ------------------------------------------------------------ |
| **Navigation Links**  | Change which links are available in the Navigation Bar (e.g. News, Chat). |
| **Add Categories**    | Add new categories for Organisation members.                 |
| **Update Categories** | Update an existing user category.                            |

#### **User Settings**

| **Setting**           | **Description**                                              |
| --------------------- | ------------------------------------------------------------ |
| **Requests**          | Set whether the Organisation is publicly visible for joining requests. |
| **Emails**            | Appears when Requests are Active. Choose whether to require users to provide an Organisation email address with their request. |
| **Auto Verification** | Appears when Requests are Active. Choose whether to automatically verify users whose confirmed email address matches the Organisation domain. |
| **Video Calls**       | Choose whether to allow users to video call each other on the mobile app. |
| **Screenshots**       | Choose whether to allow users to take screenshots of the mobile app. Useful to prevent potential leaks of sensitive data via screenshots. |

#### **Branding Settings**

| **Setting**     | **Description**                                              |
| --------------- | ------------------------------------------------------------ |
| **Logo**        | Upload an Organisation logo, which will replace the Ryalto logo in the top navigation bar. |
| **Theme Color** | Change the Organisation color, which will replace the default Ryalto blue color in some areas of the app. |

#### **Global Admin Settings**

The following settings are only available to the Global Admin role:

| **Setting**                     | **Description**                                              |
| ------------------------------- | ------------------------------------------------------------ |
| **Change Organisation Details** | Change the Organisation Name, External ID, External Reference, and External Link. |
| **External API Key**            | An option to re-generate the API token.                      |
| **Set up external helpdesk**    | Provide the API key and URL for an external helpdesk, please see below |



### **Site and Department Management**

An organisation admin can create sites and departments and act as a site and department admin for all sites and departments in their organisation.

Please refer to the [Admins in Ryalto V4](https://docs.google.com/document/d/1DTIlYITGNo6WlZ_h0-95ucpnVvHoLEXCjj1V6zgsCnY/edit?usp=sharing) document for further information

# **Dashboard**

Currently the dashboard shows some information to organisation admins. Further information is coming soon.

# **Surveys**

Surveys can be created by designated survey admins. These surveys can be created at whatever length is required with a wide range of question types. These question types are: text questions, a single answer selected from a list, multiple answers selected from a list, a likert scale, and a smile rating scale. Questions can also be marked as required or optional if applicable, and a question description may be given. Custom routing can be added to single choice questions so that some questions can be skipped based on answers given.

Surveys can be drafted and scheduled with a publish date - Upon reaching this date the survey will be automatically published for access, but it can be published early via a button - they also can be given a set date to expire. A survey admin can choose if a notification should be sent for the completion of the survey, also reminders can be set to be sent as additional notification; reminders will only be sent to users who have not yet completed the survey in question. Surveys can be published to organisations as a whole or to individual sites and departments as desired.

Surveys can be answered on the web or mobile applications. Surveys do not have to be completed in one sitting and the Ryalto app will save a user's progress if they leave the survey unfinished. In survey questions it is made clear to users that they will not be able to return to previous questions after submitting their answers. Surveys are filtered as ‘Available’, ‘In Progress’, and ‘Completed. In the ‘Completed’ section a user is able to view their completed surveys, but at this time they are not able to view their previous answers.

Results can be viewed in the app or exported as a .csv. At this time all survey submissions are anonymous. The results page in Ryalto app provides an overview of the survey as a whole, with some generated diagrams and tables, and more specific data can be found for each question.

# **Events**

The events screen presents as a calendar with events displayed as clickable links therein. In the Events Administration screen, users who are registered as events administrators can create events; events may have a title, a description, a location, and an external link. Admins can set events to have a certain number of available spaces, can set which sites and departments are offered the event, and can set a start and end time for it.

When a user clicks an event in the calendar they can see all the information set above, as well as how many spaces left and a list of the current attendees. There is a button available for them to book a space in the event.

# **Work Logs**

Work logs can be enabled by Organisation admins and they can be accessed via the side navbar or they can be assigned a place as one of the four navigation links displayed at the top of the screen.

A work log can be created, with a start date at the earliest one week before the current date, and with estimated start and end dates if required for future work. Work logs can be attributed to a specific department, at which point they will also appear in the department work log screen available for department admins.

Work logs can also be assigned notes and if a department is selected then a work partner from the same department can be selected to be assigned to the work logs. Both the creator and work partner can edit a work order

Work logs are displayed in three categories: those which are currently in progress, those that were completed within the past seven days, and those that are older, which are marked as archived. If a work log is in progress there is a button to make it as finished, without the user needing to go in and set the finish time to the current time. If there is a work partner they can also perform this action. Ending a work log does so for all parties.

# **Help & Support**

Ryalto has FAQs and support desk integrations to allow users to find help when they need it.

## **FAQs**

Global and Organisation Admins can create FAQs. Global FAQs are visible to all users, Organisation FAQs are scoped to the user’s current organisation. Global FAQs are visible to users that have not logged in.

FAQ answers can have rich tech including embedded links.

FAQs can be associated with one or many topics, the user sees FAQs grouped by topic and can filter by topic. FAQs are also searchable by the question and the content of the answer.

If the user cannot find the answer they’re looking for in our FAQs they can contact support.

## **Help & Support Integrations**

By default, all support queries are sent to our Zendesk via an API connection.

The help and support form will prefill the user’s name and email address if they’re logged in. When logged in we also send additional information about the user who has submitted the form, such as their user ID and a link to their profile.

The form allows users to give their support query a subject and more detail in a message.

The form also allows users to select a category for their query. The available categories are configurable by global and organisation admins.

Organisation specific categories can be used to route the support query to an organisation’s own service desk. This requires additional configuration and currently only Freshdesk is supported as an external helpdesk.

Once the support ticket has been submitted, the rest of the support conversation will take place by email, we do not log support tickets in the app or display responses from support staff in the app.

# **Shifts and E-Learning**

Currently Organisation Administrators can set up external links for E-Learning and Shifts. When these options are selected by users, a new tab will open with predefined external site.

# **Coming Soon**



## **Loads more**