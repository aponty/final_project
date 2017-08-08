Rails.application.routes.draw do
    # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
    get '/users/validate', to: 'users#validate'
    post '/users', to: 'users#create'
    post '/login', to: 'sessions#create'
end
