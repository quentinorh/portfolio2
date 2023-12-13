class DropHashtags < ActiveRecord::Migration[7.0]
  def change
    drop_table :hashtags
  end
end
