# coding: utf-8

$:.unshift File.expand_path("../lib", __FILE__)
require 'sinatra'
require 'sinatra/reloader' if development? # auto-reload
require 'sinatra/json'
require 'json'
require 'active_record'
require 'active_support'
require './models'

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

# index
get '/tasks' do
  json_for(Task.all)
end

# create
post '/tasks' do
  prop = JSON.parse(request.body.read)
  prop["dueDate"] = DateTime.strptime(prop["dueDate"].to_i.to_s, "%s")
  prop["uuid"] = prop.delete("id") # id generate by sencha is not allowed?


  # TODO: check duplicate

  t = Task.new(prop)

  if (flag = t.save)
    logger.info "[INFO] CREATE SUCCESS! Object: #{t.inspect}"
  else
    logger.info "[ERROR] CREATE FAILED! Object: #{t.inspect}"
  end

  { success: flag, id: t.id }.to_json

  #task = Task.new(params)
  #begin
    #task.save!
    #params.merge({ success: true }).to_json # add 'success' to meet Sencha
  #rescue ActiveRecord::RecordInvalid
    #{ message: task.errors.full_messages, success: false }.to_json
  #end
end

# read
get '/tasks/:id' do
  #logger.info "PARAMS:"
  #logger.info params
  json_for(Task.find(params[:id]))
end

# update
put '/tasks/:id' do
  prop = JSON.parse(request.body.read)
  prop["dueDate"] = DateTime.strptime(prop["dueDate"].to_s, "%s")
  #logger.info "prop: #{prop}"
  id = prop.delete("id")
  t = Task.find(id)
  #logger.info "prop: #{prop}"
  #logger.info "Task: #{t.inspect}"
  #logger.info "Request body: #{prop}"
  #logger.info "Request body class: #{prop.class}"
  #logger.info "PARAMS: #{params}"
  if (flag = t.update_attributes(prop))
    logger.info "[INFO] UPDATE SUCCESS! Object: #{t.inspect}"
  else
    logger.info "[ERROR] UPDATE FAILED! Object: #{t.inspect}"
  end

  { success: flag, id: id }.to_json
end

delete '/tasks' do
  prop = JSON.parse(request.body.read)
  logger.info "------DELETE TASK------"
  logger.info "Request body: #{prop}"
end
# delete
delete '/tasks/:id' do
  logger.info "------DELETE TASK ID------"
  #logger.info "PARAMS: #{params}"
  #logger.info "Request body: #{request.body.read}"
  t = Task.find(params["id"])
  if (flag = t.destroy)
    logger.info "[INFO] DELETE SUCCESS! Object: #{t.inspect}"
  else
    logger.info "[INFO] DELETE FAILED! Object: #{t.inspect}"
  end

  { success: flag }.to_json
end

options '/*' do
  200
end
