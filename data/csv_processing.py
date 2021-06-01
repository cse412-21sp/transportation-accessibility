import os
import csv

file_dir = "./race.csv"

content = []
with open(file_dir) as csvfile:
    r = csv.reader(csvfile, delimiter=',')
    for i, row in enumerate(r):
        if i == 0:
            content.append(row)
        temp = []
        if i > 0:
            temp += [row[0][9:]]
            for data in row[1:]:
                temp += [data]
        content.append(temp)
    print(content)


with open(file_dir, 'w', newline='') as csvfile:
    w = csv.writer(csvfile)
    for row in content:
        w.writerow(row)
