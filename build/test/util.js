"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("../src/compile/common");
var concat_1 = require("../src/compile/concat");
var facet_1 = require("../src/compile/facet");
var layer_1 = require("../src/compile/layer");
var repeat_1 = require("../src/compile/repeat");
var unit_1 = require("../src/compile/unit");
var config_1 = require("../src/config");
var spec_1 = require("../src/spec");
function parseModel(inputSpec) {
    var config = config_1.initConfig(inputSpec.config);
    var spec = spec_1.normalize(inputSpec, config);
    return common_1.buildModel(spec, null, '', null, config);
}
exports.parseModel = parseModel;
function parseUnitModel(spec) {
    return new unit_1.UnitModel(spec, null, '', null, config_1.initConfig(spec.config));
}
exports.parseUnitModel = parseUnitModel;
function parseLayerModel(spec) {
    return new layer_1.LayerModel(spec, null, '', null, config_1.initConfig(spec.config));
}
exports.parseLayerModel = parseLayerModel;
function parseFacetModel(spec) {
    return new facet_1.FacetModel(spec, null, '', null, config_1.initConfig(spec.config));
}
exports.parseFacetModel = parseFacetModel;
function parseRepeatModel(spec) {
    return new repeat_1.RepeatModel(spec, null, '', null, config_1.initConfig(spec.config));
}
exports.parseRepeatModel = parseRepeatModel;
function parseConcatModel(spec) {
    return new concat_1.ConcatModel(spec, null, '', null, config_1.initConfig(spec.config));
}
exports.parseConcatModel = parseConcatModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3QvdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdEQUFpRDtBQUNqRCxnREFBa0Q7QUFDbEQsOENBQWdEO0FBQ2hELDhDQUFnRDtBQUVoRCxnREFBa0Q7QUFDbEQsNENBQThDO0FBRTlDLHdDQUF5QztBQUN6QyxvQ0FBOEg7QUFFOUgsb0JBQTJCLFNBQStCO0lBQ3hELElBQU0sTUFBTSxHQUFHLG1CQUFVLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzVDLElBQU0sSUFBSSxHQUFHLGdCQUFTLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzFDLE1BQU0sQ0FBQyxtQkFBVSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNsRCxDQUFDO0FBSkQsZ0NBSUM7QUFFRCx3QkFBK0IsSUFBd0I7SUFDckQsTUFBTSxDQUFDLElBQUksZ0JBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsbUJBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUN0RSxDQUFDO0FBRkQsd0NBRUM7QUFFRCx5QkFBZ0MsSUFBeUI7SUFDdkQsTUFBTSxDQUFDLElBQUksa0JBQVUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsbUJBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUN2RSxDQUFDO0FBRkQsMENBRUM7QUFFRCx5QkFBZ0MsSUFBeUI7SUFDdkQsTUFBTSxDQUFDLElBQUksa0JBQVUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsbUJBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUN2RSxDQUFDO0FBRkQsMENBRUM7QUFFRCwwQkFBaUMsSUFBMEI7SUFDekQsTUFBTSxDQUFDLElBQUksb0JBQVcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsbUJBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUN4RSxDQUFDO0FBRkQsNENBRUM7QUFFRCwwQkFBaUMsSUFBMEI7SUFDekQsTUFBTSxDQUFDLElBQUksb0JBQVcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsbUJBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUN4RSxDQUFDO0FBRkQsNENBRUMifQ==