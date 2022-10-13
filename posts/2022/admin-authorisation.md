---
layout: blog
author: Phil
full-name: Phil Reynolds
short-title: Admin Authorisation
full-title: Admin Authorisation at Ryalto
file-type: md
summary: |
    We're working on a better way to manage the relationship between users and organisations. This post it about our 
    simple approach to admin users.
publish-date: June 14
publish-year: 2022
---

# Users, Organisations and Admin Authorisation at Ryalto

Here at Ryalto, we're working on a better way to manage the relationship between users and organisations.

## The old way

Previously, a user belonged to an organisation and an organisation had many users. We also had a separate model for admins, which also belong to an organisation. The actual implementation was a good deal more complicated than that, but I'm not going down that rabbit hole today!

We had a requirement from a client that users needed to be able to switch between organisations. We look the user-organisation relationship from many one-to-many to many-to-many. The initial implementation of this was a semantic link between user accounts to preserve the hierarchy. A user switched organisations by switching user accounts.

## A new way for Users <---> Organisations

When thinking about our rebuild I wanted to model our system more closely to the real world. A user has many organisations and an organisation has many users. This was done through a user-organisation model.

```ruby
# app/models/user.rb
# User Model
class User < ApplicationRecord
  has_many :user_organisations
  accepts_nested_attributes_for :user_organisations, allow_destroy: true
  has_many :organisations, through: :user_organisations
end

# app/models/organisation.rb
# Organisation Model
class Organisation < ApplicationRecord
  has_many :user_organisations
  has_many :users, through: :user_organisations
end

# app/models/user_organisation.rb
# UserOrganisation Model
# This is the model which connects users to organisations.
class UserOrganisation < ApplicationRecord
  belongs_to :user
  belongs_to :organisation
end
```

With this approach, the UserOrganisation model stores all the information about a users relationship with a particular organisation. Their organisation verification status, whether their account is enabled, any elevated privileges that they have and which is their "current" organisation.

The current organisation is important, as we want to scope the users activity, and pretty much everything else they see in the application based on that "current" organisation.

The big thing that is missing from this proper validation that a user must have exactly one organisation as their current organisation.

We get the user's current organisation by calling "find_by" on the user organisation. Find by is great here, as if there should end up being multiple organisations with the "current" boolean set to true, then it will return the first one only.

```ruby
# app/models/user.rb
# User Model
def current_user_organisation
  user_organisations.find_by(current: true)
end
```

Then we switch organisation by first setting all of the current booleans to false, and updating the one that the user is switching to.

```ruby
# app/models/user.rb
# User Model
def switch_organisation(organisation)
  user_organisations.update_all(current: false)
  user_organisations.find_by(organisation:).update(current: true)
end
```

To call this method we have a route and controller action.

```ruby
# config/routes.rb
  authenticated :user do
      # ...
    devise_scope :user do
      patch '/switch_organisation/:organisation', to: 'users/registrations#switch_organisation', as: 'switch_organisation'
    end
  end

module Users
  # app/controllers/users/registrations_controller.rb
  class RegistrationsController < Devise::RegistrationsController
    def switch_organisation
      current_user.switch_organisation(params[:organisation])
      redirect_back(fallback_location: root_path)
    end
  end
end

```

```erb
<h3>Switch Organisation</h3>
<% @organisations.each do |org| %>
  <% next if org.current %>

  <%= button_to org.organisation.name, switch_organisation_path(org.organisation), method: :patch, class: 'btn link-warning' %>
<% end %>
```

## Managing Authorisation for Elevated Privileges

Ryalto is a multi-functional app. For each section of the app, an organisation might want to set one or many users to be able to manage it, and one user might need privileges for multiple sections of the app. The simplest approach was to store a boolean in the UserOrganisation table for each admin area.

```ruby
      t.boolean :organisation_admin, null: false, default: false
      t.boolean :news_feed_admin, null: false, default: false
      t.boolean :shift_admin, null: false, default: false
```

We didn't want to create a separate admin user type, in order to keep things as close as possible to the real world. A user can have some admin rights at one organisation, but be a part of a separate organisation where they don't have any elevated privileges. We didn't want users to have to log out of their user account and log back in as an admin.

The user model can return whether or not a user is particular admin for their current organisation.

```ruby
# app/models/user.rb
# User Model
class User < ApplicationRecord
  has_many :user_organisations
  accepts_nested_attributes_for :user_organisations, allow_destroy: true
  has_many :organisations, through: :user_organisations

  def organisation_admin?
    current_user_organisation.organisation_admin
  end

  def shift_admin?
    current_user_organisation.shift_admin
  end

  def news_feed_admin?
    current_user_organisation.news_feed_admin
  end

  private

  def current_user_organisation
    user_organisations.find_by(current: true)
  end
end

```

There were a few different options for how to manage this authorisation for the controller actions. We're scoping the admin actions under an admin module, which a separate controller for each set of admin functionality. There were two initial approaches considered: verify authorisation in each controller, or extract it to the application controller.

In each controller it could look like this:

```ruby
module Admin
  # app/controllers/admin/organisations_controller.rb
  class OrganisationsController < ApplicationController

      # methods

       private

        def authorise_admin
            return if current_user.organisation_admin?

            redirect_back(fallback_location: root_path, flash: { error: "You don't have permission to do that action." })
        end
    end
end
```

Fairly simple, fairly clean, but it doesn't feel very DRY.

In the application controller:

```ruby
module Admin
    # app/controllers/admin/organisations_controller.rb
    class OrganisationsController < ApplicationController
        before_action :authorise

        # methods

        private

        def authorise
            authorise_admin("organisation")
        end
    end
end

# app/controllers/application_controller.rb
class ApplicationController < ActionController::Base
    # other stuff

    protected

    def authorize_admin(type)
        case type
        when "organisation"
          return if current_user.admin?
        when "news_feed"
          return if current_user.news_feed_admin?
        when "shift"
          return if current_user.shift_admin?
        end

    	redirect_back(fallback_location: root_path, flash: { error: "You don't have permission to do that action." })
  end
end
```

This feels better, but is quite verbose. The big draw back with this those is that you end up including the admin authorisation in every area of the app - which we don't necessarily want. It's also muddling the separation of concerns slightly.

Another option would be to have each specific admin controller inherit from a parent admin controller which handles the authorisation and any other shared methods. This felt like a good approach, but then suddenly:

## Helpers to the Rescue!

Extracting the authorisation to a helper allows use to include it where ever we needed, keep things DRY and doesn't muddle SRP.

The other really cool thing we've done is writing a single method for all of the separate authorisations. **The limitation is that the name of the admin method on the user model must be the singular version of the controller that it's being called from.** This is what we should be trying to do anyway to keep things readable.

So now, in each of our admin controllers we just `include AdminHelper` and the admin helper is just this:

```ruby
# app/helpers/admin_helper.rb
# Methods which are shared between admin controllers
module AdminHelper
  def authorise_admin
    return if current_user.public_send("#{controller_name.singularize}_admin?")

    redirect_back(fallback_location: root_path, flash: { error: "You don't have permission to do that action." })
  end
end
```

## Conclusion

The solution we've ended up with relies on a bit of extra convention. Future developers working on this section have to be considered with their naming conventions, but we have a solution that is DRY, maintainable and extensible! Exactly what we're looking for!

Can you think of any way we could have implemented this better?
