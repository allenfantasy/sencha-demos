class MobileController < ApplicationController
  layout false

  def index
    # TODO: mobile detect
    render File.join(RAILS_ROOT, 'public', 'mobile')
  end
end
