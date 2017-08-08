# Rails Token Auth

- `rails new rails_token_auth --api`
- `cd rails_token_auth`
- In `Gemfile` uncomment the lines:
    ```ruby
# We will need bcrypt for user authentication
gem 'bcrypt', '~> 3.1.7'
    ```
    and

    ```ruby
# We will need rack-cors so we can talk to our api from our react app
gem 'rack-cors'
    ```
- In `config/initializers/cors.rb` we will have to set up our cors. Uncomment the code in the bottom of the file and for now change where it says `origins 'example.com'` to `origins 'http://localhost:3000'`.

    ***NOTE:***
    >Later when you deploy, you will need to change this url to match the server your react app is hosted on.

- `rails g model User name:string password_digest:string email:string avatar:string auth_token:token` Including `auth_token:token` adds a column that will contain a unique, secure token associated to that user.
- Add validations to the User model. Include a randomly generated secure token by adding `has_secure_token :auth_token`
- In the `ApplicationController` create a new method to require a token on a request. This will be a `before_action` we use in other controllers to secure specific routes.
- `rails g controller Users`
- Fill out the user's controller with a method to create a new user and a method to validate a user. Add a `before_action :require_token, only: [:validate]` to require a token when accesing the `validate` method in the controller. The validate user method will basically a way to ping the server to make sure the token cookie is correct and get the user's information
- `rails g controller Sessions`
- Fill out the sessions controller with a method for users to log in
- In our `config/routes.rb` add `post` routes for login, creating users, and validating users

**We now have the base of a secure, token validated rails API with user authentication**
