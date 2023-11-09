# Set working directory
setwd(dirname(rstudioapi::getSourceEditorContext()$path))
Sys.setenv(LANG = "EN")
rm(list=ls())
graphics.off()
source("backend.R")

# Fetch Norwegian library
lib.no <- GetLibrary(
  lang = "no", 
  locale = "nn-NO", 
  start.date = "2017-01",
  end.date = "2023-11",
  update = TRUE,
  post = TRUE
)

# Fetch English library
lib.en <- GetLibrary(
  lang = "en", 
  locale = "en-US", 
  start.date = "2017-01",
  end.date = "2023-11",
  update = TRUE,
  post = FALSE
)

# Create SDG overview
SdgOverview("no")
SdgOverview("en")

# Create about
About("no")
About("en")

# Create doughtnuts
SdgDoughnut("no")
SdgDoughnut("en")

# Create SDG per units
SdgUnits("no")
SdgUnits("en")

# Create SDG trend
SdgTrend("no")
SdgTrend("en")

# Create stats
CreateStats("no")
CreateStats("en")

# Render README
RenderSave(
  "README.Rmd", 
  output.format = "github_document",
  keep.yaml = FALSE,
  remove.blank = FALSE
)
commit.name <- "c2z4uni 0.1.0.9015"
branch.name <- "main"

init <- system(
  "git init",
  show.output.on.console = TRUE
)
add.files <- system(
  "git add *",
  show.output.on.console = TRUE
)
commit.files <- system(
  sprintf("git commit -m \"%s\"", commit.name),
  show.output.on.console = TRUE
)
origin <- system(
  "git remote add origin git@github.com:oeysan/c2z4inn.git",
  show.output.on.console = TRUE
)
branch <- system(
  sprintf("git branch -M %s", branch.name),
  show.output.on.console = FALSE
)
push <- system(
  sprintf("git push -u origin %s", branch.name),
  show.output.on.console = TRUE
)
