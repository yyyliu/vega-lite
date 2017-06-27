---
layout: docs
menu: docs
title: Composite Mark
permalink: /docs/compositemark.html
---

Composite marks are "macros" for more complex layered graphics with multiple primitive marks. Currently, we include only one composite mark type: `box-plot`.

## Box Plot

`box-plot` composite mark represents a [box plot](https://en.wikipedia.org/wiki/Box_plot). The middle tick in the box represents the median. The lower and upper part of the box represents quartile 1 and 3 respectively. The ends of the whiskers can represent several possible alternative values, depending on the [`extent`](#box-plot-types) property.
<!-- FIXME: why is box plot important? (e.g., showing summary blah blah.) Basically we give novice a sense why Boxplot is important in 1-2 sentences.-->
<!-- TODO: Ideally we should have an annotated figure for this, but let's not do it for now-->

To create a box plot, you can set `mark` to `"box-plot"`:

{: .suppress-error}
```json
{
  ...
  "mark": "box-plot",
  ...
}
```

Alternatively, you can use box plot's mark definition object, which supports the following properties:

{% include table.html props="type,extent,orient" source="BoxPlotDef" %}
<!-- FIXME update BoxPlotDef interface to have description for extent-->

**Note**: `aggregate` of the continuous field is implicitly `box-plot`.

### Basic Usage
{:#box-plot-types}

Vega-Lite supports two types of box plots, defined by the `extent` property in the mark definition object.

1) __`min-max` Box Plot__, which is a box plot where lower and upper whiskers are defined as the min and max respectively.  If `extent` is not specified, this type of box plot will be used.

{: .suppress-error}
```json
"mark": {
  "type": "box-plot",
  "extent": "min-max"
}
```

<!-- TODO add real horizontal example? -->

2) __Tukey Box Plot__, which is a box plot where the whisker spans from _Q1 - k * IQR_ to _Q3 + k * IQR_ where _Q1_ and _Q3_ are quartiles 1 and 3 while _IQR_ is the interquartile range (_Q3-Q1_). In this type of box plot, you can specify the constant  `k` which is typically `1.5`.

```json
"mark": {
  "type": "box-plot",
  "extent": 1.5
}
```

<!-- TODO add real horizontal example? -- Important to pick an example that this IQR will be clearly different from the min-max above -->

### Orientation

Box plot's orientation is automatically determined by the continuous field axis.
For example, you can create a vertical 1D box plot by encoding a continuous field on the y axis.

<div class="vl-example" data-name="box_plot_minmax_1D_vertical_short"></div>

For 2D box plots with one continuous and one discrete fields,
the box plot will be horizontal if the continuous field is on the x axis.

<div class="vl-example" data-name="box_plot_minmax_2D_horizontal_short"></div>

Similarly, if the continuous field is on the y axis, the box plot will be vertical.

<div class="vl-example" data-name="box_plot_minmax_2D_vertical_short"></div>

### Customizing Box Plots

#### Color and Size Encoding Channels

You can customize the color and size of the box in the `box-plot` by using the `color` and `size` [encoding channels](encoding.html#channels).  <!-- FIXME: missing opacity-->

<div class="vl-example" data-name="box_plot_minmax_2D_vertical_short"></div>

<!-- FIXME: Let's remove color and size for all basic examples to simplify things and add one special example for this case -->

#### Role Config

To customize different parts of the box, we can use roles config to customize different parts of the box plot (`box`, `boxWhisker`, `boxMid`).

{: .suppress-error}
```json
{
  "config": {
    "box": ...,
    "boxWhiskers": ...,
    "boxMid": ...
  }
}
```

<!-- TODO: add an example to customize whisker color?-->
