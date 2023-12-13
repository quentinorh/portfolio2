class PostsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index, :show]

  def index
<<<<<<< HEAD
    if params[:tag].present?
      @posts = Post.tagged_with(params[:tag]).order(order_number: :desc)
    else
      @posts = Post.all.order(order_number: :desc)
=======
    @meta_description = "Expert freelance en éco-conception d’objets et de services. Développeur et maker, je mets en avant une approche éthique et écologique dans tous mes projets. Explorez mes travaux qui fusionnent art, science et technologie pour un futur plus durable."
    if params[:tag].present?
      @posts = Post.tagged_with(params[:tag]).order(date: :desc)
      @page_title = "##{params[:tag]}"
    else
      @posts = Post.all.order(date: :desc, id: :desc)
>>>>>>> b1061df5e30387f8557abba7298717ea4a1fbe85
    end
  end

  def show
<<<<<<< HEAD
    @post = Post.find(params[:id])
=======
    @post = Post.friendly.find(params[:id])
    @meta_description = "#{@post.title} : #{@post.description.gsub(/\r?\n/, ' ')}"
>>>>>>> b1061df5e30387f8557abba7298717ea4a1fbe85
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
<<<<<<< HEAD
    @post = Post.find(params[:id])
=======
    @post = Post.friendly.find(params[:id])
>>>>>>> b1061df5e30387f8557abba7298717ea4a1fbe85
    @posts = Post.all.order(order_number: :desc)
  end

  def update
<<<<<<< HEAD
    @post = Post.find(params[:id])
=======
    @post = Post.friendly.find(params[:id])
>>>>>>> b1061df5e30387f8557abba7298717ea4a1fbe85
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
<<<<<<< HEAD
      @post = Post.find(params[:id])
=======
      @post = Post.friendly.find(params[:id])
>>>>>>> b1061df5e30387f8557abba7298717ea4a1fbe85
      @post.order_number = @new_order
      @post.save
      redirect_to post_path(@post)
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def delete_photo
<<<<<<< HEAD
    @post = Post.find(params[:id])
=======
    @post = Post.friendly.find(params[:id])
>>>>>>> b1061df5e30387f8557abba7298717ea4a1fbe85
    @post.photos.find_by_id(params[:photo_id]).delete
    @post.save
  end

  private

  def post_params
<<<<<<< HEAD
    params.require(:post).permit(:title, :description, :source, :script, :order_number, photos: [], tag_list: [])
=======
    params.require(:post).permit(:title, :draft, :date, :alt_text, :description, :source, :script, :order_number, photos: [], tag_list: [], category_ids: [])
>>>>>>> b1061df5e30387f8557abba7298717ea4a1fbe85
  end
end
