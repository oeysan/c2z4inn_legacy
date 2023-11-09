---
headless: true
---
<a id="archive-url" href="{{< params subfolder >}}en/archive/?&collection=HJPESYSH">Go to archive</a>
<h1>Overview for Administration</h1>
<div id="stats-descriptives">
<p>Publications: <span class="stats-n">53</span></p>
<p>Sustainable Development Goals: <span class="stats-n">16</span></p>
</div>
<div class="stats-graphs">
<div>{{< chart >}}{
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
                "label": "Publications",
                "data": [
                    12,
                    5,
                    6,
                    9,
                    8,
                    6,
                    7
                ],
                "borderRadius": 0
            },
            {
                "label": "Sustainable Development Goals",
                "data": [
                    2,
                    1,
                    2,
                    1,
                    3,
                    4,
                    3
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
{{< /chart >}}</div><div>{{< chart 550px 500px >}}{
    "type": "doughnut",
    "data": {
        "labels": [
            "Goal 1: No poverty",
            "Goal 3: Good health and well-being",
            "Goal 4: Quality Education",
            "Goal 5: Gender equality",
            "Goal 10: Reduced inequalities",
            "Goal 11: Sustainable cities and communities",
            "Goal 16: Peace, Justice and strong institutions"
        ],
        "datasets": [
            {
                "label": "Publications",
                "data": [
                    1,
                    3,
                    6,
                    1,
                    2,
                    1,
                    2
                ],
                "backgroundColor": [
                    "rgba(229, 36, 59, 1)",
                    "rgba(76, 159, 56, 1)",
                    "rgba(197, 25, 45, 1)",
                    "rgba(255, 58, 33, 1)",
                    "rgba(221, 19, 103, 1)",
                    "rgba(253, 157, 36, 1)",
                    "rgba(0, 104, 157, 1)"
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
  <div class="sdg-container"><div id="sdg4" class="sdg">
<img src="{{< params subfolder >}}images/sdg/sdg04_en.png" class="image" alt="SDG 4">
<div class="sdg-overlay">
<a href="{{< params subfolder >}}en/archive/?sdg=4&collection=HJPESYSH#archive" class="sdg-publication-count"><span>6</span> Publications</a>
<p><a href="https://sdgs.un.org/goals/goal4" class="sdg-read-more">Read More</a></p>
</div>
</div><div id="sdg3" class="sdg">
<img src="{{< params subfolder >}}images/sdg/sdg03_en.png" class="image" alt="SDG 3">
<div class="sdg-overlay">
<a href="{{< params subfolder >}}en/archive/?sdg=3&collection=HJPESYSH#archive" class="sdg-publication-count"><span>3</span> Publications</a>
<p><a href="https://sdgs.un.org/goals/goal3" class="sdg-read-more">Read More</a></p>
</div>
</div><div id="sdg10" class="sdg">
<img src="{{< params subfolder >}}images/sdg/sdg10_en.png" class="image" alt="SDG 10">
<div class="sdg-overlay">
<a href="{{< params subfolder >}}en/archive/?sdg=10&collection=HJPESYSH#archive" class="sdg-publication-count"><span>2</span> Publications</a>
<p><a href="https://sdgs.un.org/goals/goal10" class="sdg-read-more">Read More</a></p>
</div>
</div><div id="sdg16" class="sdg">
<img src="{{< params subfolder >}}images/sdg/sdg16_en.png" class="image" alt="SDG 16">
<div class="sdg-overlay">
<a href="{{< params subfolder >}}en/archive/?sdg=16&collection=HJPESYSH#archive" class="sdg-publication-count"><span>2</span> Publications</a>
<p><a href="https://sdgs.un.org/goals/goal16" class="sdg-read-more">Read More</a></p>
</div>
</div><div id="sdg1" class="sdg">
<img src="{{< params subfolder >}}images/sdg/sdg01_en.png" class="image" alt="SDG 1">
<div class="sdg-overlay">
<a href="{{< params subfolder >}}en/archive/?sdg=1&collection=HJPESYSH#archive" class="sdg-publication-count"><span>1</span> Publication</a>
<p><a href="https://sdgs.un.org/goals/goal1" class="sdg-read-more">Read More</a></p>
</div>
</div><div id="sdg5" class="sdg">
<img src="{{< params subfolder >}}images/sdg/sdg05_en.png" class="image" alt="SDG 5">
<div class="sdg-overlay">
<a href="{{< params subfolder >}}en/archive/?sdg=5&collection=HJPESYSH#archive" class="sdg-publication-count"><span>1</span> Publication</a>
<p><a href="https://sdgs.un.org/goals/goal5" class="sdg-read-more">Read More</a></p>
</div>
</div><div id="sdg11" class="sdg">
<img src="{{< params subfolder >}}images/sdg/sdg11_en.png" class="image" alt="SDG 11">
<div class="sdg-overlay">
<a href="{{< params subfolder >}}en/archive/?sdg=11&collection=HJPESYSH#archive" class="sdg-publication-count"><span>1</span> Publication</a>
<p><a href="https://sdgs.un.org/goals/goal11" class="sdg-read-more">Read More</a></p>
</div>
</div></div>
</div>
