---
headless: true
---
<h1>Publications on Sustainable Development Goals</h1>
{{< chart >}}{
    "type": "line",
    "data": {
        "labels": [
            "2017",
            "2018",
            "2019",
            "2020",
            "2021",
            "2022",
            "2023"
        ],
        "datasets": [
            {
                "label": "INN",
                "data": [
                    143,
                    170,
                    101,
                    133,
                    225,
                    287,
                    313
                ],
                "borderRadius": 0
            },
            {
                "label": "ALB",
                "data": [
                    9,
                    20,
                    11,
                    20,
                    34,
                    48,
                    89
                ],
                "borderRadius": 0
            },
            {
                "label": "HSV",
                "data": [
                    83,
                    72,
                    33,
                    48,
                    89,
                    106,
                    70
                ],
                "borderRadius": 0
            },
            {
                "label": "LUP",
                "data": [
                    13,
                    27,
                    27,
                    23,
                    50,
                    42,
                    47
                ],
                "borderRadius": 0
            },
            {
                "label": "HHS",
                "data": [
                    38,
                    52,
                    30,
                    40,
                    61,
                    86,
                    103
                ],
                "borderRadius": 0
            }
        ]
    },
    "options": {
        "elements": {
            "line": {
                "borderWidth": 2
            }
        },
        "animation": {
            "duration": 500,
            "easing": "linear"
        },
        "maintainAspectRatio": false,
        "responsive": true,
        "scales": {
            "x": {
                "display": true,
                "title": {
                    "display": true,
                    "text": "year"
                },
                "stacked": false,
                "grid": {
                    "display": false
                }
            },
            "y": {
                "display": true,
                "title": {
                    "display": true,
                    "text": "Number of publications"
                },
                "stacked": false,
                "grid": {
                    "display": false
                },
                "beginAtZero": true
            }
        },
        "plugins": {
            "legend": {
                "display": true,
                "position": "bottom"
            }
        }
    }
}
{{< /chart >}}
