class AddUrlToPosts < ActiveRecord::Migration[7.0]
  def change
    add_column :posts, :cover_url, :string
  end
end
