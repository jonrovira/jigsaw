import os
from flask import Flask, render_template, json
from flask_restful import Resource, Api



app = Flask(__name__)
api = Api(app)



class AddgeneData(Resource):
	def get(self):
		SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
		json_url = os.path.join(SITE_ROOT, "static/data", "results.json")
		data = json.load(open(json_url))
		return data



api.add_resource(AddgeneData, '/addgeneData')




@app.route("/")
def index():
	return render_template('index.html')




if __name__ == "__main__":
	app.run()