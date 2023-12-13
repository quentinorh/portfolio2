class StorybirdController < ApplicationController
  skip_before_action :authenticate_user!
  layout 'storybird_layout'

  def index
    @videos = Cloudinary::Api.resources(
      resource_type: 'video',
      type: 'upload',
      prefix: 'storybird1/',
      tags: true
    )['resources'].map do |video|
      {
        url: video['url'],
        created_at: video['created_at'],
        public_id: video['public_id'],
        is_favorite: video['tags'].include?('favoris') # Vérifier si la vidéo a le tag "favoris"
      }
    end.sort_by { |video| video[:created_at] }.reverse
  end

end
