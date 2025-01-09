---
layout: blog
author: Phil
full-name: Phil Reynolds
full-title: Ryalto Needs an Upgrade
file-type: md
Summary: |
  This document outlines the different approaches that we could take to solve this problem, what the challenges and advantages of each 
  approach are and how we can make the decision of which path to choose.
publish-date: May 19
publish-year: 2022
---

### This document outlines the different approaches that we could take to solve this problem, what the challenges and advantages of each approach are and how we can make the decision of which path to choose.

# Introduction

## What is Ryalto V3?

Ryalto is made up of several applications. The primary front-end are two mobile applications built with Flutter; a cross platform application development kit. The flutter apps are supported by a web-based admin front end. The user interfaces are backed by a Ruby on Rails application stack.

The Rails back-end is actually 3 main applications; api-service, news-feed, and notification service. These three applications are tightly coupled. From a business logic perspective they could easily be consolidated into one application.

## Why do we need to upgrade?

The three applications are currently using Rails version 5.2, which has the end of life on 1st June 2022. This means that after this date, Rails 5.2 will no longer receive support and security patches.

## Current State of Ryalto

While Ryalto is currently functional, and version 3 has provided an outstanding update to the user interface, the core application code is not easy to work with.

It appears as though there was very little consideration given to the ongoing development and maintenance of the application before development was brought in-house. Working with the existing code is extremely difficult due to the overcomplication of the code base. Things that should be simple end up taking significantly longer than they should.

Development of new features, and fixes to problems are going to be going slower and slower and slower, unless we take the time to improve the foundations of the code base.

> ***There is no trade-off of quality vs. speed in software. There never has been. Low quality means low speed. Always. <br/><br/> The only way to go fast is to go well. <br/>- Robert Martin***

## Examples of poor code maintenance.

EG. Document downloads for news feed articles. This should be a 5 minute job for 1 developer. Instead it took 4 days and 3 developers.

EG. Notification pipeline. I’m still working on this, but there are a LOT of steps in the notification pipeline, which has led to problems with duplicated notifications, or quiet failures. Due to the complexity of the pipeline, resolving these issues is extremely difficult.

EG. This line from the readme in our NHSP Gem: “TODO: Delete this and the text above, and describe your gem”

EG. This line in the `admin-email` model. “This was used to track offer lifecycle and user signup. All send_notification calls were converted to log statements. Currently it's not used anymore, should probably clean-up in the future”

EG. Timesheet Submit Reminder Job https://github.com/ryalto/api-service/blob/4eac7d76eeaa97c481cbc19b911c2ae3aaad29d5/app/jobs/timesheet_submit_reminder_job.rb#L12

### Why is this document so big?

Due to the looming end-of-life of Rails 5.2 we need to alter focus slightly and slow down on adding new features in order to upgrade the application. But there is another way, instead of upgrading Ryalto, we could take this opportunity and rebuild the application back end. There are advantages and challenges to each approach. This document aims to outline each path and arm the key decision makers with the knowledge and key questions in order to make the decision.

It’s recommended that you go to View > Show Document Outline and use that to navigate the document.

# Key Decision Making Questions

**Are we planning to grow the tech team to more than 15 developers in the next 12-24 months?**

If yes, Upgrade Path.

Expand further into microservice architecture which can leverage the larger team size to really benefit from the distributed code base.


**Are the current investors planning a business exit in the next 12-24 months?**

If yes, Upgrade Path.

Don’t break what isn’t broken. Ryalto at the moment is stable and functional. If an exit is being considered within the next 2 years, then we should keep things as they are and not rock the boat?

**Do we want to continue on the trajectory of bringing development in-house and building a quality product?**

If yes, Rebuild Path.

At the moment, the code base is functional but maintenance is a headache. We have no knowledge from the beginning. A small team could do with a clean application which has a heavy focus on maintainability and extensibility.

**Do we want to be able to add new features quickly and easily?**

If yes, Rebuild Path.

At the moment adding new features is hard, there’s a significant risk of unintended side effects to any change. This requires a lot of manual testing and creates additional challenges. While the rebuild path is slower at first, it offers the opportunity to accelerate greatly in the long run.

**Are there significant architectural decisions that have been made previously that you would like to be able to change?**

Ryalto has undergone significant changes since the first line of code was committed at the end of January 2017. Not only in staffing and leadership but in direction of the business. This has left markers in the code, of decisions that were made once and then built on top of despite the business heading in a different direction. A rebuild affords us the opportunity to correct these decisions, and build in such a way that future decisions and changes become significantly easier.


**Are we concerned about the security of the application?**

Currently, there are lots of areas in the application where the code base does not follow best practice and is significantly more complicated than it needs to be. As well as impacting ongoing development this also carries a substantial security risk.

The answer to this question is yes. We should consider an external security audit.

# Upgrade Path

Very Rough Estimate 4-6 Months

### Resources

Planet Argon: [Resources List](https://blog.planetargon.com/entries/helpful-resources-for-your-rails-upgrade)

[Official Guide](https://guides.rubyonrails.org/upgrading_ruby_on_rails.html)

[Fast Ruby “Upgrade” Articles](https://www.fastruby.io/blog/tags/upgrades) [5.2 -> 6.0](https://www.fastruby.io/blog/rails/upgrades/upgrade-rails-from-5-2-to-6-0.html)

[Ruby Releases](https://www.ruby-lang.org/en/downloads/releases/)



### Upgrade Path

Ruby

- 2.6.1 -> 2.6.10 - > 2.7.6 -> 3.0.4 -> 3.1.2

Rails

- 5.2.6.3 -> 5.2.7 -> 6.0.4.7 -> 6.1.4.7 -> 7.0.2.3

Postgres is another element that needs to be upgraded, and presents a significant challenge

### Steps

- Get All Tests Running Locally
- Check and improve tests.
- Write tests and make sure they pass.
- Move to the latest patch version after your current version.
- Fix tests and deprecated features.
- Upgrade relevant gems.
- Fix tests and deprecated features.
- Move to the latest patch version of the next minor version.

## Challenges of Upgrade Path

Doesn’t solve the majority of the problems that Ryalto has at the moment. In terms of drastically over complicated systems and processes. Design, architecture and business logic decisions that were made previously, by previous leadership with a different vision for what Ryalto could be.

Doesn’t address any potential security flaws in the application design. Currently these are extremely challenging to identify, and even more so to correct.

Takes a long time, and a lot of effort for minor improvements to the user and to the business.

## Advantages of Upgrade Path

Maintains the status quo. Everything continues along the exact trajectory. Lower perceived risk.

# Rebuild Path

Very Rough Estimate 4-8 Months

### Resources

Guide: [Chat with ActionCable and Turbo](https://www.honeybadger.io/blog/chat-app-rails-actioncable-turbo/)

[Basecamp Guide for Switching from V2 -> V3](https://3.basecamp-help.com/article/28-thinking-about-switching-from-basecamp-2-to-3)

## Challenges of Rebuild Path

Pause in new feature development. (But increased speed later on)

Incompatibility between existing API and V4. (But migration is possible.)

## Advantages of Rebuild Path

- Design and Plan for the way Ryalto needs to be going forward.
- Allow new features to be added more easily, with less development overhead.
- Reduced risk of unintended consequences from lack of understanding of codebase.
- Quality of CodeBase increases, improved maintainability, better extensibility, happier developers, more valuable IP.
- Consolidate infrastructure - Should reduce running costs in the long run.
- Secure by design.
- Can follow best practices throughout the application.

Ryalto has just launched V3. The new mobile app seems to have been universally praised. This replatforming has not only allowed us to add new features more easily but has also provided a meaningful improvement to the user experience. A rebuild of the back end will be less obvious to the user, but will provide significant overall improvements to the business moving forwards. With the stable launch of V3 and pending rails upgrade I don’t think there is any better time than now to do this.

## New User Features that would be trivial as part of a rebuild.

Improved notifications

All features available on desktop (Desktop messenger etc)

Message content always encrypted

Multi-profile

Updated, improved and consolidated admin interface - one place to do all of the things.

## Other app improvements (invisible to users)

Drastically simplify the application which facilitates future maintainability and extensibility

Remove dependency on PubNub (native chat is easy with Rails 7)

Remove outdated / unsupported dependencies

Drastically clean up and improve business logic

Fix questionable architecture decisions

Trivial to keep dependency versions up to date going forward

Remove JQuery

## Resource Plan

- David continues on API V3 - Fixes and Improvements
- Phil plans and begins implementation for API V4
- Tom splits work between V3 and V4
- New resource works on V4
- Prerequisites
- Feature Flagging in Flutter

Allow each organisation to have a setting to select API Version

This allows the rebuild to continue without downtime for existing users.

Once the rebuild is at MVP, new users can be onboarded to V3 and existing users can be given the option to migrate.

### Database ERD and Plan

What is the current database structure?

What do we want to preserve?

What do we want to improve / change?

### Infrastructure Plan

Hatchbox for deployment
Digital Ocean and Cloudflare











## Initial Email (15th Feb ‘22)

Hey Gary and Tom,



Gary, I thought I'd move to email as I don't usually check my LinkedIn messages and I think email is probably a more suitable platform for this conversation!



Tom mentioned that Ryalto was on Rails 5.2, and as the EoL for that is the 1st of June this year, I made the guess that we'd be waiting to move away from that fairly soon!



In an ideal world, we would be using the latest stable Rails version, which is currently 7.0.2. Upgrading three major versions is a significant undertaking, however most definitely possible. Over the last couple of years, GitHub has migrated from their own Forked versions of rails to the latest release. It was one of the big pieces of work which Eileen was responsible for there and she's documented parts of the process[ here](https://github.blog/author/eileencodes/).



There are also lots of other resources available for best approaches to upgrading Rails. My two big take-aways are to do it step by step and to dual-boot the testing environment. The automated testing should catch most of the problems.



There are a few other fairly big stumbling blocks between 5 > 6 and 6 > 7. One of the biggest is webpacker, which gets introduced in 6 and dropped in 7.



However, my big question, and the point for conversation is: do we want to do spend the time upgrading?



Because, there is another way. While GitHub and Shopify have both spent a lot of time painstakingly upgrading, Basecamp took the approach of rewriting.[ DHH talks about it here.](https://businessofsoftware.org/2015/10/david-heinemeier-hansson-rewrite-basecamp-business-of-software-conference-video-dhh-bos2015/)



As I haven't seen Ryalto's codebase yet, I can't blindly advocate this idea whole heartedly, but I can say that its an approach we should definitely consider.



As I see it, there are a lot of benefits to taking this approach. Rails 7 is impressive, it takes advantages of a lot of the latest http/2 features and introduces[ Hotwire](https://hotwired.dev/) the heart of which is[ Turbo](https://turbo.hotwired.dev/). From what I understand about the way Ryalto is currently structured, a rewrite would also allow a consolidation of the various micro services into a "[majestic monolith](https://m.signalvnoise.com/the-majestic-monolith/)" which could then be the heart of the native mobile applications.



A rewrite would allow a significant knowledge consolidation amongst the core team, and reduce the risk of siloed knowledge. Considering the "inherited" nature of the software, a rewrite could be a release from the legacy code, allow best practices and conventions to be followed, and most importantly, greatly increase the ease of adding new features and fixing bugs in the future.



All the learnings of what works well in Ryalto, and what doesn't, can be leveraged to the new version. It does mean you pause shipping new features in the current app for a period of time, but I think the result at the end of it would be.



I know a rewrite is a pretty out-there suggestion especially coming from someone who hasn't even started! For the record, I've been writing notes on this for a while and was planning to wait at least until I had passed my probation before broaching the topic!



I *really* hope this isn't too wild a suggestion for someone who has no standing with the team or any actual knowledge of the app, but I hope this is a point for discussion as I think this is something to consider before we commit to the upgrade path.



Let me know what your thoughts are.



Thanks,

Phil