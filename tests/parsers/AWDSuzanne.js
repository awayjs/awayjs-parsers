"use strict";
var AssetEvent_1 = require("awayjs-core/lib/events/AssetEvent");
var LoaderEvent_1 = require("awayjs-core/lib/events/LoaderEvent");
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
var AssetLibrary_1 = require("awayjs-core/lib/library/AssetLibrary");
var URLRequest_1 = require("awayjs-core/lib/net/URLRequest");
var Debug_1 = require("awayjs-core/lib/utils/Debug");
var RequestAnimationFrame_1 = require("awayjs-core/lib/utils/RequestAnimationFrame");
var Graphics_1 = require("awayjs-display/lib/graphics/Graphics");
var View_1 = require("awayjs-display/lib/View");
var DirectionalLight_1 = require("awayjs-display/lib/display/DirectionalLight");
var Sprite_1 = require("awayjs-display/lib/display/Sprite");
var StaticLightPicker_1 = require("awayjs-display/lib/materials/lightpickers/StaticLightPicker");
var DefaultRenderer_1 = require("awayjs-renderergl/lib/DefaultRenderer");
var MethodMaterial_1 = require("awayjs-methodmaterials/lib/MethodMaterial");
var AWDParser_1 = require("awayjs-parsers/lib/AWDParser");
var AWDSuzanne = (function () {
    function AWDSuzanne() {
        var _this = this;
        this.lookAtPosition = new Vector3D_1.default();
        this._cameraIncrement = 0;
        Debug_1.default.LOG_PI_ERRORS = true;
        Debug_1.default.THROW_ERRORS = false;
        AssetLibrary_1.default.enableParser(AWDParser_1.default);
        var session = AssetLibrary_1.default.getLoader();
        session.addEventListener(LoaderEvent_1.default.LOAD_COMPLETE, function (event) { return _this.onLoadComplete(event); });
        session.addEventListener(AssetEvent_1.default.ASSET_COMPLETE, function (event) { return _this.onAssetComplete(event); });
        session.load(new URLRequest_1.default('assets/suzanne.awd'));
        this._view = new View_1.default(new DefaultRenderer_1.default());
        this._view.camera.projection.far = 6000;
        this._timer = new RequestAnimationFrame_1.default(this.render, this);
        this._light = new DirectionalLight_1.default();
        this._light.color = 0x683019; //683019;
        this._light.direction = new Vector3D_1.default(1, 0, 0);
        this._light.ambient = 0.1; //0.05;//.4;
        this._light.ambientColor = 0x85b2cd; //4F6877;//313D51;
        this._light.diffuse = 2.8;
        this._light.specular = 1.8;
        this._view.scene.addChild(this._light);
        this._lightPicker = new StaticLightPicker_1.default([this._light]);
        window.onresize = function (event) { return _this.resize(event); };
        this._timer.start();
        this.resize();
    }
    AWDSuzanne.prototype.resize = function (event) {
        if (event === void 0) { event = null; }
        this._view.y = 0;
        this._view.x = 0;
        this._view.width = window.innerWidth;
        this._view.height = window.innerHeight;
    };
    AWDSuzanne.prototype.render = function (dt) {
        if (this._view.camera) {
            this._view.camera.lookAt(this.lookAtPosition);
            this._cameraIncrement += 0.01;
            this._view.camera.x = Math.cos(this._cameraIncrement) * 1400;
            this._view.camera.z = Math.sin(this._cameraIncrement) * 1400;
            this._light.x = Math.cos(this._cameraIncrement) * 1400;
            this._light.y = Math.sin(this._cameraIncrement) * 1400;
        }
        this._view.render();
    };
    AWDSuzanne.prototype.onAssetComplete = function (event) {
        console.log('------------------------------------------------------------------------------');
        console.log('away.events.AssetEvent.ASSET_COMPLETE', AssetLibrary_1.default.getAsset(event.asset.name));
        console.log('------------------------------------------------------------------------------');
    };
    AWDSuzanne.prototype.onLoadComplete = function (event) {
        console.log('------------------------------------------------------------------------------');
        console.log('away.events.LoaderEvent.RESOURCE_COMPLETE', event);
        console.log('------------------------------------------------------------------------------');
        var loader = event.target;
        var numAssets = loader.baseDependency.assets.length;
        for (var i = 0; i < numAssets; ++i) {
            var asset = loader.baseDependency.assets[i];
            switch (asset.assetType) {
                case Sprite_1.default.assetType:
                    this._suzanne = asset;
                    this._suzanne.material.lightPicker = this._lightPicker;
                    this._suzanne.y = -100;
                    for (var c = 0; c < 80; c++) {
                        var scale = this.getRandom(50, 200);
                        var clone = this._suzanne.clone();
                        clone.x = this.getRandom(-2000, 2000);
                        clone.y = this.getRandom(-2000, 2000);
                        clone.z = this.getRandom(-2000, 2000);
                        clone.transform.scaleTo(scale, scale, scale);
                        clone.rotationY = this.getRandom(0, 360);
                        this._view.scene.addChild(clone);
                    }
                    this._suzanne.transform.scaleTo(500, 500, 500);
                    this._view.scene.addChild(this._suzanne);
                    break;
                case Graphics_1.default.assetType:
                    break;
                case MethodMaterial_1.default.assetType:
                    break;
            }
        }
    };
    AWDSuzanne.prototype.getRandom = function (min, max) {
        return Math.random() * (max - min) + min;
    };
    return AWDSuzanne;
}());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhcnNlcnMvQVdEU3V6YW5uZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMkJBQTJCLG1DQUFtQyxDQUFDLENBQUE7QUFDL0QsNEJBQTRCLG9DQUFvQyxDQUFDLENBQUE7QUFDakUseUJBQTBCLCtCQUErQixDQUFDLENBQUE7QUFDMUQsNkJBQTZCLHNDQUFzQyxDQUFDLENBQUE7QUFHcEUsMkJBQTJCLGdDQUFnQyxDQUFDLENBQUE7QUFDNUQsc0JBQXVCLDZCQUE2QixDQUFDLENBQUE7QUFDckQsc0NBQW1DLDZDQUE2QyxDQUFDLENBQUE7QUFFakYseUJBQTBCLHNDQUFzQyxDQUFDLENBQUE7QUFDakUscUJBQXVCLHlCQUF5QixDQUFDLENBQUE7QUFDakQsaUNBQWdDLDZDQUE2QyxDQUFDLENBQUE7QUFDOUUsdUJBQXdCLG1DQUFtQyxDQUFDLENBQUE7QUFDNUQsa0NBQWdDLDZEQUE2RCxDQUFDLENBQUE7QUFFOUYsZ0NBQStCLHVDQUF1QyxDQUFDLENBQUE7QUFFdkUsK0JBQThCLDJDQUEyQyxDQUFDLENBQUE7QUFFMUUsMEJBQTBCLDhCQUE4QixDQUFDLENBQUE7QUFFekQ7SUFVQztRQVZELGlCQStIQztRQXhIUSxtQkFBYyxHQUFZLElBQUksa0JBQVEsRUFBRSxDQUFDO1FBQ3pDLHFCQUFnQixHQUFVLENBQUMsQ0FBQztRQUluQyxlQUFLLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUMzQixlQUFLLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztRQUUzQixzQkFBWSxDQUFDLFlBQVksQ0FBQyxtQkFBUyxDQUFDLENBQUU7UUFFdEMsSUFBSSxPQUFPLEdBQVUsc0JBQVksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUM5QyxPQUFPLENBQUMsZ0JBQWdCLENBQUMscUJBQVcsQ0FBQyxhQUFhLEVBQUUsVUFBQyxLQUFpQixJQUFLLE9BQUEsS0FBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBMUIsQ0FBMEIsQ0FBQyxDQUFDO1FBQ3ZHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxvQkFBVSxDQUFDLGNBQWMsRUFBRSxVQUFDLEtBQWdCLElBQUssT0FBQSxLQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxFQUEzQixDQUEyQixDQUFDLENBQUM7UUFDdkcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLG9CQUFVLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO1FBRW5ELElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxjQUFJLENBQUMsSUFBSSx5QkFBZSxFQUFFLENBQUMsQ0FBQztRQUM3QyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxHQUFJLElBQUksQ0FBQztRQUN6QyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksK0JBQXFCLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUUzRCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksMEJBQWdCLEVBQUUsQ0FBQztRQUNyQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsQ0FBQSxTQUFTO1FBQ3RDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHLElBQUksa0JBQVEsQ0FBRSxDQUFDLEVBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBRSxDQUFDO1FBQ2pELElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQyxDQUFBLFlBQVk7UUFDdEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDLENBQUEsa0JBQWtCO1FBQ3RELElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztRQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7UUFDM0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUV2QyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksMkJBQWlCLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUV6RCxNQUFNLENBQUMsUUFBUSxHQUFHLFVBQUMsS0FBYSxJQUFLLE9BQUEsS0FBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBbEIsQ0FBa0IsQ0FBQztRQUV4RCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNmLENBQUM7SUFFTywyQkFBTSxHQUFkLFVBQWUsS0FBb0I7UUFBcEIscUJBQW9CLEdBQXBCLFlBQW9CO1FBRWxDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakIsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztRQUNyQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO0lBQ3hDLENBQUM7SUFFTywyQkFBTSxHQUFkLFVBQWUsRUFBUztRQUV2QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDdkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBRTtZQUMvQyxJQUFJLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDO1lBQzlCLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFDLElBQUksQ0FBQztZQUMzRCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBQyxJQUFJLENBQUM7WUFFM0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBQyxJQUFJLENBQUM7WUFDckQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBQyxJQUFJLENBQUM7UUFDdEQsQ0FBQztRQUVELElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVNLG9DQUFlLEdBQXRCLFVBQXVCLEtBQWdCO1FBRXRDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0ZBQWdGLENBQUMsQ0FBQztRQUM5RixPQUFPLENBQUMsR0FBRyxDQUFDLHVDQUF1QyxFQUFFLHNCQUFZLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUM5RixPQUFPLENBQUMsR0FBRyxDQUFDLGdGQUFnRixDQUFDLENBQUM7SUFDL0YsQ0FBQztJQUVNLG1DQUFjLEdBQXJCLFVBQXNCLEtBQWlCO1FBRXRDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0ZBQWdGLENBQUMsQ0FBQztRQUM5RixPQUFPLENBQUMsR0FBRyxDQUFDLDJDQUEyQyxFQUFHLEtBQUssQ0FBQyxDQUFDO1FBQ2pFLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0ZBQWdGLENBQUMsQ0FBQztRQUU5RixJQUFJLE1BQU0sR0FBVSxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQ2pDLElBQUksU0FBUyxHQUFVLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUUzRCxHQUFHLENBQUEsQ0FBQyxJQUFJLENBQUMsR0FBVSxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQzFDLElBQUksS0FBSyxHQUFVLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRW5ELE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixLQUFLLGdCQUFNLENBQUMsU0FBUztvQkFFcEIsSUFBSSxDQUFDLFFBQVEsR0FBWSxLQUFLLENBQUM7b0JBRWIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFTLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7b0JBQzFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO29CQUd2QixHQUFHLENBQUMsQ0FBRSxJQUFJLENBQUMsR0FBWSxDQUFDLEVBQUcsQ0FBQyxHQUFHLEVBQUUsRUFBRyxDQUFDLEVBQUcsRUFDeEMsQ0FBQzt3QkFDQSxJQUFJLEtBQUssR0FBVSxJQUFJLENBQUMsU0FBUyxDQUFFLEVBQUUsRUFBRyxHQUFHLENBQUUsQ0FBQzt3QkFDOUMsSUFBSSxLQUFLLEdBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7d0JBQ2pELEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksRUFBRyxJQUFJLENBQUMsQ0FBQzt3QkFDdkMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxFQUFHLElBQUksQ0FBQyxDQUFDO3dCQUN2QyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLEVBQUcsSUFBSSxDQUFDLENBQUM7d0JBQ3ZDLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7d0JBQzdDLEtBQUssQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUcsR0FBRyxDQUFDLENBQUM7d0JBQzNDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBRSxLQUFLLENBQUUsQ0FBQztvQkFFcEMsQ0FBQztvQkFFRCxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFFL0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFFekMsS0FBSyxDQUFDO2dCQUVQLEtBQUssa0JBQVEsQ0FBQyxTQUFTO29CQUN0QixLQUFLLENBQUM7Z0JBRVAsS0FBSyx3QkFBYyxDQUFDLFNBQVM7b0JBRTVCLEtBQUssQ0FBQztZQUNSLENBQUM7UUFDRixDQUFDO0lBQ0YsQ0FBQztJQUVPLDhCQUFTLEdBQWpCLFVBQWtCLEdBQVUsRUFBRSxHQUFVO1FBRXZDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQ3hDLENBQUM7SUFDRixpQkFBQztBQUFELENBL0hBLEFBK0hDLElBQUEiLCJmaWxlIjoicGFyc2Vycy9BV0RTdXphbm5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFzc2V0RXZlbnRcdFx0XHRcdFx0ZnJvbSBcImF3YXlqcy1jb3JlL2xpYi9ldmVudHMvQXNzZXRFdmVudFwiO1xuaW1wb3J0IExvYWRlckV2ZW50XHRcdFx0XHRcdGZyb20gXCJhd2F5anMtY29yZS9saWIvZXZlbnRzL0xvYWRlckV2ZW50XCI7XG5pbXBvcnQgVmVjdG9yM0RcdFx0XHRcdFx0XHRmcm9tIFwiYXdheWpzLWNvcmUvbGliL2dlb20vVmVjdG9yM0RcIjtcbmltcG9ydCBBc3NldExpYnJhcnlcdFx0XHRcdFx0ZnJvbSBcImF3YXlqcy1jb3JlL2xpYi9saWJyYXJ5L0Fzc2V0TGlicmFyeVwiO1xuaW1wb3J0IExvYWRlclx0XHRcdFx0XHRcdGZyb20gXCJhd2F5anMtY29yZS9saWIvbGlicmFyeS9Mb2FkZXJcIjtcbmltcG9ydCBJQXNzZXRcdFx0XHRcdFx0XHRmcm9tIFwiYXdheWpzLWNvcmUvbGliL2xpYnJhcnkvSUFzc2V0XCI7XG5pbXBvcnQgVVJMUmVxdWVzdFx0XHRcdFx0XHRmcm9tIFwiYXdheWpzLWNvcmUvbGliL25ldC9VUkxSZXF1ZXN0XCI7XG5pbXBvcnQgRGVidWdcdFx0XHRcdFx0XHRmcm9tIFwiYXdheWpzLWNvcmUvbGliL3V0aWxzL0RlYnVnXCI7XG5pbXBvcnQgUmVxdWVzdEFuaW1hdGlvbkZyYW1lXHRcdGZyb20gXCJhd2F5anMtY29yZS9saWIvdXRpbHMvUmVxdWVzdEFuaW1hdGlvbkZyYW1lXCI7XG5cbmltcG9ydCBHcmFwaGljc1x0XHRcdFx0XHRcdGZyb20gXCJhd2F5anMtZGlzcGxheS9saWIvZ3JhcGhpY3MvR3JhcGhpY3NcIjtcbmltcG9ydCBWaWV3XHRcdFx0XHRcdFx0XHRmcm9tIFwiYXdheWpzLWRpc3BsYXkvbGliL1ZpZXdcIjtcbmltcG9ydCBEaXJlY3Rpb25hbExpZ2h0XHRcdFx0XHRmcm9tIFwiYXdheWpzLWRpc3BsYXkvbGliL2Rpc3BsYXkvRGlyZWN0aW9uYWxMaWdodFwiO1xuaW1wb3J0IFNwcml0ZVx0XHRcdFx0XHRcdGZyb20gXCJhd2F5anMtZGlzcGxheS9saWIvZGlzcGxheS9TcHJpdGVcIjtcbmltcG9ydCBTdGF0aWNMaWdodFBpY2tlclx0XHRcdGZyb20gXCJhd2F5anMtZGlzcGxheS9saWIvbWF0ZXJpYWxzL2xpZ2h0cGlja2Vycy9TdGF0aWNMaWdodFBpY2tlclwiO1xuXG5pbXBvcnQgRGVmYXVsdFJlbmRlcmVyXHRcdFx0XHRmcm9tIFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL0RlZmF1bHRSZW5kZXJlclwiO1xuXG5pbXBvcnQgTWV0aG9kTWF0ZXJpYWxcdFx0XHRcdGZyb20gXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9NZXRob2RNYXRlcmlhbFwiO1xuXG5pbXBvcnQgQVdEUGFyc2VyXHRcdFx0XHRcdGZyb20gXCJhd2F5anMtcGFyc2Vycy9saWIvQVdEUGFyc2VyXCI7XG5cbmNsYXNzIEFXRFN1emFubmVcbntcblx0cHJpdmF0ZSBfdmlldzpWaWV3O1xuXHRwcml2YXRlIF90aW1lcjpSZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG5cdHByaXZhdGUgX3N1emFubmU6U3ByaXRlO1xuXHRwcml2YXRlIF9saWdodDpEaXJlY3Rpb25hbExpZ2h0O1xuXHRwcml2YXRlIF9saWdodFBpY2tlcjpTdGF0aWNMaWdodFBpY2tlcjtcblx0cHJpdmF0ZSBsb29rQXRQb3NpdGlvbjpWZWN0b3IzRCA9IG5ldyBWZWN0b3IzRCgpO1xuXHRwcml2YXRlIF9jYW1lcmFJbmNyZW1lbnQ6bnVtYmVyID0gMDtcblxuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHREZWJ1Zy5MT0dfUElfRVJST1JTID0gdHJ1ZTtcblx0XHREZWJ1Zy5USFJPV19FUlJPUlMgPSBmYWxzZTtcblxuXHRcdEFzc2V0TGlicmFyeS5lbmFibGVQYXJzZXIoQVdEUGFyc2VyKSA7XG5cblx0XHR2YXIgc2Vzc2lvbjpMb2FkZXIgPSBBc3NldExpYnJhcnkuZ2V0TG9hZGVyKCk7XG5cdFx0c2Vzc2lvbi5hZGRFdmVudExpc3RlbmVyKExvYWRlckV2ZW50LkxPQURfQ09NUExFVEUsIChldmVudDpMb2FkZXJFdmVudCkgPT4gdGhpcy5vbkxvYWRDb21wbGV0ZShldmVudCkpO1xuXHRcdHNlc3Npb24uYWRkRXZlbnRMaXN0ZW5lcihBc3NldEV2ZW50LkFTU0VUX0NPTVBMRVRFLCAoZXZlbnQ6QXNzZXRFdmVudCkgPT4gdGhpcy5vbkFzc2V0Q29tcGxldGUoZXZlbnQpKTtcblx0XHRzZXNzaW9uLmxvYWQobmV3IFVSTFJlcXVlc3QoJ2Fzc2V0cy9zdXphbm5lLmF3ZCcpKTtcblxuXHRcdHRoaXMuX3ZpZXcgPSBuZXcgVmlldyhuZXcgRGVmYXVsdFJlbmRlcmVyKCkpO1xuXHRcdHRoaXMuX3ZpZXcuY2FtZXJhLnByb2plY3Rpb24uZmFyICA9IDYwMDA7XG5cdFx0dGhpcy5fdGltZXIgPSBuZXcgUmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMucmVuZGVyLCB0aGlzKTtcblxuXHRcdHRoaXMuX2xpZ2h0ID0gbmV3IERpcmVjdGlvbmFsTGlnaHQoKTtcblx0XHR0aGlzLl9saWdodC5jb2xvciA9IDB4NjgzMDE5Oy8vNjgzMDE5O1xuXHRcdHRoaXMuX2xpZ2h0LmRpcmVjdGlvbiA9IG5ldyBWZWN0b3IzRCggMSAsIDAgLDAgKTtcblx0XHR0aGlzLl9saWdodC5hbWJpZW50ID0gMC4xOy8vMC4wNTsvLy40O1xuXHRcdHRoaXMuX2xpZ2h0LmFtYmllbnRDb2xvciA9IDB4ODViMmNkOy8vNEY2ODc3Oy8vMzEzRDUxO1xuXHRcdHRoaXMuX2xpZ2h0LmRpZmZ1c2UgPSAyLjg7XG5cdFx0dGhpcy5fbGlnaHQuc3BlY3VsYXIgPSAxLjg7XG5cdFx0dGhpcy5fdmlldy5zY2VuZS5hZGRDaGlsZCh0aGlzLl9saWdodCk7XG5cblx0XHR0aGlzLl9saWdodFBpY2tlciA9IG5ldyBTdGF0aWNMaWdodFBpY2tlcihbdGhpcy5fbGlnaHRdKTtcblxuXHRcdHdpbmRvdy5vbnJlc2l6ZSA9IChldmVudDpVSUV2ZW50KSA9PiB0aGlzLnJlc2l6ZShldmVudCk7XG5cblx0XHR0aGlzLl90aW1lci5zdGFydCgpO1xuXHRcdHRoaXMucmVzaXplKCk7XG5cdH1cblxuXHRwcml2YXRlIHJlc2l6ZShldmVudDpVSUV2ZW50ID0gbnVsbClcblx0e1xuXHRcdHRoaXMuX3ZpZXcueSA9IDA7XG5cdFx0dGhpcy5fdmlldy54ID0gMDtcblx0XHR0aGlzLl92aWV3LndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG5cdFx0dGhpcy5fdmlldy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cdH1cblxuXHRwcml2YXRlIHJlbmRlcihkdDpudW1iZXIpIC8vYW5pbWF0ZSBiYXNlZCBvbiBkdCBmb3IgZmlyZWZveFxuXHR7XG5cdFx0aWYgKHRoaXMuX3ZpZXcuY2FtZXJhKSB7XG5cdFx0XHR0aGlzLl92aWV3LmNhbWVyYS5sb29rQXQodGhpcy5sb29rQXRQb3NpdGlvbikgO1xuXHRcdFx0dGhpcy5fY2FtZXJhSW5jcmVtZW50ICs9IDAuMDE7XG5cdFx0XHR0aGlzLl92aWV3LmNhbWVyYS54ID0gTWF0aC5jb3ModGhpcy5fY2FtZXJhSW5jcmVtZW50KSoxNDAwO1xuXHRcdFx0dGhpcy5fdmlldy5jYW1lcmEueiA9IE1hdGguc2luKHRoaXMuX2NhbWVyYUluY3JlbWVudCkqMTQwMDtcblxuXHRcdFx0dGhpcy5fbGlnaHQueCA9IE1hdGguY29zKHRoaXMuX2NhbWVyYUluY3JlbWVudCkqMTQwMDtcblx0XHRcdHRoaXMuX2xpZ2h0LnkgPSBNYXRoLnNpbih0aGlzLl9jYW1lcmFJbmNyZW1lbnQpKjE0MDA7XG5cdFx0fVxuXG5cdFx0dGhpcy5fdmlldy5yZW5kZXIoKTtcblx0fVxuXG5cdHB1YmxpYyBvbkFzc2V0Q29tcGxldGUoZXZlbnQ6QXNzZXRFdmVudClcblx0e1xuXHRcdGNvbnNvbGUubG9nKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcblx0XHRjb25zb2xlLmxvZygnYXdheS5ldmVudHMuQXNzZXRFdmVudC5BU1NFVF9DT01QTEVURScsIEFzc2V0TGlicmFyeS5nZXRBc3NldChldmVudC5hc3NldC5uYW1lKSk7XG5cdFx0Y29uc29sZS5sb2coJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xuXHR9XG5cblx0cHVibGljIG9uTG9hZENvbXBsZXRlKGV2ZW50OkxvYWRlckV2ZW50KVxuXHR7XG5cdFx0Y29uc29sZS5sb2coJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xuXHRcdGNvbnNvbGUubG9nKCdhd2F5LmV2ZW50cy5Mb2FkZXJFdmVudC5SRVNPVVJDRV9DT01QTEVURScgLCBldmVudCk7XG5cdFx0Y29uc29sZS5sb2coJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xuXG5cdFx0dmFyIGxvYWRlcjpMb2FkZXIgPSBldmVudC50YXJnZXQ7XG5cdFx0dmFyIG51bUFzc2V0czpudW1iZXIgPSBsb2FkZXIuYmFzZURlcGVuZGVuY3kuYXNzZXRzLmxlbmd0aDtcblxuXHRcdGZvcih2YXIgaTpudW1iZXIgPSAwOyBpIDwgbnVtQXNzZXRzOyArK2kpIHtcblx0XHRcdHZhciBhc3NldDpJQXNzZXQgPSBsb2FkZXIuYmFzZURlcGVuZGVuY3kuYXNzZXRzW2ldO1xuXG5cdFx0XHRzd2l0Y2ggKGFzc2V0LmFzc2V0VHlwZSkge1xuXHRcdFx0XHRjYXNlIFNwcml0ZS5hc3NldFR5cGU6XG5cblx0XHRcdFx0XHR0aGlzLl9zdXphbm5lID0gPFNwcml0ZT4gYXNzZXQ7XG5cblx0XHRcdFx0XHQoPE1ldGhvZE1hdGVyaWFsPiB0aGlzLl9zdXphbm5lLm1hdGVyaWFsKS5saWdodFBpY2tlciA9IHRoaXMuX2xpZ2h0UGlja2VyO1xuXHRcdFx0XHRcdHRoaXMuX3N1emFubmUueSA9IC0xMDA7XG5cblxuXHRcdFx0XHRcdGZvciAoIHZhciBjIDogbnVtYmVyID0gMCA7IGMgPCA4MCA7IGMgKysgKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHZhciBzY2FsZTpudW1iZXIgPSB0aGlzLmdldFJhbmRvbSggNTAgLCAyMDAgKTtcblx0XHRcdFx0XHRcdHZhciBjbG9uZTpTcHJpdGUgPSA8U3ByaXRlPiB0aGlzLl9zdXphbm5lLmNsb25lKCk7XG5cdFx0XHRcdFx0XHRcdGNsb25lLnggPSB0aGlzLmdldFJhbmRvbSgtMjAwMCAsIDIwMDApO1xuXHRcdFx0XHRcdFx0XHRjbG9uZS55ID0gdGhpcy5nZXRSYW5kb20oLTIwMDAgLCAyMDAwKTtcblx0XHRcdFx0XHRcdFx0Y2xvbmUueiA9IHRoaXMuZ2V0UmFuZG9tKC0yMDAwICwgMjAwMCk7XG5cdFx0XHRcdFx0XHRcdGNsb25lLnRyYW5zZm9ybS5zY2FsZVRvKHNjYWxlLCBzY2FsZSwgc2NhbGUpO1xuXHRcdFx0XHRcdFx0XHRjbG9uZS5yb3RhdGlvblkgPSB0aGlzLmdldFJhbmRvbSgwICwgMzYwKTtcblx0XHRcdFx0XHRcdHRoaXMuX3ZpZXcuc2NlbmUuYWRkQ2hpbGQoIGNsb25lICk7XG5cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR0aGlzLl9zdXphbm5lLnRyYW5zZm9ybS5zY2FsZVRvKDUwMCwgNTAwLCA1MDApO1xuXG5cdFx0XHRcdFx0dGhpcy5fdmlldy5zY2VuZS5hZGRDaGlsZCh0aGlzLl9zdXphbm5lKTtcblxuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgR3JhcGhpY3MuYXNzZXRUeXBlOlxuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgTWV0aG9kTWF0ZXJpYWwuYXNzZXRUeXBlOlxuXG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBnZXRSYW5kb20obWluOm51bWJlciwgbWF4Om51bWJlcik6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gTWF0aC5yYW5kb20oKSoobWF4IC0gbWluKSArIG1pbjtcblx0fVxufSJdLCJzb3VyY2VSb290IjoiLi90ZXN0cyJ9
