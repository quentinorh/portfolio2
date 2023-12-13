require "time"

task :generate_sitemap do
  if Time.now.wednesday?
     Rake::Task["sitemap:refresh"].invoke
   end
end
