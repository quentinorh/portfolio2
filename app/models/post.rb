class Post < ApplicationRecord
  acts_as_taggable_on :tags
  has_many_attached :photos
<<<<<<< HEAD
  # validates :photos, :title, :order_number, presence: true
=======
  has_many :categories_posts, dependent: :destroy
  has_many :categories, through: :categories_posts
  has_and_belongs_to_many :categories, join_table: "categories_posts"
  # validates :photos, :title, :order_number, presence: true

  scope :published, -> { where(draft: false) }

  extend FriendlyId
  friendly_id :title, use: :slugged

  def previous_post
    Post.published.where("date = ? AND id > ?", self.date, self.id)
        .or(Post.published.where("date > ?", self.date))
        .order(:date, :id).first
  end

  def should_generate_new_friendly_id?
    title_changed?
  end

  def next_post
    Post.published.where("date = ? AND id < ?", self.date, self.id)
        .or(Post.published.where("date < ?", self.date))
        .order(date: :desc, id: :desc).first
  end

>>>>>>> b1061df5e30387f8557abba7298717ea4a1fbe85
end
