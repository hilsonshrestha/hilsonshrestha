from base_handler import *
from models.Article import *
import datetime
import logging
from google.appengine.api import users
import re

articles_per_page = 2

class BlogPage(BaseHandler):
	def get(self):
		params = self.get_params_dict(['offset', 'limit'])
		try:
			params['offset'] = int(params['offset'])
		except ValueError:
			params['offset'] = 0
		articles = Article.get_eq(offset=params['offset'], limit = articles_per_page)
		for article in articles:
			stripped_content = strip_tags(article.content)
			if len(stripped_content) > 250:
				article._content =  stripped_content[:200] + '...'
			else:
				article._content = stripped_content
			article._id = article.key()
			article._created = article.created.strftime('%A, %B %d, %Y')

		previous_offset = params['offset'] - articles_per_page
		next_offset = params['offset'] + articles_per_page
		if len(articles) < articles_per_page:
			next_offset = None
		if previous_offset < 0: previous_offset = None
		self.render('blog.html', {
			'pageTitle': 'BLOG',
			'articles': articles,
			'previous_offset': previous_offset,
			'next_offset': next_offset
			})

class BlogArticlePage(BaseHandler):
	def get(self, article_id):
		article = Article.get(article_id)
		if not article:
			self.render('404.html')
			return
		article._id = article.key().id()
		article._created = article.created.strftime('%A, %B %d, %Y')
		self.render('blogArticle.html', {
			'pageTitle': 'BLOG',
			'subTitle': article.title,
			'article': article
			})


def minifyTags(raw_tags):
	tags = []
	for raw_tag in raw_tags:
		raw_tag = raw_tag.strip().lower()
		if raw_tag != "" and raw_tag not in tags:
			tags.append(raw_tag)
	return tags


class BlogAdminPage(BaseHandler):
	"""Admin Page for blog"""
	def get(self):
		user = users.get_current_user()
		if user:
			if users.is_current_user_admin():
				self.render('blogAdmin.html', {
					'pageTitle': 'BLOG ADMIN',
					'logoutUrl': users.create_logout_url('/blog')
					})
				return
		self.write(('<a href="%s">Sign in or register</a>.' %users.create_login_url('/blog/admin')))

	def post(self):
		params = self.get_params_dict(['title', 'pubDate', 'content', 'tags', 'image'])

		title_for_tags = re.sub(r'[^\w]', ' ', params['title'])
		raw_tags = params['tags'].split(',')
		tags = minifyTags(raw_tags)

		article = Article(
			title = force_unicode(params['title']),
			content = force_unicode(params['content']),
			tags = tags,
			image = params['image']
			)
		article.store()

		tags = minifyTags(tags + title_for_tags.split(' '))
		for tag in tags:
			article_tag = ArticleTag.get(tag)
			if not article_tag:
				article_tag = ArticleTag(
					key_name = tag,
					articles = [article.key()]
					)
			else:
				article_tag.articles.append(article.key())
			article_tag.store()

		self.render('blogAdmin.html', {
			'message': 'success'
			})
