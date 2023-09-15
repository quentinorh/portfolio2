Rails.application.routes.draw do
  resources :photos
  resources :categories
  devise_for :users

  get '/sitemap.xml', to: redirect("https://portfolioquentinoio.s3.eu-central-1.amazonaws.com/sitemaps/sitemap.xml")

  get 'tags/:tag', to: 'posts#index', as: :tagged
  resources :contacts, only: [:new, :create]
  get 'contact', to: 'contacts#info', as: 'contact'
  get 'message', to: 'contacts#message'
  get 'contacts/sent'

  resources :posts, path: '/' do
    member do
      patch :delete_photo
    end
  end

  root to: "posts#index"
end
