class PostsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index, :show]

  def index
    if params[:tag].present?
      @posts = Post.tagged_with(params[:tag]).order(order_number: :desc)
    else
      @posts = Post.all.order(order_number: :desc)
    end
  end

  def show
    @post = Post.find(params[:id])
    @related_posts = @post.find_related_tags
    @posts = Post.all.order(order_number: :desc)
  end

  def new
    @post = Post.new
  end

  def create
    @post = Post.new(post_params)
    if Post.last
      @post.order_number = Post.all.order(:order_number).last.order_number + 1
    else
      @post.order_number = 1
    end
    if @post.save
      redirect_to @post
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    @post = Post.find(params[:id])
    @posts = Post.all.order(order_number: :desc)
  end

  def update
    @post = Post.find(params[:id])
    @old_order = @post.order_number
    @post.attributes = post_params.except(:photos)
    post_params[:photos].each do |photo|
      @post.photos.attach(photo)
    end
    if @post.save
      @new_order = post_params[:order_number].to_i
      if @old_order < @new_order
        @posts = Post.select { |post| post.order_number > @old_order && post.order_number <= @new_order }
        @posts.each do |p|
          p.order_number -= 1
          p.save
        end
      end
      if @old_order > @new_order
        @posts = Post.select { |post| post.order_number < @old_order && post.order_number >= @new_order }
        @posts.each do |p|
          p.order_number += 1
          p.save
        end
      end
      @post = Post.find(params[:id])
      @post.order_number = @new_order
      @post.save
      redirect_to post_path(@post)
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def delete_photo
    @post = Post.find(params[:id])
    @post.photos.find_by_id(params[:photo_id]).delete
    @post.save
  end

  private

  def post_params
    params.require(:post).permit(:title, :description, :source, :script, :order_number, photos: [], tag_list: [])
  end
end
