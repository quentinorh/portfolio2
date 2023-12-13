class CreateJoinTablePostsHashtags < ActiveRecord::Migration[6.0]
  def change
    create_join_table :posts, :hashtags do |t|
      t.index [:post_id, :hashtag_id] # Pour des recherches plus rapides
      t.index [:hashtag_id, :post_id] # Optionnel, en fonction de vos besoins
    end
  end
end
