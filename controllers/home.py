from base_handler import *
import logging
# import json
# import datetime
# import urllib2


class HomePage(BaseHandler):
	def get(self):
		self.render('index.html')
