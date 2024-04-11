#! /usr/bin/env ruby

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
end

set :bind, '0.0.0.0'

get '/' do
  erb :index
end

get '/words' do
  send_file 'public/words.csv', type: :csv
end

get '/leaderboard' do
  backend_url = ENV['BACKEND_URL']
  @country = params[:country]
  score = params[:score]
  response =
    HTTParty.get(
      "#{backend_url}/api/v1/curura/rankings?country=#{@country}&score=#{score}",
    )
  @international_rank = response['international_rank'] || '-'
  @national_rank = response['national_rank'] || '-'
  @best_players =
    response['best_players'] || [
      { 'rank' => 1, 'score' => 18, 'country' => 'Burundi' },
      { 'rank' => 2, 'score' => 17, 'country' => 'Burundi' },
      { 'rank' => 3, 'score' => 15, 'country' => 'France' },
      { 'rank' => 4, 'score' => 12, 'country' => 'Burundi' },
      { 'rank' => 5, 'score' => 11, 'country' => 'Canada' },
      { 'rank' => 6, 'score' => 7, 'country' => 'France' },
    ]
  @players_by_country =
    response['players_by_country'] || [
      { 'rank' => 1, 'country' => 'Burundi', 'count' => 4 },
      { 'rank' => 2, 'country' => 'France', 'count' => 2 },
      { 'rank' => 3, 'country' => 'Canada', 'count' => 1 },
    ]

  erb :leaderboard
end
