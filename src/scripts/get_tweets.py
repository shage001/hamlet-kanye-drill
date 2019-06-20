import os
import random
import urllib

import requests
import ujson
from requests_oauthlib import OAuth1


CONSUMER_KEY = os.getenv("CONSUMER_KEY")
CONSUMER_SECRET = os.getenv("CONSUMER_SECRET")
ACCESS_TOKEN = os.getenv("ACCESS_TOKEN")
ACCESS_TOKEN_SECRET = os.getenv("ACCESS_TOKEN_SECRET")

BASE_URL = "https://api.twitter.com/1.1/statuses/user_timeline.json"


def main():
	with open("dril_tweets.json", "r") as f:
		dril_tweets = ujson.load(f)

	with open("kanye_tweets.json", "r") as f:
		kanye_tweets = ujson.load(f)

	combined_tweets = dril_tweets + kanye_tweets

	while True:
		input()
		tweet = random.choice(combined_tweets)
		print(tweet["text"].lower())


def get_parsed_tweets(username):
	raw_tweets = get_raw_tweets(username)
	parsed_tweets = parse_tweets(raw_tweets)
	return parsed_tweets


def get_raw_tweets(username):
	auth = OAuth1(CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN, ACCESS_TOKEN_SECRET)
	params = {
		"screen_name": username,
		"count": 200,
	}
	url = "{0}?{1}".format(BASE_URL, urllib.parse.urlencode(params))
	resp = requests.get(url, auth=auth)
	return ujson.loads(resp.text)


def parse_tweets(raw_tweets):
	parsed_tweets = []

	for raw_tweet in raw_tweets:
		if exclude_tweet(raw_tweet):
			continue
		parsed_tweets.append({
			"text": raw_tweet["text"]
		})

	return parsed_tweets


def exclude_tweet(tweet):
	return tweet.get("retweeted_status") is not None or \
		   "http" in tweet.get("text")


def write_parsed_tweets_to_file(tweets, file_name):
	with open(file_name, "w") as f:
		ujson.dump(tweets, f)


if __name__ == "__main__":
	main()
