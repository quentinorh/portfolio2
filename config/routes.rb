Rails.application.routes.draw do
  resources :photos
<<<<<<< HEAD
  devise_for :users
  resources :posts do
=======
  resources :categories
  devise_for :users

  get '/sitemap.xml', to: redirect("https://portfolioquentinoio.s3.eu-central-1.amazonaws.com/sitemaps/sitemap.xml")

  get '/storybird', to: 'storybird#index'
  get 'tags/:tag', to: 'posts#index', as: :tagged
  resources :contacts, only: [:new, :create]
  get 'contact', to: 'contacts#info', as: 'contact'
  get 'message', to: 'contacts#message'
  get 'contacts/sent'

  resources :posts, path: '/' do
>>>>>>> b1061df5e30387f8557abba7298717ea4a1fbe85
    member do
      patch :delete_photo
    end
  end
<<<<<<< HEAD
  root to: "posts#index", as: :tagged
  resources :contacts, only: [:new, :create]
  get 'contact', to: 'contacts#new', as: 'contact'
  get 'message', to: 'contacts#new2'
  get 'contacts/sent'
=======

  root to: "posts#index"
>>>>>>> b1061df5e30387f8557abba7298717ea4a1fbe85
end
