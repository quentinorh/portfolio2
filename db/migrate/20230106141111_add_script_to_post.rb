class AddScriptToPost < ActiveRecord::Migration[7.0]
  def change
    add_column :posts, :script, :text
  end
end
