#! /usr/bin/env ruby
# ci

require 'sinatra'
require 'sinatra/reloader'
require 'pry'
require 'dotenv/load'
require 'httparty'
require 'pry'

Dotenv.load

before do
  cache_control :no_store
  @version = Time.now.to_i.to_s
  @backend_url = ENV['BACKEND_URL']
end

set :bind, '0.0.0.0'

get '/' do
  erb :index
end

get '/words' do
  send_file 'public/words.csv', type: :csv
end

get '/leaderboard' do
  @country = params[:country]
  score = params[:score]
  response =
    HTTParty.get(
      "#{@backend_url}/api/v1/curura/rankings?country=#{@country}&score=#{score}",
    )
  @international_rank = response['international_rank'] || '-'
  @national_rank = response['national_rank'] || '-'
  @best_players = response['best_players'] || []
  @players_by_country = response['players_by_country'] || []

  erb :leaderboard
end
