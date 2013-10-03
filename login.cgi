#!/usr/bin/python

import sys
import cgi
import cgitb
cgitb.enable()

sys.stderr = sys.stdout

form = cgi.FieldStorage()
form_dict = {}
  
print "Content-type: text/html"
print ""
print "cgi test"
