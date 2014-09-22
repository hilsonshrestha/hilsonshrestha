import webapp2

from controllers.home import HomePage
from controllers.blog import BlogPage, BlogArticlePage, BlogAdminPage
app = webapp2.WSGIApplication([
		('/', HomePage),
		('/blog', BlogPage),
		('/blog/admin', BlogAdminPage),
		('/blog/([^/]+)', BlogArticlePage),
	], debug = True)
