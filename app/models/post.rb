class Post < ApplicationRecord
  acts_as_taggable_on :tags
  has_many_attached :photos
  # validates :photos, :title, :order_number, presence: true
end
