###########
# IMPORTS #
###########
import csv
from datetime import datetime
import logging
import json



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



def incrementInfluence(year, organization):
	if year in influences:
		if organization in influences[year]:
			influences[year][organization] += 1
		else:
			influences[year][organization] = 1
	else:
		influences[year] = { organization: 1 }



def calcRowInfluence(row, line, year, topPlasmids):
	plasmid = row[0]
	if plasmid in topPlasmids:
		try:
			rowYear = datetime.strptime(row[6], "%Y-%m-%d %H:%M:%S").year
			if rowYear <= year:
				organization = row[3]
				incrementInfluence(year, organization)
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
		json.dump(influences, f)




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