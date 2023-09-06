class PagesController < ApplicationController
  skip_before_action :authenticate_user!, only: [:home]

  def home
  end

  # def admin
  #   @posts = Post.all.order(order_number: :desc)
  # end

  def contact
  end
end
