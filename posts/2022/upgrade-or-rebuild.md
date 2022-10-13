---
layout: blog
author: Phil
full-name: Phil Reynolds
short-title: Upgrade or Rebuild?
full-title: Upgrade or Rebuild?
file-type: md
Summary: |
    It’s a question that many developers face. Maintenance takes a back seat to "urgent" new features, and before you 
    know it your dependencies are way out of date.
publish-date: June 25
publish-year: 2022
---

# Should I Upgrade or Rebuild my Rails App?

It’s a question that many developers face. Often maintenance and managing technical debt takes a back seat to new
features and client requests, and before you know it your version of [Ruby or Rails is reaching EoL](https://endoflife.date/rails) and an upgrade is
urgently needed. An upgrade is always a daunting task for an application in production. There are lots of great guides
out there for how to upgrade, [Rails has a good guide in the documentation](https://guides.rubyonrails.org/upgrading_ruby_on_rails.html), [Planet Argon has a load of great resources
too](https://blog.planetargon.com/search?utf8=%E2%9C%93&q=upgrade) and a quick Google search will offer you loads more.

So, the big question remains

## Upgrade or Rebuild?

**Upgrade.**

It’s a straightforward answer. You should upgrade.

First focus on improving your testing suite, and then look into dual-boot strategies for Ruby and Rails. There’s a huge
amount of support out there for guiding you through this upgrade process.

But, there are situations where this doesn’t always hold true.

Here at Ryalto, we’ve made the decision to move down the rebuild path. It was not a decision made lightly, and there are
significant challenges on the road ahead, but we’re confident that a rebuild is the right path for us.

## Why Rebuild

The Ryalto application has been through an interesting development journey. The current team is the third that has been
working on the application and the first two teams were external contractors. The legacy of this shows in the codebase. Various bits of business logic are not used any more,
and things have been changed once and then changed again. Adding new functionality to meet new requirements for our
current clients, and the way they use the application is challenging because they weren’t considered when the
application was originally architected. A rebuild affords us the opportunity to consider these decisions, and redesign
the application for the way the app is used today, with an eye on the horizon to ensure we facilitate the potential
usage of tomorrow.

There are a couple of great examples of this in our codebase. Users and “Multi Profile”.

## Users

Users are not just users in Ryalto currently. We have Users, and Doctors and Nurses and Admins # TODO: Dig into the meat
of current Ryalto user setup.

Looking forward, we’re going to aim to model our users on the real world. We’re always aiming to keep things simple;
[KISS](https://en.wikipedia.org/wiki/KISS_principle) is a great way to ensure upgradability in the future.

A user will have one Ryalto account. This account is agnostic of organisations and roles that a user has. Regardless of
whether they are a doctor, nurse, admin or any other type of user, they will just have one account, one login, one
profile. This keeps our data structure simple and should allow us to add other functionalities which we haven’t even
considered yet.

## Multi Profile

Currently, a user `belongs_to` an organisation in Ryalto. A user can’t exist without a parent organisation, and a user
can only belong to one organisation. We’ve worked some background magic that allows user accounts to be linked together
to allow a user to switch between organisations. The current implementation of this was very non-trivial, and adds a
fair bit of complexity to both the user experience and our user authentication logic.

Our new plan for this will allow a user to request to join one or many organisations, this relationship is handled by a
“UserOrganisation” model. The user can optionally have a specific email address for each organisation. The user's roles
are also handled by this model on a per-organisation basis. A user might be an Admin at one organisation but not at
another.

This also allows a user to hold multiple roles. At a small organisation, a user might be a doctor and a shift admin, so
they can create and manage shifts and also sign up to shifts where they meet the requirements.

Another thing that both of these approaches facilitate is the preservation of professional relationships even after a
user has left an organisation. A user will only be able to start conversations with people in their current
organisation, as the conversation is agnostic of the organisation, a user would be able to continue a conversation even
after they leave.

## Conclusion

The correct answer to this question is that you should upgrade.

Rebuild’s are not always a terrible idea. They can provide an opportunity to learn from previous decisions and
drastically improve the approach to the architecture of the system. Basecamp and Polywork, both fairly large scale Rails
applications have taken the rebuild path previously, and both have said that it has paid dividends to take a couple of
steps back to supercharge future development. [Add DHH talk and Spotify Podcast]

In our situation, requiring an upgrade provided an opportunity to dig deep into our codebase and review the way our
systems are architected. An upgrade would have been a lot of work, and rebuilding is also a LOT of work but also allows
us to build things in a more maintainable and extensible way.

### I’m excited for the journey we’re heading on!
