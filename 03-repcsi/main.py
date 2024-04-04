def average_sea_length(heights):
    total_sea_length = 0
    sea_segments = 0
    in_sea = False
    sea_length = 0
    
    for height in heights:
        if height == 0:
            if not in_sea:
                in_sea = True
                sea_length = 1
            else:
                sea_length += 1
        else:
            if in_sea:
                in_sea = False
                total_sea_length += sea_length
                sea_segments += 1
    
    if in_sea:
        total_sea_length += sea_length
        sea_segments += 1
    
    if sea_segments == 0:
        return 0
    else:
        return total_sea_length / sea_segments


def getHeights():
    heights = [0, 100, 200, 0, 0, 0, 300, 0, 0, 0, 0, 0, 0, 0, 0, 0, 400, 0, 500, 600, 0]
    return heights

heights = getHeights()

avg_sea_length = average_sea_length(heights)


print("Az átlagos tengerszakasz hossza:", avg_sea_length, "kilométer")