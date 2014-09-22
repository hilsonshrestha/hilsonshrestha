import webapp2

from controllers.home import HomePage
from controllers.blog import BlogPage, BlogArticlePage, BlogAdminPage
from controllers.portfolio import PortfolioPage
app = webapp2.WSGIApplication([
		('/', HomePage),

		('/blog', BlogPage),
		('/blog/admin', BlogAdminPage),
		('/blog/([^/]+)', BlogArticlePage),

		('/portfolio', PortfolioPage),
	], debug = True)
