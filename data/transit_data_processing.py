# Link to GTFS data for King County Metro Schedule:
# http://metro.kingcounty.gov/gtfs/

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

# Read in data from matching stops to block groups in GIS
stop_join_blockgroups_data = pd.read_csv('./bg_j_stops.csv')[['j_stop_id','GEOID']].dropna()

# Read in data from the King County Metro GTFS
stop_data = pd.read_csv('./google_transit/stops.txt')
schedule_data = pd.read_csv('./google_transit/stop_times.txt')
route_data = pd.read_csv('./google_transit/routes.txt')
trip_data = pd.read_csv('./google_transit/trips.txt')


# Calculate useful intermediate values:
# Number of unique routes servicing a stop
routes_per_stop = pd.merge(trip_data, schedule_data, on='trip_id').groupby('stop_id', as_index=False).nunique()[['stop_id','route_id']]

# Number of unique stops serviced by a given route
stops_per_route = pd.merge(trip_data, schedule_data, on='trip_id').groupby('route_id', as_index=False).nunique()[['route_id','stop_id']]

# Average number of other stops connected to each stop without a transfer
routes_at_stops = pd.merge(schedule_data, trip_data, on='trip_id')[['stop_id','route_id']]
other_stops_accessible_per_stop = pd.merge(routes_at_stops, stops_per_route, on='route_id').groupby('stop_id_x', as_index=False).mean('stop_id_y')[['stop_id_x','stop_id_y']]

# Mean frequency of incoming routes for a given stop
schedules_w_routes = pd.merge(schedule_data, trip_data, on='trip_id')
schedules_w_routes = schedules_w_routes.groupby(['stop_id','route_id'], as_index=False).apply(lambda x: x.sort_values(by='arrival_time', ascending=True))
schedules_w_routes['arrival_time'] = pd.to_datetime(schedules_w_routes['arrival_time'], errors='coerce')
schedules_w_routes['prev_arrival_time'] = schedules_w_routes['arrival_time'].shift(1)
schedules_w_routes['prev_route_id'] = schedules_w_routes['route_id'].shift(1)
schedules_w_routes = schedules_w_routes[schedules_w_routes['prev_route_id'] == schedules_w_routes['route_id']]
schedules_w_routes['headway'] = (schedules_w_routes['arrival_time'] - schedules_w_routes['prev_arrival_time']).dt.total_seconds()/60
mean_stop_frequency = schedules_w_routes.groupby('stop_id', as_index=False).mean()[['stop_id','headway']]


# Calulate Accessibility Factors for a Block Group:
# Number of unique stops
# Average number of unique routes accessible at a stop
# Average frequency of incoming routes at a stop
# Number of other stops accessible without transfer

# Number of unique stops in a block group
stops_per_bg = stop_join_blockgroups_data.groupby('GEOID', as_index=False).nunique()[['GEOID','j_stop_id']]

# Average number of unique routes serving a stop in each block group
routes_per_bg = pd.merge(stop_join_blockgroups_data, routes_per_stop, left_on='j_stop_id', right_on='stop_id').groupby('GEOID', as_index=False).mean()[['GEOID','route_id']]

# Average frequency of incoming routes serving a stop in each block group
freq_per_bg = pd.merge(stop_join_blockgroups_data, mean_stop_frequency, left_on='j_stop_id', right_on='stop_id').groupby('GEOID', as_index=False).mean()[['GEOID','headway']]

# Average number of stops connected to a stop in each block group without a transfer
avg_accessible_stops_per_bg = pd.merge(stop_join_blockgroups_data, other_stops_accessible_per_stop, left_on='j_stop_id', right_on='stop_id_x').groupby('GEOID', as_index=False).mean()[['GEOID','stop_id_y']]


# Join the metrics for each block group and write to .csv
final = pd.merge(stops_per_bg, routes_per_bg, on='GEOID')
final = pd.merge(final, freq_per_bg, on='GEOID')
final = pd.merge(final, avg_accessible_stops_per_bg, on='GEOID')
final.columns = ['GEOID','num_stops','avg_num_routes_per_stop','avg_route_frequency','avg_accessible_stops']
final.to_csv('block_group_data.csv', index=False)
final