# CSE412 Final Project: Transportation Accessibility

## Team Members

Zack Aemmer
Patrick Cheng
Avin Kana
Jie Shao

### Contribution Statements

Zack Aemmer: Created accessibility metrics dataset, wrote narrative and made visualizations (with help on interactive maps) prior to "Who is affected" section, D3 map (didn't use it), interactive income histogram/map visualization

Patrick Cheng: Prepared data, took meeting notes, created static visualizations for "Race vs Accessibility" section, helped created the interactive map, made the video, website aesthetics.

Avin Kana: Prepared data, univariate analysis visualizations/text, income vs accessibility scatter plots/text

Jie Shao: Web layout design & aesthetics

## Project Proposal Abstract

In this project we explore the current level of transit accessibility for block groups in Seattle. Our main question is which areas currently have the most, and least access to transit in King county. We follow this up with an analysis of who is most affected in areas with low transit coverage, and potentially allow the viewer to interactively place transit stops or change service parameters to view the effects on accessibility. To accomplish this we first quantify accessibility based on the KCM GTFS transit stop locations and schedules, and create a choropleth map as our main visualization.

## Getting Started

This template is a starting place for your project. Update the header information to include the relevant details for your project, and then feel free to mix and match the visualization and layout techniques introduced here for your own narrative.

Think about how the narrative structure draws readers into the story you are telling and how the visualizations interact with the text (and with each other). The narrative should help ensure that the page as a whole is greater than just the sum of it's parts. When designing your page, decide on particular layouts that enhance the reader's experience and understanding of the topic.

### Required Software

You must have Node.js installed. You can get it directly from https://nodejs.org/en/.

### Installation

- Clone and open your project repo on your own computer.
- Make sure you have `idyll` installed (`npm i -g idyll`).
- Run `npm install` to install project-specific dependencies.

npm is the node package manager. If you're curious how this works and what the project dependencies are, open up `package.json` to see where these are listed.

You can install custom dependencies by running `npm install <package-name> --save`. Note that any collaborators will also need to download the package locally by running `npm install` after pulling the changes.

### Developing a post locally

Run `idyll` from the command line. Your post will appear at [http://localhost:3000/](http://localhost:3000/). When the server is running, any local change that you make will be deteched and your webpage will auto-update with the new changes. Your local changes will not be visible to your team members until you push the changes to your repository. These changes will not be reflected in the final website unless you run the build script and push the updated docs folder (see below).

### Building a post for production

Run `idyll build`. The output will appear in the top-level `build` folder. To change the output location, change the `output` option in `package.json`.

### Deploying

Make sure your post has been built, then commit the `docs` folder to your project repository. It will be available at [cse412-21sp.github.io/your-repo-name/](). For example, you can view the sample embedded Tableau, vega-lite, and d3 charts at [https://cse412-21sp.github.io/Final-Project-Template](https://cse412-21sp.github.io/Final-Project-Template).

#### Acknowledgements

This template was adapted from the initial Scrollytelling template for Idyll. The code and visualization examples were adapted from the [final project template](https://github.com/cse412-21w/project-demo) created for a previous offering of CSE 412.
