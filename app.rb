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
  @international_rank = '4/7'
  @national_rank = '3/4'
  @best_players = [
    { 'rank' => 1, 'word_count' => 18, 'country' => 'Burundi' },
    { 'rank' => 2, 'word_count' => 17, 'country' => 'Burundi' },
    { 'rank' => 3, 'word_count' => 15, 'country' => 'France' },
    { 'rank' => 4, 'word_count' => 12, 'country' => 'Burundi' },
    { 'rank' => 5, 'word_count' => 11, 'country' => 'Canada' },
    { 'rank' => 6, 'word_count' => 7, 'country' => 'France' },
  ]
  @players_by_country = [
    { 'rank' => 1, 'country' => 'Burundi', 'count' => 4 },
    { 'rank' => 2, 'country' => 'France', 'count' => 2 },
    { 'rank' => 3, 'country' => 'Canada', 'count' => 1 },
  ]

  erb :leaderboard
end
