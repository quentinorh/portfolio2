class DropPostsHashtagsJoinTable < ActiveRecord::Migration[7.0]
  def change
    drop_table :hashtags_posts
  end
end
