from flask import Blueprint


app_views = Blueprint(__name__, 'app_views', url_prefix='/api/v1')

from api.v1.views.index import *
from api.v1.views.states import *
from api.v1.views.places_reviews import*
