#! /usr/bin/env ruby

require 'sinatra'

before do
  cache_control :no_store
  @version = Time.now.to_i.to_s
end

set :bind, '0.0.0.0'

get '/' do
  erb :index
end

get '/words' do
  send_file 'public/words.csv', type: :csv
end

get '/leaderboard' do
  # You will also fetch and pass leaderboard data to the template
  @leaderboard = []
  erb :leaderboard
end
