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

#### 1D Box Plots

You can create horizontal 1D box plots by encoding a continuous field on the y axis.

<div class="vl-example" data-name="box_plot_minmax_1D_vertical_short"></div>

You can also create horizontal 1D boxplot by encoding a continuous field on the x axis.

<div class="vl-example" data-name="box_plot_minmax_1D_horizontal_short"></div>

#### 2D Box Plots

You can create vertical and horizontal 2D box plots. The orientation is determined by the continuous axis.

If the continuous field is on the x axis then the boxplot will be horizontal.

<div class="vl-example" data-name="box_plot_minmax_2D_horizontal_short"></div>

If the continuous field is on the y axis then the boxplot will be vertical.

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

### Boxplot Types
{:#boxplot-types}
There are two supported types of box plots which you specify with the extent property in the mark definition:
1) `min-max boxplot` which is a boxplot where lower and upper whiskers are defined as the min and max respectively
{: .suppress-error}
```json
"mark": {
  "type": "box-plot",
  "extent": "min-max"
}
```
2) `k * IQR boxplot` which is a boxplot where the lower whisker is defined as the first quartile minus k * IQR (q1 - k * IQR) and the upper whisker is defined as the third quartile plus k * IQR (q3 + k * IQR). In this type of boxplot you are able to specify the constant or scalar k which is typically 1.5. IQR is the interquartile range which is quartile 3 minus quartile 1.
```json
"mark": {
  "type": "box-plot",
  "extent": 1.5
}
```

If the extent is not specified then the default `box-plot` type of `min-max` is used.
