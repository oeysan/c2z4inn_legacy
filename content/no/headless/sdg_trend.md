---
headless: true
---
<h1>Publikasjonar om berekraftsmål</h1>
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
                    302
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
                    86
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
                    65
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
                    46
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
                    101
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
                    "text": "År"
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
                    "text": "Tal på publikasjonar"
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
