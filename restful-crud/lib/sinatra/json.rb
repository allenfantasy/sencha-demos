require 'sinatra/base'
### ONLY ONE TASK
# {
#   "task": {
#   },
#   "success": true
# }
#
### MORE THAN ONE TASK
# {
#   "tasks": [{
#   },
#   {
#   }],
#   "success": true
# }

module Sinatra
  module JSON
    def json_for(tasks)
      if tasks.respond_to? :each
        tasks.compact!
        result = if tasks.empty?
                   { success: false }
                 else
                   { success: true, data: tasks.map { |u| u.as_json } }
                 end
      elsif tasks.is_a? Task
        task = tasks
        result = if task.nil?
                   { success: false }
                 else
                   { success: true, data: task.as_json }
                 end
      else
        result = { success: false }
      end
      result.to_json
    end
  end

  helpers JSON
end
