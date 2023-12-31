class CategoriesController < ApplicationController

  def index
    @categories = Category.all
    @posts = Post.all.order(date: :desc, id: :desc)
  end

  def new
    @category = Category.new
  end

  def create
    @category = Category.new(category_params)
    if @category.save
      redirect_to categories_path, notice: 'Catégorie créée avec succès!'
    else
      render :new
    end
  end

  def edit
    @category = Category.find(params[:id])
  end

  def update
    @category = Category.find(params[:id])
    if @category.update(category_params)
      redirect_to categories_path, notice: 'Catégorie mise à jour avec succès!'
    else
      render :edit
    end
  end

  private

  def category_params
    params.require(:category).permit(:name, :hashtags)
  end
end
