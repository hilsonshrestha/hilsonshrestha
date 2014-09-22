from google.appengine.ext import db
from google.appengine.api import memcache
import logging

class Article (db.Model):
	'''An Article'''

	title = db.StringProperty(required = True)

	# Content of the article.
	# HTML is allowed for content.
	content = db.TextProperty(required = True)

	created = db.DateTimeProperty(auto_now_add = True)

	# To be used while searching for articles.
	tags = db.ListProperty(str)

	# Url of main image related to this article.
	# Used while listing article.
	image = db.StringProperty()
	
	def cache(self):
		memcache.set(str(self.key()), self)
	
	def store(self):
		self.put()
		self.cache()

	@staticmethod
	def get(key):
		# Tries to access the article from cache.
		# If unavailable, access the article from db.
		mem_key = str(key)
		article = memcache.get(mem_key)
		if not article:
			try:
				article = db.get(key)
			except:
				article = None
			memcache.set(mem_key, article if article else "placeholder to reduce memcache misses")
		if isinstance(article, Article):
			return article

	@staticmethod
	def get_eq(offset = 0, limit = 10):
		# Returns a list of articles based on offset.

		if offset < 0: offset = 0

		# Accesses article keys only.
		q = Article.all(keys_only = True)
		q.order('-created')

		# fetch and return article from key
		return [Article.get(key) for key in q.run(offset = offset, limit = limit)]


class ArticleTag (db.Model):
	'''Lets make searching easier'''

	articles = db.ListProperty(db.Key)
	created = db.DateTimeProperty(auto_now_add = True)

	@staticmethod
	def _key(tag):
		# Returns key for caching purpose.
		if id:
			return "articleKey/" + str(tag)
		else:
			return "error"
	
	def cache(self):
		memcache.set(ArticleTag._key(self.key().name()), self)
	
	def store(self):
		self.put()
		self.cache()

	@staticmethod
	def get(tag):
		mem_key = ArticleTag._key(tag)
		article_tag = memcache.get(mem_key)
		if not article_tag:
			article_tag = ArticleTag.get_by_key_name(str(tag))
			memcache.set(mem_key, article_tag if article_tag else "placeholder to reduce memcache misses")
		if isinstance(article_tag, ArticleTag):
			return article_tag
