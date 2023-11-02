---
headless: true
output: 
  html_document:
    keep_md: true
    preserve_yaml: true
---
<h1>Oversikt for Den norske filmskolen</h1>
<div id="stats-descriptives">
<p>Publikasjonar: <span class="stats-n">6</span></p>
<p>Publikasjonar om berekraftsmål: <span class="stats-n">0</span></p>
</div>
<div class="stats-graphs">
    <div>{{< chart >}}
{
    "type": "line",
    "data": {
        "labels": [
            "2020",
            "2021",
            "2022",
            "2023"
        ],
        "datasets": [
            {
                "label": "Publikasjonar",
                "data": [
                    1,
                    2,
                    1,
                    2
                ],
                "borderRadius": 0
            },
            {
                "label": "Berekraftsmål",
                "data": [
                    0,
                    0,
                    0,
                    0
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
{{< /chart >}}</div>
    <div>{{< chart >}}
{
    "type": "doughnut",
    "data": {
        "labels": [
            "Mål 1: Utrydde fattigdom",
            "Mål 2: Utrydde svolt",
            "Mål 3: Gode helse og livskvalitet",
            "Mål 4: God utdanning",
            "Mål 5: Likestilling mellom kjønna",
            "Mål 6: Reint vatn og gode sanitær forhold",
            "Mål 7: Rein energi til alle",
            "Mål 8: Anstendig arbeid og økonomisk vekst",
            "Mål 9: Industri, innovasjon og infrastruktur",
            "Mål 10: Mindre ulikskap",
            "Mål 11: Berekraftig byar og lokalsamfunn",
            "Mål 12: Ansvarleg forbruk og produksjon",
            "Mål 13: Stoppe klimaendringane",
            "Mål 14: Livet i havet",
            "Mål 15: Livet på land",
            "Mål 16: Fred, rettferd og velfungerande institusjonar",
            "Mål 17: Samarbeid for å nå måla"
        ],
        "datasets": [
            {
                "label": "Publikasjonar",
                "data": [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                "backgroundColor": [
                    "rgba(229, 36, 59, 1)",
                    "rgba(221, 166, 58, 1)",
                    "rgba(76, 159, 56, 1)",
                    "rgba(197, 25, 45, 1)",
                    "rgba(255, 58, 33, 1)",
                    "rgba(38, 189, 226, 1)",
                    "rgba(252, 195, 11, 1)",
                    "rgba(162, 25, 66, 1)",
                    "rgba(253, 105, 37, 1)",
                    "rgba(221, 19, 103, 1)",
                    "rgba(253, 157, 36, 1)",
                    "rgba(191, 139, 46, 1)",
                    "rgba(63, 126, 68, 1)",
                    "rgba(10, 151, 217, 1)",
                    "rgba(86, 192, 43, 1)",
                    "rgba(0, 104, 157, 1)",
                    "rgba(25, 72, 106, 1)"
                ],
                "borderRadius": 0
            }
        ]
    },
    "options": {
        "animation": {
            "duration": 500,
            "easing": "linear"
        },
        "maintainAspectRatio": false,
        "responsive": true,
        "scales": {
            "x": {
                "display": false,
                "title": {
                    "display": true
                },
                "stacked": false,
                "grid": {
                    "display": false
                },
                "ticks": {
                    "color": "black"
                }
            },
            "y": {
                "display": false,
                "title": {
                    "display": true
                },
                "stacked": false,
                "grid": {
                    "display": false
                },
                "beginAtZero": true,
                "ticks": {
                    "color": "black"
                }
            }
        },
        "plugins": {
            "datalabels": {
                "color": "black"
            },
            "legend": {
                "display": true,
                "position": "bottom",
                "labels": {
                    "color": "black"
                }
            }
        }
    }
}
{{< /chart >}}</div>
</div>
<div id="sdg-overview">
  <div class="sdg-container"></div>
</div>
