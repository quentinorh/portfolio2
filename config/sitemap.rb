# Set the host name for URL creation
SitemapGenerator::Sitemap.default_host = "https://quentino.io"

SitemapGenerator::Sitemap.create do
  # Put links creation logic here.
  #
  # The root path '/' and sitemap index file are added automatically for you.
  # Links are added to the Sitemap in the order they are specified.
  #
  # Usage: add(path, options={})
  #        (default options are used if you don't specify)
  #
  # Defaults: :priority => 0.5, :changefreq => 'weekly',
  #           :lastmod => Time.now, :host => default_host
  #
  # Examples:
  #
  # Add '/articles'
  #
  #   add articles_path, :priority => 0.7, :changefreq => 'daily'
  #
  # Add all articles:
  #
  #   Article.find_each do |article|
  #     add article_path(article), :lastmod => article.updated_at
  #   end

  # Add info page:
  add contact_path

  # Add message page:
  add message_path

  # Add all published posts:
  Post.published.find_each do |p|
    add post_path(p), lastmod: p.updated_at
  end

  # Add tag pages:
  Post.tag_counts_on(:tags).each do |tag|
    add tagged_path(tag: tag.name)
  end
end
