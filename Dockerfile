# Use the official Ruby image.
# https://hub.docker.com/_/ruby
FROM ruby:3.2-buster

# Install production dependencies.
WORKDIR /usr/src/app
COPY Gemfile Gemfile.lock ./
ENV BUNDLE_FROZEN=true

# Install Bundler and Gems
RUN gem install bundler && bundle config set --local without 'test'
RUN bundle config set --local force_ruby_platform true && bundle install

# Copy local code to the container image.
COPY . ./

# Run the web service on container startup.
CMD ["ruby", "./app.rb"]
