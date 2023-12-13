class AddAltTextToPosts < ActiveRecord::Migration[7.0]
  def change
    add_column :posts, :alt_text, :string
  end
end
