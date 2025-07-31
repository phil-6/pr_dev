# _plugins/raw_include_relative.rb
module Jekyll
  module Tags
    class RawIncludeRelativeTag < IncludeRelativeTag
      # Read the file as usual, then wrap it so Liquid won't render its contents
      def read_file(file, context)
        "{% raw %}" + super + "{% endraw %}"
      end
    end
  end
end

# Register the new tag
Liquid::Template.register_tag("raw_include_relative", Jekyll::Tags::RawIncludeRelativeTag)
