class Post < ApplicationRecord
  acts_as_taggable_on :tags
  has_many_attached :photos
  has_many :categories_posts, dependent: :destroy
  has_many :categories, through: :categories_posts
  has_and_belongs_to_many :categories, join_table: "categories_posts"
  # validates :photos, :title, :order_number, presence: true

  scope :published, -> { where(draft: false) }

  def previous_post
    Post.published.where("date = ? AND id > ?", self.date, self.id)
        .or(Post.published.where("date > ?", self.date))
        .order(:date, :id).first
  end

  def next_post
    Post.published.where("date = ? AND id < ?", self.date, self.id)
        .or(Post.published.where("date < ?", self.date))
        .order(date: :desc, id: :desc).first
  end

end
