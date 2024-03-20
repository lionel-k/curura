require 'sinatra'

set :bind, '0.0.0.0'

get '/' do
  erb :index
end

# Endpoint to serve the words CSV file
get '/words' do
  send_file 'public/words.csv', type: :csv
end
