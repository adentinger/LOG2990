export let emptyMap = {
    'path': [],
    'name': '',
    'description': '',
    'type': '',
    'items': {'puddles': [], 'potholes': [], 'speedBoosts': []},
    'rating': '0',
    'plays': '0'
};

export let functionalMap = {
    'path': [{'x': '0', 'y': '0'}, {'x': '10', 'y': '0'}, {'x': '0', 'y': '10'}, {'x': '0', 'y': '0'}],
    'name': 'name',
    'description': 'description',
    'type': 'professional',
    'items': {
        'puddles': [{'distance': '11'}, {'distance': '17'}, {'distance': '22'}],
        'potholes': [{'distance': '15'}],
        'speedBoosts': [{'distance': '1'}, {'distance': '6'}, {'distance': '6'}, {'distance': '23'}, {'distance': '27'}]
    },
    'rating': '4',
    'plays': '12'
};

export let disfunctionalMap = {
    'path': {'points': [{'x': 0, 'y': 2}, {'x': 11, 'y': 2}, {'x': 0, 'y': 10}, {'x': 2, 'y': 1}]},
    'name': 'name',
    'description': 'description',
    'type': 'sdljhgso',
    'items': [],
    'rating': 9,
    'plays': -1,
    'height': -2,
    'width': -2
};
