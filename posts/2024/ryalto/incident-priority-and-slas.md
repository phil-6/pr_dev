---
layout: blog
author: Phil
full-name: Phil Reynolds
short-title: ryalto--incident-priority-and-slas
full-title: Ryalto Incident Priority and SLAs
summary: This document defines the incident priority levels and the service level agreements (SLAs) for Ryalto engineers.
file-type: md
publish-date: June 11
publish-year: 2024
published: true
---

# Incident Priority and SLAs

This document defines the incident priority levels and the service level agreements (SLAs) for Ryalto engineers.

The purpose of this document is to ensure that any incidents that affect or disrupt Ryalto are handled and resolved according to their impact and urgency, and that the appropriate resources and actions are allocated to them. The document also specifies the criteria and method for determining the priority level of an incident, and the expected timeframes for responding to and resolving incidents.

The document does not cover the details of the incident management process, such as the roles, responsibilities, procedures, and tools involved.

# **Priority Levels**

We use a variation of the ITIL Prioritisation Matrix to categorise issues and incidents. There are two factors that are used to categorise an incident, scope and severity.

- **Scope** is how many users are affected. Is it all users at all organisations, is it just one organisation, a small subset of users or just a single user.
- **Severity** is related to what the fault is. Can the core functions no longer be performed or is it the application just being slow to load.

## **P0 - Critical**

The entire system is not functional or the majority of users are not able to use the application. Requires immediate attention.

### SLA Response Time

During normal hours - Respond within 15 minutes, provide hourly updates.

Outside normal hours - Respond within 2 hours, provide hourly updates.

### Examples

Ryalto infrastructure is down, service is entirely unavailable.

No users are able to login to the application

## **P1 - High**

A significant part of the system is not functional for a large number of users. Requires urgent attention.

### SLA Response Time

During normal hours - Respond within 1 hour, provide 2-hourly updates.

Outside normal hours - Respond within 4 hours, provide 2-hourly updates.

### Examples

Some users are getting consistent error messages when trying to send messages.

One organisation’s users are not able to book shifts.

## **P2 - Moderate**

Part of the system is not functioning as intended and is affecting a number of users. Requires attention and a hotfix.

### SLA Response Time

During normal hours - Respond within 4 hours, provide 4-hourly updates.

Outside normal hours - Respond within 8 hours, provide 4-hourly updates during normal hours.

### Examples

There is a bug with the dashboarding meaning users cannot view analytics data.

The directory is not loading all the time for some users.

A user has published an article and is reporting that iOS users cannot view it.

## **P3 - Low**

Low impact issue that affects a minor part of the system or a single user.

### SLA Response Time

During normal hours - Respond within 8 hours, provide daily updates if required.

Outside normal hours - Respond within 1 working day, provide daily updates if required.

### Examples

One user is getting notifications from a chat they are no longer part of.

Some admin users are not getting email alerts.



## **P4 - Minor**

Minor incident that does not affect system functionality.

### SLA Response Time

During normal hours - Respond within 1 day, provide weekly updates if required.

Outside normal hours - Respond within 1 week, provide weekly updates if required.

### Examples

Theme colour is not being applied correctly throughout the application.

The organisation settings page does not load correctly on Firefox.

 