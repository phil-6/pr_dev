---
layout: blog
author: Phil
full-name: Phil Reynolds
short-title: rails-github-actions
full-title: Migrating to GitHub Actions for Rails CI
file-type: md
summary: RubyCI is tragically shutting down, so I'm migrating to GitHub Actions for Rails CI
publish-date: October 13
publish-year: 2022
---

# Migrating to GitHub actions for Rails CI

For the last couple of years I've been using Ruby.ci to power CI checks on my rails applications. RubyCI is one of those amazing tools that was zero effort to setup and ran flawlessly, it was exactly how I feel that DevOps should be. Sadly, [Alex](https://github.com/alexvko) has decided to retire the project and move onto other things.

RubyCI is shutting down on October 15th. Alex gave all users a month's notice to migrate away to another CI tool, his suggestion was to go with Circle CI, but I decided on GitHub actions. I like the idea of running your CI checks close to your code. GitHub actions are well documented, backed by a strong community and has a well implemented marketplace. Which, after the initial configuration, does make setting things up quite a bit easier.

GitHub actions is a lot more flexible than RubyCI, which means that it's also a lot more fiddly to set up. There are a few resouces out there which make it simpler, but I coudn't find any that completely addressed the setup I was looking for. I did use [Matt Swanson](https://twitter.com/_swanson)'s [Boring Rails guide](https://boringrails.com/articles/building-a-rails-ci-pipeline-with-github-actions/) as a starting point but made some fairly substantial changes. It's also worth taking a look at the [official documentation](https://docs.github.com/en/actions). Some useful bookmarks:

* [Ruby Starter Workflow](https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-ruby#using-the-ruby-starter-workflow)
* [Events that trigger workflows](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows)
* [Workflow syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
* [Monitoring and Troubleshooting](https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/about-monitoring-and-troubleshooting)
* [Creating Postgres Service](https://docs.github.com/en/actions/using-containerized-services/creating-postgresql-service-containers)
* [Creating Redis Service](https://docs.github.com/en/actions/using-containerized-services/creating-redis-service-containers)

The biggest changes was led by the discovery or [ReviewDog](https://github.com/reviewdog/reviewdog), which provides a way to post review comments back on the commit or pull request in GitHub, I was somewhat surprised that GitHub actions didn't support this out of the box, considering it's part of the same platform, I thought posting comments back on the code would be simple, maybe I missed it? Either way reviewdog handles that for you, and appears to be well used and well supported.

I found it easiest to do the intial setup using the GitHub web UI, when you do this GitHub automatically creates a `.github/workflows` directory in your project root and the commit to be able to store it.

These workflow files are each what you could consider an "action". They're YAML files which tell the GitHub runner what to do. I created two workflows, one to run all of my code quality and security checks and the other to to run tests. Both of these workflows use a `RAILS_MASTER_KEY` environment variable which is stored in the GitHub repo secrets. You can view them both in [this gist](https://gist.github.com/phil-6/ab7d185c5ccf02efe8ec86b27c71ae24), and I'll include them at the end of the post.

The code quality action runs on every push and when a pull request is made to our default branch. It then checks out the code, installs ruby and gems then runs Bundler Audit, Brakeman and Rubocop. Rubocop is actually down twice, once to run on every push and the other runs on pull requests. This is the only way I could configure it to report a green tick and also add comments to a pull request against any failure.

The test workflow is a bit more complicated as it has to setup the application to run the tests. It runs on pushes to main, pull requests to main, as well as on workflow dispatch (manually from GitHub web) and on a weekly schedule. Before the rails setup setup, we have to setup Postgres and Redis services. The GitHub docs for setting these up are great. We then repeat the steps to checkout our code and install dependencies. The final steps load our database schema, run the tests, and upload our code coverage to CodeCov (which requires an additional secret).

Once these workflows have each run once, you can add them to a branch protection rule in GitHub. This is done in your repo's Settings > Branches > Branch protection rules > edit > Require status checks to pass before merging > search for the name of the job.

I hope this is enough for you to migrate to GitHub applications. If I've missed anything or you think there is anything I should add, please let me know!

## Code Quality Workflow

```yaml
name: "Code Quality"
on:
  push:
    branches: [ "**" ]
  pull_request:
    branches: [ "main" ]
    
jobs:
  CodeQuality:
    runs-on: ubuntu-latest
    env:
      RAILS_MASTER_KEY: ${{ secrets.RAILS_MASTER_KEY }}
      
    steps:
      # Config
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Install Ruby and gems
        uses: ruby/setup-ruby@0a29871fe2b0200a17a4497bae54fe5df0d973aa # v1.115.3
        with:
          bundler-cache: true
      
      # from https://github.com/tomferreira/action-bundler-audit
      - name: 📋 Bundler audit - Check for vulnerable gems
        uses: tomferreira/action-bundler-audit@v1
        with:
          bundler_audit_version: gemfile
          fail_on_error: true
        
      # from https://github.com/reviewdog/action-brakeman
      - name: 👮 Brakeman - Security audit application code
        uses: reviewdog/action-brakeman@v2
        with:
          fail_on_error: true
        
      # from https://github.com/reviewdog/action-rubocop
      - name: 🤖 Rubocop 🚨
        uses: reviewdog/action-rubocop@v2
        with:
          rubocop_extensions: rubocop-rails rubocop-performance rubocop-minitest
          reporter: github-pr-review
          fail_on_error: true

      - name: 🤖 Rubocop ✅
        uses: reviewdog/action-rubocop@v2
        with:
          rubocop_extensions: rubocop-rails rubocop-performance rubocop-minitest
          reporter: github-check
          fail_on_error: true
          
      # from https://github.com/reviewdog/action-actionlint
      - name: GitHub Action Lint
        uses: reviewdog/action-actionlint@v1
```

## Test Workflow

```yaml
name: "Minitest"
on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]
  workflow_dispatch:
  schedule:
    - cron: '0 2 * * 0'

jobs:
  run-tests:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:14.5-alpine

        # Set health checks to wait until postgres has started
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 500ms
          --health-retries 15

        ports:
          # Maps port 5432 on service container to the host
          - "5432:5432"
        env:
          POSTGRES_DB: rails_test
          POSTGRES_USER: rails
          POSTGRES_PASSWORD: password

      redis:
        image: redis

        # Set health checks to wait until redis has started
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 500ms
          --health-retries 15
          --entrypoint redis-server

        # Maps port 6379 on service container to the host
        ports:
          - "6379:6379"

    env:
      RAILS_ENV: test
      DATABASE_URL: "postgres://rails:password@localhost:5432/rails_test"
      RAILS_MASTER_KEY: ${{ secrets.RAILS_MASTER_KEY }}
      REDIS_HOST: localhost
      REDIS_PORT: 6379

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      # Add or replace dependency steps here
      - name: Install Ruby and gems
        uses: ruby/setup-ruby@0a29871fe2b0200a17a4497bae54fe5df0d973aa # v1.115.3
        with:
          bundler-cache: true

      # Add or replace database setup steps here
      - name: Set up database schema
        run: bin/rails db:schema:load

      # Add or replace test runners here
      - name: Run tests
        run: bin/rails test

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          verbose: true # optional (default = false)
```