---
headless: true
output: 
  html_document:
    keep_md: true
    preserve_yaml: true
---
<h1>Publications on Sustainable Development Goals</h1>
{{< chart >}}
{
    "type": "doughnut",
    "data": {
        "labels": [
            "Goal 1: No poverty",
            "Goal 2: Zero hunger",
            "Goal 3: Good health and well-being",
            "Goal 4: Quality Education",
            "Goal 5: Gender equality",
            "Goal 6: Clean water and sanitation",
            "Goal 7: Affordable and clean energy",
            "Goal 8: Decent work and economic growth",
            "Goal 9: Industry, innovation and infrastructure",
            "Goal 10: Reduced inequalities",
            "Goal 11: Sustainable cities and communities",
            "Goal 12: Responsible consumption and production",
            "Goal 13: Climate action",
            "Goal 14: Life below water",
            "Goal 15: Life in Land",
            "Goal 16: Peace, Justice and strong institutions",
            "Goal 17: Partnerships for the goals"
        ],
        "datasets": [
            {
                "label": "Publications",
                "data": [
                    37,
                    46,
                    221,
                    163,
                    91,
                    26,
                    27,
                    54,
                    64,
                    189,
                    23,
                    11,
                    43,
                    41,
                    78,
                    110,
                    98
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
{{< /chart >}}
