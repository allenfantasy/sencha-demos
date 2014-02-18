SenchaRails::Application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :tasks, :defaults => { :format => 'json' }
    end
  end

  resources :tasks

  get '/mobile' => 'mobile#index'
end
