# Basic webapp2 handler with some useful methods
#
# render(template_name, template_vals={})
# - template needs to be in template dir
#
#
# WORKING WITH COOKIES
#
# set_cookie(name, value)
# set_cookies({name1:value1, name2:value2})
# get_cookie(name)
# get_cookies([name1, name2...])      - return [value1, value2...]
# get_cookies_dict([name1, name2...]) - return {name1:value1, name2:value2}
# remove_cookie(name)
# remove_cookies([name1, name2...])
#
# RETRIVING REQUEST PARAMS
#
# get_params([param1, param2...])      - return [value1, value2...]
# get_params_dict([param1, param2...]) - return {param1:value1, param2:value2}
#
# CREATING RESPONSE
#
# write(value)



import webapp2
import jinja2
import os

import json

# from google.appengine.api import memcache
import re
import sys
#sys.path.insert(0, 'libs')
import datetime
from HTMLParser import HTMLParser


def unix_time(dt):
    epoch = datetime.datetime.utcfromtimestamp(0)
    delta = dt - epoch
    return delta.total_seconds()

def force_unicode(string):
    ''' Forces the string type to be unicode. Usefull while performing db write. '''
    if type(string) == unicode:
        return string
    return string.decode('utf-8')


head, tail   = os.path.split(os.path.dirname(__file__))
template_dir = os.path.join(head, "templates")

jinja_environment = jinja2.Environment(loader = jinja2.FileSystemLoader(template_dir), autoescape = False)



# strip html tags
class MLStripper(HTMLParser):
    def __init__(self):
        self.reset()
        self.fed = []
    def handle_data(self, d):
        self.fed.append(d)
    def get_data(self):
        return ''.join(self.fed)
def strip_tags(html):
    s = MLStripper()
    s.feed(html)
    return s.get_data()



class BaseHandler(webapp2.RequestHandler):
	def render(self, template, vals={}):
		template = jinja_environment.get_template("%s" % template)
		self.response.out.write(template.render(vals))

	def set_cookie(self, name, value, expires = ''):
		name, value, expires = str(name), str(value), str(expires)
		self.response.headers.add_header('Set-Cookie', '%s=%s; Expires=%s; Path=/' % (name, value, expires))

	def set_cookies(self, pairs):
		for k, v in pairs.iteritems():
			self.set_cookie(k, v)

	def get_cookie(self, name):
		return self.request.cookies.get(name)

	def get_cookies(self, names):
		return [self.get_cookie(name) for name in names]

	def remove_cookie(self, name):
		self.set_cookie(name, '', 'Thu, 01-Jan-1970 00:00:00 GMT')

	def remove_cookies(self, names):
		for i in names:
			self.remove_cookie(i)

	def get_cookies_dict(self, names):
		return {name:self.get_cookie(name) for name in names}

	def get_params(self, params):
		return [self.request.get(param) for param in params]

	def get_params_dict(self, params):
		return {param : self.request.get(param) for param in params}

	def write(self, value):
		self.response.out.write(value)

	def json_write(self, dict):
		self.write(json.dumps(dict))
