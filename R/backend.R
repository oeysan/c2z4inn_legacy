# Import packages
library("c2z")
library("c2z4uni")
library("htmltools")
library("dplyr")
# Define proejct dir (i.e., outside R folder)
setwd(normalizePath(file.path(getwd(), "..")))
# Define local.storage
local.storage <- file.path(getwd(), "storage")
# Define R folder
r.folder <- file.path(getwd(), "R")
# Define content
content <- file.path(getwd(), "content")
# Path to no publications
pub.no <- file.path(content, "no", "pub")
# Path to en publications
pub.en <- file.path(content, "en", "pub")
# Define headless Rmd
headless <- file.path(r.folder, "headless.Rmd")
# Define about.no Rmd
about.no <- file.path(r.folder, "about_no.Rmd")
# Define about.en Rmd
about.en <- file.path(r.folder, "about_en.Rmd")
# Define zotero
zotero <- c2z::Zotero(
  user = FALSE,
  token = "ZOTERO_HINN",
  token.api = "ZOTERO_HINN_API"
)
# SDG model path
sdg.model <- 'C:/sdg/models/aurora-sdg/'
# SDG script path
sdg.script <- file.path(getwd(), "python/predict_sdg.py")

################################################################################
###############################Internal Data####################################
################################################################################

sdg.data <<- readRDS(file.path(local.storage, "sdg_predictions.rds")) |>
  c2z4uni:::SdgCutoff()
items <<- readRDS(file.path(local.storage, "items.rds"))

################################################################################
###############################Internal Functions###############################
################################################################################

#' @title RemoveBlank
#' @keywords internal
#' @noRd
RemoveBlank <- \(input.file, output.file = NULL) {
  
  if (is.null(output.file)) output.file <- input.file
  
  # Read the content of the input file
  lines <- readLines(input.file, warn = FALSE, encoding = "UTF-8")
  
  # Remove blank lines
  non.blank.lines <- lines[lines != ""]
  
  # Open the output file for writing (UTF-8 encoding)
  file.conn <- file(output.file, open = "w", encoding = "UTF-8")
  
  # Write the non-blank lines to the output file
  cat(non.blank.lines, file = file.conn, sep = "\n")
  
  # Close the output file
  close(file.conn)
  
  cat("Blank lines removed and saved to", output.file, "\n")
}

#' @title Colors
#' @keywords internal
#' @noRd
Colors <- \(palette, n, rgb = FALSE, alpha = NULL, wesanderson = FALSE) {
  
  if (wesanderson) {
    
    colors <- wesanderson::wes_palettes[[palette]][seq_len(n)]
    
  } else {
    
    colors <- RColorBrewer::brewer.pal(n, palette)
    
  }
  
  if (rgb) {
    
    rgb.colors <- grDevices::col2rgb(colors)
    colors <- unlist(lapply(seq_len(ncol(rgb.colors)), \(i) {
      c2z:::ToString(c(rgb.colors[, i], alpha))
    }))
    
  }
  
  return (colors)
  
}

#' @title RemoveEmpty
#' @keywords internal
#' @noRd
RemoveEmpty <- function(x) {
  if (is.list(x)) {
    x <- purrr::discard(x, ~ identical(.x, NULL)) |>
      purrr::map(RemoveEmpty)
  }
  return (Filter(\(x) any(length(x)), x))
}

#' @title RenderSave
#' @keywords internal
#' @noRd
RenderSave <- \(Rmd.path,
                params,
                md.dir = NULL,
                md.name = NULL,
                silent = TRUE,
                remove.blank = TRUE) {
  
  # Find Rmd name
  Rmd.name <- basename(Rmd.path)
  # Define md.path if not defined
  if (is.null(md.dir)) {
    md.dir <- dirname(Rmd.path)
  }
  # Replace Rmd twith md if md.name is not defined
  if (is.null(md.name)) {
    md.name <- gsub("Rmd", "md", Rmd.name)
    # Else append md to defined md name
  } else {
    md.name <- paste0(md.name, ".md")
  }
  # Render Rmd
  rmarkdown::render(
    input  = Rmd.path,
    params = params,
    output_file = md.name,
    output_dir = md.dir,
    quiet = silent
  )
  
  # Remove blank lines from md
  if (remove.blank) {
    RemoveBlank(file.path(md.dir, md.name))
  }
  
}

#' @title CreateChart
#' @keywords internal
#' @noRd
CreateChart <- function(
    type,
    labels,
    dataset.labels = NULL,
    datasets,
    background.color = NULL,
    fill.background = TRUE,
    legend = TRUE,
    legend.position = "bottom",
    font.color = NULL,
    stack.x = FALSE,
    stack.y = FALSE,
    border.color = NULL,
    border.width = NULL,
    border.radius = 0,
    bar.width = NULL,
    x.axis = TRUE,
    x.text = NULL,
    x.text.color = NULL,
    x.grid = FALSE,
    x.grid.color = NULL,
    y.axis = TRUE,
    y.text = NULL,
    y.text.color = NULL,
    y.grid = FALSE,
    y.grid.color = NULL,
    y.zero = TRUE,
    r.axis = FALSE,
    r.grid.color = NULL,
    r.background = NULL,
    responsive = TRUE,
    aspect.ratio = FALSE,
    line.width = NULL,
    point.background = NULL,
    point.border = NULL,
    point.background.hover = NULL,
    point.border.hover = NULL
) {
  
  # Function to set lenght of variables
  LengthElement <- function(element, dataset) {
    if (!any(length(element))) {
      return (NULL) 
    } else if (length(element) != length(dataset)) {
      return(rep(element[[1]], length(dataset)))
    } else if (length(element) == length(dataset)) {
      return(element)
    }
  }
  
  # Checkup
  dataset.labels <- LengthElement(dataset.labels, datasets)
  background.color <- LengthElement(background.color, datasets)
  border.color <- LengthElement(border.color, datasets)
  border.width <- LengthElement(border.width, datasets)
  border.radius <- LengthElement(border.radius, datasets)
  bar.width <- LengthElement(bar.width, datasets)
  
  # Create a list of dataset configurations
  dataset.configs <- lapply(seq_along(datasets), function(i) {
    list(
      label = dataset.labels[[i]],
      data = datasets[[i]],
      backgroundColor = background.color[[i]],
      borderColor = border.color[[i]],
      borderWidth = border.width[[i]],
      borderRadius = border.radius[[i]],
      barThickness = bar.width[[i]]
    )
  })
  
  # Create the scales configuration
  scales.config <- list(
    x = list(
      display = x.axis,
      title = list(
        display = TRUE,
        text = x.text,
        color = x.text.color
      ),
      stacked = stack.x,
      grid = list(
        display = x.grid,
        color = x.grid.color
      ),
      ticks = list(
        color = font.color
      )
    ),
    y = list(
      display = y.axis,
      title = list(
        display = TRUE,
        text = y.text,
        color = y.text.color
      ),
      stacked = stack.y,
      grid = list(
        display = y.grid,
        color = y.grid.color
      ),
      beginAtZero = y.zero,
      ticks = list(
        color = font.color
      )
    )
  )
  
  if (r.axis) {
    r.axis = list(
      angleLines = list(
        color = r.grid.color
      ),
      grid = list(
        color = r.grid.color
      ),
      ticks = list(
        color = font.color,
        backdropColor = r.background
      ),
      pointLabels = list(
        color = font.color
      )
    )
    scales.config <- c(scales.config, r = r.axis)
  }
  
  data <- list(
    type = type,
    data = list(
      labels = labels,
      datasets = dataset.configs
    ),
    options = list(
      elements = list(
        line = list(
          borderWidth = line.width
        )
      ),
      animation = list(
        duration = 500,
        easing = "linear"
      ),
      maintainAspectRatio = aspect.ratio,
      responsive = responsive,
      scales = scales.config, # Add scales configuration
      plugins = list(
        datalabels = list(
          color = font.color
        ),
        legend = list(
          display = legend,
          position = legend.position,
          labels = list(
            color = font.color
          )
        )
      )
    )
  )
  
  # Serialize the JSON structure and remove empty objects
  json <- RemoveEmpty(data) |>
    jsonlite::toJSON(auto_unbox = TRUE) |>
    jsonlite::prettify() |>
    # String to function
    (function(x) gsub("\"\\*code\\*|\\*code\\*\"", "", x))()
  
  return(json)
  
}

#' @title SdgColors
#' @keywords internal
#' @noRd
SdgColors <- \(alpha = 1) {
  c(
    sprintf("rgba(229, 36, 59, %s)", alpha),
    sprintf("rgba(221, 166, 58, %s)", alpha),
    sprintf("rgba(76, 159, 56, %s)", alpha),
    sprintf("rgba(197, 25, 45, %s)", alpha),
    sprintf("rgba(255, 58, 33, %s)", alpha),
    sprintf("rgba(38, 189, 226, %s)", alpha),
    sprintf("rgba(252, 195, 11, %s)", alpha),
    sprintf("rgba(162, 25, 66, %s)", alpha),
    sprintf("rgba(253, 105, 37, %s)", alpha),
    sprintf("rgba(221, 19, 103, %s)", alpha),
    sprintf("rgba(253, 157, 36, %s)", alpha),
    sprintf("rgba(191, 139, 46, %s)", alpha),
    sprintf("rgba(63, 126, 68, %s)", alpha),
    sprintf("rgba(10, 151, 217, %s)", alpha),
    sprintf("rgba(86, 192, 43, %s)", alpha),
    sprintf("rgba(0, 104, 157, %s)", alpha),
    sprintf("rgba(25, 72, 106, %s)", alpha)
  )
}

#' @title SdgLabels
#' @keywords internal
#' @noRd
SdgLabels <- \(lang = "no") {
  
  if (lang == "no") {
    
    # Example usage with an unknown number of groups
    labels <- c(
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
    )
    
  } else {
    
    labels <- c(
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
    )
    
  }
}

#' @title SdgDoughnut
#' @keywords internal
#' @noRd
SdgDoughnut <- \(lang) {
  
  # Define SDG Labels
  labels <- SdgLabels(lang)
  
  # Define SDG dataset
  datasets <- list(
    as.numeric(sdg.data$sum)
  )
  
  # Define SDG colors
  background.color <- list(SdgColors())
  
  # Set type as doughnut
  type <- "doughnut"
  
  # Label at bottom
  position <- "bottom"
  
  # Create chart
  chart <- CreateChart(
    type = type,
    labels = labels, 
    dataset.labels = c2z4uni:::Dict("publications", lang, 2),
    datasets = datasets, 
    background.color = background.color,
    font.color = "black",
    x.axis = FALSE,
    y.axis = FALSE
  )
  
  # Complete shortcode
  shortcode <- paste('{{< chart >}}\n', chart, '\n{{< /chart >}}', sep = '')
  
  # Create HTML 
  html <- tagList(
    h1(c2z4uni:::Dict("sdg.publications", lang, 1)),
    HTML(shortcode)
  )
  
  # Add to MD file
  RenderSave(
    headless,
    params = list(html = as.character(html)),
    md.dir = file.path(content, lang, "headless"),
    md.name = "sdg_doughnut"
  )
}

#' @title SdgOverview
#' @keywords internal
#' @noRd
SdgOverview <- \(lang) {
  
  # Fetch data
  sdg <- c2z4uni:::SdgInfo(
    sdg.data$sum,
    lang = lang,
    sdg.path = "{{< params subfolder >}}images/sdg"
  ) |>
    paste(collapse = "")
  
  # Create HTML
  html <- tagList(
    h1(c2z4uni:::Dict("sdg", lang)),
    div(class = "sdg-container") |>
      tagAppendChild(HTML(sdg))
  )
  
  # Add to MD
  RenderSave(
    headless,
    params = list(html = as.character(html)),
    md.dir = file.path(content, lang, "headless"),
    md.name = "sdg"
  )
}

#' @title SdgUnits
#' @keywords internal
#' @noRd
SdgUnits <- \(lang) {
  
  
  unit.paths <- readRDS(
    file.path(local.storage, sprintf("unit_paths_%s.rds", lang))
  )
  bibliography <- readRDS(
    file.path(local.storage, sprintf("monthlies_%s.rds", lang))
  )
  
  
  # Function to find sdg per unit
  SdgData <- \(x) {
    sdg <- sdg.data$sdg |> 
      dplyr::semi_join(
        bibliography |>
          dplyr::filter(grepl(x, collections)), 
        by = "key"
      ) |>
      c2z4uni:::SdgCutoff()
    
    return (sdg$sum)
  }
  
  # Main publishing faculties
  ids <- c("209.2.0.0", "209.4.0.0", "209.5.0.0", "209.6.0.0")
  # Find units
  units <- dplyr::filter(unit.paths, id %in% ids) |>
    dplyr::mutate(
      sdg = purrr::map(key, SdgData)
    )
  
  labels <- c("ALB", "HSV", "LUP", "HHS")
  dataset.labels <- as.list(SdgLabels())
  datasets <- as.list((dplyr::bind_rows(units$sdg)))
  background.color <- as.list(SdgColors(1))
  # Create a stacked bar chart shortcode
  chart <- CreateChart(
    type = "bar",
    labels = labels,
    dataset.labels = dataset.labels,
    datasets = datasets,
    background.color = background.color,
    font.color = "black",
    stack.x = TRUE,
    stack.y = TRUE
  )
  
  shortcode <- paste('{{< chart >}}\n', chart, '\n{{< /chart >}}', sep = '')
  
  # Create HTML 
  html <- tagList(
    h1(c2z4uni:::Dict("sdg.publications", lang, 1)),
    HTML(shortcode)
  )
  
  RenderSave(
    headless,
    params = list(html = as.character(html)),
    md.dir = file.path(content, lang, "headless"),
    md.name = "sdg_units"
  )
  
}

#' @title About
#' @keywords internal
#' @noRd
About <- \(lang) {
  RenderSave(
    eval(parse(text = paste0("about.", lang))),
    params = list(html = as.character(html)),
    md.dir = file.path(content, lang, "headless"),
    md.name = "about",
    remove.blank = FALSE
  )
}

#' @title SendEmail
#' @keywords internal
#' @noRd
SendEmail <- \(subscribers, email.data, silent = FALSE) {
  
  email <- emayili::envelope(
    reply = "oystein.skaar@inn.no",
    to = "CRIStin Bot <c2z.tool@gmail.com>",
    from = "CRIStin Bot <c2z.tool@gmail.com>",
    bcc = subscribers,
    subject = email.data$subject,
    html = email.data$body
  )
  
  smtp <- emayili::server(
    host = "smtp.gmail.com",
    port = 465,
    username = "c2z.tool@gmail.com",
    password = Sys.getenv("GMAIL_API")
  )
  
  send <- c2z:::Online(smtp(email), message = "Newsletter", silent = silent)
  
}

MdFiles <- \(path) {
  # List all .md files in the directory
  all.md.files <- list.files(path, pattern = "\\.md$")
  # Use grep to filter out _index
  md.files <- all.md.files[!grepl("_index\\.md$", basename(all.md.files))]
  
  return (md.files)
}

#' @title GetLibrary
#' @keywords internal
#' @noRd
GetLibrary <- \(lang, 
                locale, 
                unit.key = "209.0.0.0",
                email.unit = NULL,
                user.cards = TRUE,
                start.date = NULL, 
                end.date = NULL, 
                post = FALSE,
                update = FALSE,
                full.update = FALSE,
                silent = FALSE,
                log = list()) {
  
  
  # Fetch updated data if update is TRUE
  if (update) {

    # Set star date as 1 month ago from floored sys.date
    ## Eg. "2023-10-10" -> "2023-10-01" -> "2023-09-01"
    if (is.null(start.date)) {
      start.date <- c2z:::ChangeDate(c2z:::FloorDate(Sys.Date()), -1)
    }
    
    # Fetch library
    cristin.monthly <- CristinMonthly(
      zotero,
      unit.key = unit.key,
      start.date = start.date,
      end.date = end.date,
      local.storage = local.storage,
      sdg.model = sdg.model,
      sdg.script = sdg.script,
      locale = locale,
      post = post,
      full.update = full.update,
      lang = lang
    )
    
  }
  
  # Fetch data
  sdg.data <<- readRDS(file.path(local.storage, "sdg_predictions.rds")) |>
    c2z4uni:::SdgCutoff()
  items <<- readRDS(file.path(local.storage, "items.rds"))
  cristin.monthly <- list(
    unit.paths = readRDS(
      file.path(local.storage, sprintf("unit_paths_%s.rds", lang))
    ),
    monthlies = readRDS(
      file.path(local.storage, sprintf("monthlies_%s.rds", lang))
    )
  )
  updated.keys <<- readRDS(file.path(local.storage, "updated_keys.rds"))
  
  # Log
  log <-  c2z:::LogCat(
    "Creating email",
    silent = silent,
    log = log
  )
  
  if (is.null(email.unit)) email.unit <- unit.key
  
  # Create email
  email <- CristinMail(
    unit.key = email.unit, 
    cristin.monthly, 
    lang = lang
  )
  
  # Log
  log <-  c2z:::LogCat(
    "Creating JSON data",
    silent = silent,
    log = log
  )
  
  # Create JSON data
  
  ## File path
  json.path <- file.path(
    getwd(), "static", "data", paste0("data_", lang, ".json.gz")
  )
  
  ## Create JSON data
  json <- CristinJson(
    cristin.monthly, 
    user.cards = user.cards,
    local.storage = local.storage, 
    lang = lang
  )
  # Specify the compressed file path
  compressed.file <- gzfile(json.path, "wb")
  # Write the compressed JSON data to the file
  writeLines(json, con = compressed.file)
  # Close the compressed file
  close(compressed.file)
  
  # Creating publication folder if it does not exist
  pub <- if (lang == "no") pub.no else pub.en
  dir.create(
    pub,
    showWarnings = FALSE,
    recursive = TRUE
  )

  # MD files in publications without extension that are not updated
  md.files <- gsub("\\.md", "", MdFiles(pub)) |>
    stringr::str_replace("\\.md", "")
  # Non-updated md files
  old.md <- md.files |>
    stringr::str_subset(
      paste(updated.keys, collapse = "|"), 
      negate = TRUE
    )
  # Deleted md files
  deleted.md  <- md.files |>
    stringr::str_subset(
      paste(cristin.monthly$monthlies$key, collapse = "|"), 
      negate = TRUE
    )
  
  # Remove deleted files
  if (any(length(deleted.md))) {
    
    # Log
    log <-  c2z:::LogCat(
      "Deleting removed MD files",
      silent = silent,
      log = log
    )
    
    file.remove(file.path(pub, paste0(deleted.md, ".md")))
  }
  
  # Filter out non-updated md files
  new.pages <- cristin.monthly$monthlies |>
    dplyr::filter(!key %in% old.md)
  
  # Log
  log <-  c2z:::LogCat(
    "Creating MD files",
    silent = silent,
    log = log
  )
  
  # Create web pages
  web <- CristinWeb(
    new.pages,
    sdg.data, 
    "{{< params subfolder >}}images/sdg",
    user.cards = user.cards, 
    local.storage = local.storage, 
    lang = lang
  )
  
  # Log
  log <-  c2z:::LogCat(
    "Saving MD files",
    silent = silent,
    log = log
  )
  
  # Write individual MD files
  # Start time for query
  query.start <- Sys.time()
  # Cycle through monthlies and create markdowns
  for (i in seq_len(nrow(web))) {
    item <- web[i, ]
    path <- file.path(pub, paste0(item$key, ".md"))
    writeLines(c("---", item$frontmatter ,"---", item$html), path)
    # Estimate time of arrival
    log.eta <-
      c2z:::LogCat(
        c2z:::Eta(
          query.start,
          i,
          nrow(web)
        ),
        silent = silent,
        flush = TRUE,
        log = log,
        append.log = FALSE
      )
  }
  
  # Create return list
  return.list <- list(
    monthly = cristin.monthly,
    email = email,
    web = web,
    json = json
  )
  
  return(return.list)
  
}
