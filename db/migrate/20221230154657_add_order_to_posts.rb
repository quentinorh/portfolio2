class AddOrderToPosts < ActiveRecord::Migration[7.0]
  def change
    add_column :posts, :order_number, :integer
  end
end
