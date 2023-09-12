class Category < ApplicationRecord
  has_many :categories_posts, dependent: :destroy
  has_many :posts, through: :categories_posts
  has_and_belongs_to_many :posts, join_table: "categories_posts"
end
