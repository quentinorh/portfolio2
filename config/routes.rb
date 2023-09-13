Rails.application.routes.draw do
  resources :photos
  resources :categories
  devise_for :users
  resources :posts do
    member do
      patch :delete_photo
    end
  end
  root to: "posts#index"
  get 'tags/:tag', to: 'posts#index', as: :tagged
  resources :contacts, only: [:new, :create]
  get 'contact', to: 'contacts#new', as: 'contact'
  get 'message', to: 'contacts#new2'
  get 'contacts/sent'
end
