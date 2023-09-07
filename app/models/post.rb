class Post < ApplicationRecord
  acts_as_taggable_on :tags
  has_many_attached :photos
  # validates :photos, :title, :order_number, presence: true

  def previous_post
    Post.where("date = ? AND id > ?", self.date, self.id)
        .or(Post.where("date > ?", self.date))
        .order(:date, :id).first
  end

  def next_post
    Post.where("date = ? AND id < ?", self.date, self.id)
        .or(Post.where("date < ?", self.date))
        .order(date: :desc, id: :desc).first
  end

end
