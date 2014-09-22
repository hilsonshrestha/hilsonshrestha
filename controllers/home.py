from base_handler import *
import logging

class HomePage(BaseHandler):
	def get(self):
		self.render('index.html')
