module Jekyll
  module Paginate
    class Catination < Jekyll::Generator

      def generate(site)
        #Checks to see if catination_path is defined in the _config.yml file.
        if site.config["catinate_path"]
          #Checks to see if there are any categories.
          if !site.site_payload['site']['categories'].empty?
            #Checks to see if there is a template file.
            if template = cat_template_page(site)
              Jekyll.logger.warn "Catination:" " is running."
              catinate(site, template)
            else
              Jekyll.logger.warn "Catination:", "Catination is enabled, but could't find and index.html page."
            end
          else
            Jekyll.logger.warn "Catination:", "Catination is enabled, but no catagories were found."
          end
        else
          Jekyll.logger.warn "Catination:", "Variable catinate_path not found"
        end
      end

      def catinate(site, page)
          #Gets a hash of with category names as keys and an array corresponding posts as a value.
          all_cats = site.site_payload['site']['categories']
          #Feed each key value pair into a modified pagination function.
          all_cats.each do |key, value|
            #Makes sure bad things didn't happen.
            if !key.nil?
              #This returns how many pages are to be generated
              #Ceil[(Number of Posts in Category) / (Paginate Value)]
              pages = Pager.calculate_pages(value, site.config['paginate'].to_i)
              Jekyll.logger.warn "Catination:" " creating " + pages.to_s + " pages for category - " + key
              #Creates each page
              (1..pages).each do |num_page|
                #Creates the paging object
                pager = Pager.new(site, num_page, value, pages)
                #If there is more than one page
                #Create the standard pagination layout
                if num_page > 1
                  newpage = Page.new(site, site.source, page.dir, page.name)
                  newpage.pager = pager
                  newpage.dir = site.config["catinate_out"] + "/" + key + "/page" + num_page.to_s
                  site.pages << newpage
                #Create a sub-directory for eah key
                else
                  newpage = Page.new(site, site.source, page.dir, page.name)
                  newpage.pager = pager
                  newpage.dir = site.config["catinate_out"] + "/" + key
                  site.pages << newpage
                end
              end
            end
          end
      end

      def cat_template_page(site)
        Page.new(site, site.source, site.config["catinate_path"], "index.html")
      end
      
    end
  end
end