# -*- coding: utf-8 -*-

"""
Tarbell project configuration
"""
from flask import Blueprint, g, render_template
import ftfy
import jinja2

blueprint = Blueprint('chicago-area-bridge-ratings', __name__)

@blueprint.app_template_filter('format_percentage')
def format_percentage(num):
    return "{:.1%}".format(float(num))


# Google spreadsheet key
SPREADSHEET_KEY = "1Qkg9kkfssUHspeltPjSr5fuMy6F40hIlDOOgDJjbhvc"

# Exclude these files from publication
EXCLUDES = ['*.ai', '*.md', 'requirements.txt', 'node_modules', 'sass', 'js/src', 'package.json', 'Gruntfile.js']

# Spreadsheet cache lifetime in seconds. (Default: 4)
# SPREADSHEET_CACHE_TTL = 4

# Create JSON data at ./data.json, disabled by default
# CREATE_JSON = True

# Get context from a local file or URL. This file can be a CSV or Excel
# spreadsheet file. Relative, absolute, and remote (http/https) paths can be 
# used.
# CONTEXT_SOURCE_FILE = ""

# EXPERIMENTAL: Path to a credentials file to authenticate with Google Drive.
# This is useful for for automated deployment. This option may be replaced by
# command line flag or environment variable. Take care not to commit or publish
# your credentials file.
# CREDENTIALS_PATH = ""

# S3 bucket configuration
S3_BUCKETS = {
    # Provide target -> s3 url pairs, such as:
    #     "mytarget": "mys3url.bucket.url/some/path"
    # then use tarbell publish mytarget to publish to it
    
    "production": "graphics.chicagotribune.com/bridge-ratings-in-illinois-2017",
    "staging": "apps.beta.tribapps.com/bridge-ratings-in-illinois-2017",
}

# Default template variables
DEFAULT_CONTEXT = {
    'name': 'bridge-ratings-in-illinois-2017',
    'title': 'Illinois Bridge Ratings'
}