class User < ActiveRecord::Base
  before_create { generate_token(:auth_token) }

  def generate_token(column)
  	begin
  	  self[column] = SecureRandom.urlsafe_base64
  	end while User.exists?(column => self[column])
  end
end
