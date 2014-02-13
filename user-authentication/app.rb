# coding: utf-8

$:.unshift File.expand_path("../lib", __FILE__)
require 'sinatra'
require 'sinatra/reloader' if development? # auto-reload
require 'sinatra/json'
require 'json'
require 'active_record'
require 'active_support'
require './models'
#require 'securerandom'

ActiveRecord::Base.establish_connection(
  :adapter => 'sqlite3',
  :database => 'db/development.sqlite'
)

configure :development, :production do
  enable :logging
  Time.zone = "UTC"
end

before do
  headers 'Access-Control-Allow-Origin' => '*',
          'Access-Control-Allow-Methods' => "OPTIONS, GET, POST, PUT, DELETE",
          'Access-Control-Allow-Headers' => "accept, authorization, origin, X-Requested-With, Content-Type"
  params.delete('_dc')
end

get '/' do
  send_file 'public/index.html'
end

post '/sign_in' do
  logger.info params
  encrypted_password = Digest::SHA1.hexdigest(params["password"])

  u = User.find_by_name(params["name"])

  if u && u.password == encrypted_password
    # cookie
    if params["remember_me"]
      response.set_cookie 'token', 'ooo'
    end
    { success: true, authToken: u.auth_token }.to_json
  else
    { success: false, message: 'invalid username and password' }.to_json
  end

end

post '/sign_up' do
  params["password"] = Digest::SHA1.hexdigest(params["password"])
  u = User.new(params)  
  if u.save
    { success: true }.to_json
  else
    { success: false, message: u.errors }.to_json
  end
end

post '/sign_off' do
  200
end

options '/*' do
  200
end
