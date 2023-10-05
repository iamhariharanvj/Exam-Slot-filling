from flask import Flask,request
from flask_cors import CORS
from urllib.parse import unquote
import pandas as pd
import random
import numpy as np
import csv

app = Flask(__name__)
CORS(app)

facData = []
slotData = []

facSlot = dict()
fixDict = dict()

@app.route('/faculty', methods=['POST'])
def getFaculty():
    global facData

    data = request.stream.read()
    data = unquote(data.decode())
    data = "&"+data

    df = pd.DataFrame([x.split(',') for x in data.split('&data[]=')])
    df.dropna(inplace=True)
    facData = df
    facData.to_csv("faculty.csv",index=False)
    with open('faculty.csv','r') as f:
        facData = list(csv.reader(f))

    return data

@app.route('/slot', methods=['POST'])
def getSlot():
    global slotData
    data = request.stream.read()
    data = unquote(data.decode())

    df = pd.DataFrame([x.split(',') for x in data.split('&data[]=')])
    df.dropna(inplace=True)
    slotData = df
    slotData.to_csv("slot.csv",index=False)
    with open('slot.csv','r') as f:
        slotData = list(csv.reader(f))

    data = process()

    return data






def fillSlot(faculty,slot,room,n):
    global fixDict
    global facSlot

    if faculty not in facSlot.keys():
      facSlot[faculty] = []

    if slot not in facSlot[faculty]:
      fixDict[f"{slot} {room[0]}"][n-1] = faculty
      facSlot[faculty].append(slot)

def convert2Dict(data,slot=True):
    dictionary = dict()

    for rowIndex, rows in enumerate(data):
        if rowIndex!=0:    
            if rows[0] not in dictionary.keys() and not(slot):
                dictionary[str(rows[0])] = rows[1]

            else:

                if rows[0] not in dictionary.keys():
                  dictionary[rows[0]] = [[rows[1],rows[2]]]

                dictionary[str(rows[0])].extend([[rows[1],rows[2]]])


    return dictionary




def fillSlot(faculty,slot,room,n):
    global fixDict
    global facSlot

    if faculty not in facSlot.keys():
      facSlot[faculty] = []

    if slot not in facSlot[faculty]:
      fixDict[f"{slot} {room[0]}"][n-1] = faculty
      facSlot[faculty].append(slot)

def convert2Dict(data,slot=True):
    dictionary = dict()

    for rowIndex, rows in enumerate(data):
        if rowIndex!=0:    
            if rows[0] not in dictionary.keys() and not(slot):
                dictionary[str(rows[0])] = rows[1]

            else:

                if rows[0] not in dictionary.keys():
                  dictionary[rows[0]] = [[rows[1],rows[2]]]

                dictionary[str(rows[0])].extend([[rows[1],rows[2]]])


    return dictionary
def process():
    global facSlot
    global facDict
    global slotDict
    global fixDict

    facSlot = dict()
    fixDict = dict()
    facDict = convert2Dict(facData,slot=False)
    slotDict = convert2Dict(slotData)

    for slot in slotDict:
        for room in slotDict[slot]:
            fixDict[f"{slot} {room[0]}"] = ["","",""]

    faculties = facDict
    prevfaculty = None

    for _ in range(10):
        for faculty in faculties:
            maxEntries = facDict[faculty]

            keys = list(slotDict.keys())
            random.shuffle(keys)
                    
            for slot in keys:
                rooms =  slotDict[slot]
                random.shuffle(rooms)

                for room in rooms:
                    m = int(room[1])

                    for n in range(1,m+1):
                        if int(faculties[faculty]) > 0 and fixDict[f"{slot} {room[0]}"][n-1] == "":
                            if int(faculties[faculty]) != 999:
                                if faculty not in facSlot.keys():
                                    facSlot[faculty] = []

                                if faculty!=prevfaculty and slot not in facSlot[faculty] and fixDict[f"{slot} {room[0]}"][1] == "" and faculty != fixDict[f"{slot} {room[0]}"][0]:
                                    fillSlot(faculty=faculty,slot=slot,room=room,n=n)
                                    faculties[faculty] = str(int(faculties[faculty])-1)
                                    prevfaculty = faculty

                                    
                                    


                        elif int(faculties[faculty]) == 0:
                            faculties[faculty] = "999    "

                                        
    print(fixDict,"\n\n")

    dataframe = pd.DataFrame(np.zeros([1,len(slotDict.values())]), columns=slotDict.values())
    dataframe = pd.DataFrame(index = facDict.keys(),
    columns=slotDict.keys())

    for keys in fixDict:
        slot, room = keys.split(" ")

        for faculty in fixDict[keys]:
            dataframe[slot].loc[faculty] = room

    dataframe = dataframe.fillna("-")

    return dataframe.to_html()



app.run(port =5000 ,debug=True)