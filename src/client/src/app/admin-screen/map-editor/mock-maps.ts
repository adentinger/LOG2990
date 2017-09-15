export let emptyMap = {
    'points': [],
    'name': '',
    'description': '',
    'difficulty': '',
    'type': '',
    'items': {},
    'rating': '0',
    'plays': '0'
};

export let funtionalMap = {
    'points': [{'x': '0', 'y': '0'}, {'x': '10', 'y': '0'}, {'x': '0', 'y': '10'}],
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
    'points': [{'x': '0', 'y': '0'}, {'x': '11', 'y': '0'}, {'x': '0', 'y': '10'}],
    'name': 'name',
    'description': 'description',
    'type': 'sdljhgso',
    'items': {
        'puddles': [{'distance': '3'}, {'distance': '17'}, {'distance': '22'}],
        'potholes': [{'distance': '13'}],
        'speedBoosts': [{'distance': '11'}, {'distance': '12'}, {'distance': '13'}, {'distance': '23'}, {'distance': '27'}]
    },
    'rating': '9',
    'plays': '-1'
};