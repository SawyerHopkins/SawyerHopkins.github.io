module Jekyll
  module SortedCategories

    #Sorts categories so that those with the most posts are on the top of the stack
    def sort_most_post(catHash)
      Jekyll.logger.warn "Catination:", "Sorting categories by post count."
      catHash.sort {|x,y| y.last.size <=> x.last.size }
    end

    #Sorts categories so that those with the most posts are on the bottom of the stack
    def sort_least_post(catHash)
      Jekyll.logger.warn "Catination:", "Sorting categories by post count."
      catHash.sort {|x,y| x.last.size <=> y.last.size }
    end

  end
end

Liquid::Template.register_filter(Jekyll::SortedCategories)