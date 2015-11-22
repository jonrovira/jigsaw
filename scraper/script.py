###########
# IMPORTS #
###########
import csv
from datetime import datetime
import logging
import json
import pycountry
from geopy.geocoders import Nominatim


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


def getLocation(organization):
	if organization in locations:
		l = locations[organization]
	else:
		l = geolocator.geocode(organization)
		locations[organization] = l
	print l
	return l



def incrementInfluence(year, organization):

	if year in influences:
		if organization in influences[year]:
			influences[year][organization]["count"] += 1
		else:
			location = getLocation(organization)
			influences[year][organization] = {
				"count": 1,
				"lat": location.latitude,
				"lng": location.longitude
			}
	else:
		location = getLocation(organization)
		influences[year] = { 
			organization: { 
				"count": 1, 
				"lat": location.latitude, 
				"lng": location.longitude
			}
		}



def calcRowInfluence(row, line, year, topPlasmids):
	plasmid = row[0]
	if plasmid in topPlasmids:
		try:
			rowYear = datetime.strptime(row[6], "%Y-%m-%d %H:%M:%S").year
			if rowYear <= year:
				country = pycountry.countries.get(alpha2=row[4]).alpha3
				incrementInfluence(year, country)
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








########
# MAIN #
########
def main():
	getNames()
	countAndSort()
	calcInfluence()
	writeResults()



if __name__ == "__main__":
	main()