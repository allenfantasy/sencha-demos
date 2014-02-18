class Task < ActiveRecord::Base
  attr_accessible :completed, :description, :dueDate, :title, :uuid
end
