###########
# IMPORTS #
###########
import csv
from datetime import datetime
import logging
import json
import pycountry
from geopy.geocoders import Nominatim
import locator


#############
# CONSTANTS #
#############
N = 5



##############
# STRUCTURES #
##############
names = {}
counts = {}
influences = {}
locations = {}



#########
# TOOLS #
#########
geolocator = Nominatim()



################################
# PYTHON SWITCH IMPLEMENTATION #
################################
class switch(object):
    def __init__(self, value):
        self.value = value
        self.fall = False

    def __iter__(self):
        yield self.match
        raise StopIteration
    
    def match(self, *args):
        if self.fall or not args:
            return True
        elif self.value in args:
            self.fall = True
            return True
        else:
            return False



#############
# FUNCTIONS #
#############
def getNames():
	with open('plasmid_order_data_report.csv', 'rb') as f:
		reader = csv.reader(f)
		for row in reader:
			ID = row[0]
			name = row[1]
			names[ID] = name



def incrementCount(plasmid, year):
	if year in counts:
		if plasmid in counts[year]:
			counts[year][plasmid] += 1
		else:
			counts[year][plasmid] = 1
	else:
		counts[year] = { plasmid: 1 }



def countRow(row, line):
	plasmid = row[0]
	try:
		year = datetime.strptime(row[6], "%Y-%m-%d %H:%M:%S").year
		incrementCount(plasmid, year)
	except ValueError:
		logging.warning("Order in row " + str(line) + " didn't fit expected format")



def countAndSort():
	with open('plasmid_order_data_report.csv', 'rb') as f:
		reader = csv.reader(f)
		for row in reader:
			countRow(row, reader.line_num)



def getLocation(country, state):
	if country == "USA":
		try:
			s = locator.stringToState(state)
			bin = country + "-" + s
			if bin in locations:
				l = locations[bin]
			else:
				l = geolocator.geocode(s + ", " + country)
				locations[bin] = l

		except KeyError:
			bin = country
			if bin in locations:
				l = locations[country]
			else:
				l = geolocator.geocode(country)
				locations[bin] = l

	else:
		bin = country
		if bin in locations:
			l = locations[country]
		else:
			l = geolocator.geocode(country)
			locations[bin] = l

	return {
		'bin': bin,
		'lat': l.latitude,
		'lng': l.longitude
	}



def incrementInfluence(year, country, state):
	location = getLocation(country, state)

	if year in influences:
		if location['bin'] in influences[year]:
			influences[year][location['bin']]["count"] += 1
		else:
			influences[year][location['bin']] = {
				"count": 1,
				"lat": location['lat'],
				"lng": location['lng']
			}
	else:
		influences[year] = {
			location['bin']: {
				"count": 1,
				"lat": location['lat'],
				"lng": location['lng']
			}
		}



def calcRowInfluence(row, line, year, topPlasmids):
	plasmid = row[0]
	if plasmid in topPlasmids:
		try:
			rowYear = datetime.strptime(row[6], "%Y-%m-%d %H:%M:%S").year
			if rowYear <= year:
				country = pycountry.countries.get(alpha2=row[4]).alpha3
				state = row[5]
				incrementInfluence(year, country, state)
		except ValueError:
			logging.warning("Order in row " + str(line) + " didn't fit expected format")



def calcInfluence():
	for year in counts:
		topPlasmids = sorted(counts[year], key=counts[year].get, reverse=True)[:N]
		with open('plasmid_order_data_report.csv', 'rb') as f:
			reader = csv.reader(f)
			for row in reader:
				calcRowInfluence(row, reader.line_num, year, topPlasmids)



def writeResults():
	with open ('../static/data/results.json', 'w') as f:
		json.dump(influences, f, indent=4)



def getTopOrgs():
	orgCounts = {}
	orgPersons = {}

	with open('plasmid_order_data_report.csv', 'rb') as f:
		reader = csv.reader(f)
		for row in reader:
			org = row[3]
			if org in orgCounts:
				orgCounts[org] += 1
			else:
				orgCounts[org] = 1

	topOrgs = sorted(orgCounts, key=orgCounts.get, reverse=True)[:85]

	for topOrg in topOrgs:
		with open('deposit_data_report.csv', 'rb') as f:
			reader = csv.reader(f)
			for row in reader:
				org = str(row[3])
				if org == str(topOrg):
					person = row[2]
					orgPersons[org] = {
						"person": person,
						"index": topOrgs.index(org)
					}

	print orgPersons










########
# MAIN #
########
def main():

	# getNames()
	# countAndSort()
	# calcInfluence()
	# writeResults()

	getTopOrgs()



if __name__ == "__main__":
	main()