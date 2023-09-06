class FixColumnName < ActiveRecord::Migration[7.0]
  def change
    rename_column :posts, :content, :description
    add_column :posts, :source, :text
    remove_column :posts, :cover_url
  end
end
