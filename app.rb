#! /usr/bin/env ruby

require 'sinatra'

before do
  cache_control :no_store
  @css_version = Time.now.to_i.to_s
end

set :bind, '0.0.0.0'

get '/' do
  erb :index
end

# Endpoint to serve the words CSV file
get '/words' do
  send_file 'public/words.csv', type: :csv
end
