"use strict";
var BitmapImage2D_1 = require("awayjs-core/lib/image/BitmapImage2D");
var Sampler2D_1 = require("awayjs-core/lib/image/Sampler2D");
var LoaderEvent_1 = require("awayjs-core/lib/events/LoaderEvent");
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
var AssetLibrary_1 = require("awayjs-core/lib/library/AssetLibrary");
var URLRequest_1 = require("awayjs-core/lib/net/URLRequest");
var Debug_1 = require("awayjs-core/lib/utils/Debug");
var RequestAnimationFrame_1 = require("awayjs-core/lib/utils/RequestAnimationFrame");
var View_1 = require("awayjs-display/lib/View");
var DisplayObjectContainer_1 = require("awayjs-display/lib/display/DisplayObjectContainer");
var DirectionalLight_1 = require("awayjs-display/lib/display/DirectionalLight");
var Sprite_1 = require("awayjs-display/lib/display/Sprite");
var StaticLightPicker_1 = require("awayjs-display/lib/materials/lightpickers/StaticLightPicker");
var DefaultRenderer_1 = require("awayjs-renderergl/lib/DefaultRenderer");
var MethodMaterial_1 = require("awayjs-methodmaterials/lib/MethodMaterial");
var OBJParser_1 = require("awayjs-parsers/lib/OBJParser");
/**
 *
 */
var ObjChiefTestDay = (function () {
    function ObjChiefTestDay() {
        var _this = this;
        this.sprites = new Array();
        this.spartan = new DisplayObjectContainer_1.DisplayObjectContainer();
        this.spartanFlag = false;
        Debug_1.Debug.LOG_PI_ERRORS = false;
        Debug_1.Debug.THROW_ERRORS = false;
        this.view = new View_1.View(new DefaultRenderer_1.DefaultRenderer());
        this.view.camera.z = -50;
        this.view.camera.y = 20;
        this.view.camera.projection.near = 0.1;
        this.view.backgroundColor = 0xCEC8C6;
        this.raf = new RequestAnimationFrame_1.RequestAnimationFrame(this.render, this);
        this.light = new DirectionalLight_1.DirectionalLight();
        this.light.color = 0xc1582d;
        this.light.direction = new Vector3D_1.Vector3D(1, 0, 0);
        this.light.ambient = 0.4;
        this.light.ambientColor = 0x85b2cd;
        this.light.diffuse = 2.8;
        this.light.specular = 1.8;
        this.view.scene.addChild(this.light);
        this.spartan.transform.scaleTo(.25, .25, .25);
        this.spartan.y = 0;
        this.view.scene.addChild(this.spartan);
        AssetLibrary_1.AssetLibrary.enableParser(OBJParser_1.OBJParser);
        var session;
        session = AssetLibrary_1.AssetLibrary.getLoader();
        session.addEventListener(LoaderEvent_1.LoaderEvent.LOAD_COMPLETE, function (event) { return _this.onLoadComplete(event); });
        session.load(new URLRequest_1.URLRequest('assets/Halo_3_SPARTAN4.obj'));
        session = AssetLibrary_1.AssetLibrary.getLoader();
        session.addEventListener(LoaderEvent_1.LoaderEvent.LOAD_COMPLETE, function (event) { return _this.onLoadComplete(event); });
        session.load(new URLRequest_1.URLRequest('assets/terrain.obj'));
        session = AssetLibrary_1.AssetLibrary.getLoader();
        session.addEventListener(LoaderEvent_1.LoaderEvent.LOAD_COMPLETE, function (event) { return _this.onLoadComplete(event); });
        session.load(new URLRequest_1.URLRequest('assets/masterchief_base.png'));
        session = AssetLibrary_1.AssetLibrary.getLoader();
        session.addEventListener(LoaderEvent_1.LoaderEvent.LOAD_COMPLETE, function (event) { return _this.onLoadComplete(event); });
        session.load(new URLRequest_1.URLRequest('assets/stone_tx.jpg'));
        window.onresize = function (event) { return _this.onResize(); };
        this.raf.start();
    }
    ObjChiefTestDay.prototype.render = function () {
        if (this.terrain)
            this.terrain.rotationY += 0.4;
        this.spartan.rotationY += 0.4;
        this.view.render();
    };
    ObjChiefTestDay.prototype.onLoadComplete = function (event) {
        var loader = event.target;
        var l = loader.baseDependency.assets.length;
        console.log('------------------------------------------------------------------------------');
        console.log('events.LoaderEvent.RESOURCE_COMPLETE', event, l, loader);
        console.log('------------------------------------------------------------------------------');
        var l = loader.baseDependency.assets.length;
        for (var c = 0; c < l; c++) {
            var d = loader.baseDependency.assets[c];
            console.log(d.name, event.url);
            switch (d.assetType) {
                case Sprite_1.Sprite.assetType:
                    if (event.url == 'assets/Halo_3_SPARTAN4.obj') {
                        var sprite = d;
                        this.spartan.addChild(sprite);
                        this.spartanFlag = true;
                        this.sprites.push(sprite);
                    }
                    else if (event.url == 'assets/terrain.obj') {
                        this.terrain = d;
                        this.terrain.y = 98;
                        this.terrain.graphics.scaleUV(20, 20);
                        this.view.scene.addChild(this.terrain);
                    }
                    break;
                case BitmapImage2D_1.BitmapImage2D.assetType:
                    if (event.url == 'assets/masterchief_base.png') {
                        this.mat = new MethodMaterial_1.MethodMaterial(d);
                        this.mat.style.sampler = new Sampler2D_1.Sampler2D(true, true, false);
                        this.mat.lightPicker = new StaticLightPicker_1.StaticLightPicker([this.light]);
                    }
                    else if (event.url == 'assets/stone_tx.jpg') {
                        this.terrainMaterial = new MethodMaterial_1.MethodMaterial(d);
                        this.terrainMaterial.style.sampler = new Sampler2D_1.Sampler2D(true, true, false);
                        this.terrainMaterial.lightPicker = new StaticLightPicker_1.StaticLightPicker([this.light]);
                    }
                    break;
            }
        }
        if (this.terrain && this.terrainMaterial)
            this.terrain.material = this.terrainMaterial;
        if (this.mat && this.spartanFlag)
            for (var c = 0; c < this.sprites.length; c++)
                this.sprites[c].material = this.mat;
        this.onResize();
    };
    ObjChiefTestDay.prototype.onResize = function (event) {
        if (event === void 0) { event = null; }
        this.view.y = 0;
        this.view.x = 0;
        this.view.width = window.innerWidth;
        this.view.height = window.innerHeight;
    };
    return ObjChiefTestDay;
}());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhcnNlcnMvT2JqQ2hpZWZUZXN0RGF5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBK0IscUNBQXFDLENBQUMsQ0FBQTtBQUNyRSwwQkFBNEIsaUNBQWlDLENBQUMsQ0FBQTtBQUM5RCw0QkFBOEIsb0NBQW9DLENBQUMsQ0FBQTtBQUNuRSx5QkFBNEIsK0JBQStCLENBQUMsQ0FBQTtBQUM1RCw2QkFBK0Isc0NBQXNDLENBQUMsQ0FBQTtBQUd0RSwyQkFBNkIsZ0NBQWdDLENBQUMsQ0FBQTtBQUM5RCxzQkFBeUIsNkJBQTZCLENBQUMsQ0FBQTtBQUN2RCxzQ0FBcUMsNkNBQTZDLENBQUMsQ0FBQTtBQUVuRixxQkFBeUIseUJBQXlCLENBQUMsQ0FBQTtBQUNuRCx1Q0FBc0MsbURBQW1ELENBQUMsQ0FBQTtBQUMxRixpQ0FBa0MsNkNBQTZDLENBQUMsQ0FBQTtBQUNoRix1QkFBMEIsbUNBQW1DLENBQUMsQ0FBQTtBQUM5RCxrQ0FBa0MsNkRBQTZELENBQUMsQ0FBQTtBQUVoRyxnQ0FBaUMsdUNBQXVDLENBQUMsQ0FBQTtBQUV6RSwrQkFBZ0MsMkNBQTJDLENBQUMsQ0FBQTtBQUU1RSwwQkFBNEIsOEJBQThCLENBQUMsQ0FBQTtBQUUzRDs7R0FFRztBQUNIO0lBZ0JDO1FBaEJELGlCQThJQztRQTFJUSxZQUFPLEdBQWlCLElBQUksS0FBSyxFQUFVLENBQUM7UUFPNUMsWUFBTyxHQUEwQixJQUFJLCtDQUFzQixFQUFFLENBQUM7UUFHOUQsZ0JBQVcsR0FBVyxLQUFLLENBQUM7UUFJbkMsYUFBSyxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7UUFDNUIsYUFBSyxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7UUFFM0IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLFdBQUksQ0FBQyxJQUFJLGlDQUFlLEVBQUUsQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUN6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QUUsQ0FBQztJQUNqQixDQUFDO0lBRU0sa0NBQVEsR0FBZixVQUFnQixLQUFvQjtRQUFwQixxQkFBb0IsR0FBcEIsWUFBb0I7UUFFbkMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVoQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUM7SUFDdkMsQ0FBQztJQUNGLHNCQUFDO0FBQUQsQ0E5SUEsQUE4SUMsSUFBQSIsImZpbGUiOiJwYXJzZXJzL09iakNoaWVmVGVzdERheS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Qml0bWFwSW1hZ2UyRH1cdFx0XHRcdGZyb20gXCJhd2F5anMtY29yZS9saWIvaW1hZ2UvQml0bWFwSW1hZ2UyRFwiO1xuaW1wb3J0IHtTYW1wbGVyMkR9XHRcdFx0XHRcdGZyb20gXCJhd2F5anMtY29yZS9saWIvaW1hZ2UvU2FtcGxlcjJEXCI7XG5pbXBvcnQge0xvYWRlckV2ZW50fVx0XHRcdFx0XHRmcm9tIFwiYXdheWpzLWNvcmUvbGliL2V2ZW50cy9Mb2FkZXJFdmVudFwiO1xuaW1wb3J0IHtWZWN0b3IzRH1cdFx0XHRcdFx0XHRmcm9tIFwiYXdheWpzLWNvcmUvbGliL2dlb20vVmVjdG9yM0RcIjtcbmltcG9ydCB7QXNzZXRMaWJyYXJ5fVx0XHRcdFx0XHRmcm9tIFwiYXdheWpzLWNvcmUvbGliL2xpYnJhcnkvQXNzZXRMaWJyYXJ5XCI7XG5pbXBvcnQge0xvYWRlcn1cdFx0XHRcdFx0XHRmcm9tIFwiYXdheWpzLWNvcmUvbGliL2xpYnJhcnkvTG9hZGVyXCI7XG5pbXBvcnQge0lBc3NldH1cdFx0XHRcdFx0XHRmcm9tIFwiYXdheWpzLWNvcmUvbGliL2xpYnJhcnkvSUFzc2V0XCI7XG5pbXBvcnQge1VSTFJlcXVlc3R9XHRcdFx0XHRcdGZyb20gXCJhd2F5anMtY29yZS9saWIvbmV0L1VSTFJlcXVlc3RcIjtcbmltcG9ydCB7RGVidWd9XHRcdFx0XHRcdFx0ZnJvbSBcImF3YXlqcy1jb3JlL2xpYi91dGlscy9EZWJ1Z1wiO1xuaW1wb3J0IHtSZXF1ZXN0QW5pbWF0aW9uRnJhbWV9XHRcdGZyb20gXCJhd2F5anMtY29yZS9saWIvdXRpbHMvUmVxdWVzdEFuaW1hdGlvbkZyYW1lXCI7XG5cbmltcG9ydCB7Vmlld31cdFx0XHRcdFx0XHRcdGZyb20gXCJhd2F5anMtZGlzcGxheS9saWIvVmlld1wiO1xuaW1wb3J0IHtEaXNwbGF5T2JqZWN0Q29udGFpbmVyfVx0XHRmcm9tIFwiYXdheWpzLWRpc3BsYXkvbGliL2Rpc3BsYXkvRGlzcGxheU9iamVjdENvbnRhaW5lclwiO1xuaW1wb3J0IHtEaXJlY3Rpb25hbExpZ2h0fVx0XHRcdFx0ZnJvbSBcImF3YXlqcy1kaXNwbGF5L2xpYi9kaXNwbGF5L0RpcmVjdGlvbmFsTGlnaHRcIjtcbmltcG9ydCB7U3ByaXRlfVx0XHRcdFx0XHRcdGZyb20gXCJhd2F5anMtZGlzcGxheS9saWIvZGlzcGxheS9TcHJpdGVcIjtcbmltcG9ydCB7U3RhdGljTGlnaHRQaWNrZXJ9XHRcdFx0ZnJvbSBcImF3YXlqcy1kaXNwbGF5L2xpYi9tYXRlcmlhbHMvbGlnaHRwaWNrZXJzL1N0YXRpY0xpZ2h0UGlja2VyXCI7XG5cbmltcG9ydCB7RGVmYXVsdFJlbmRlcmVyfVx0XHRcdFx0ZnJvbSBcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9EZWZhdWx0UmVuZGVyZXJcIjtcblxuaW1wb3J0IHtNZXRob2RNYXRlcmlhbH1cdFx0XHRcdGZyb20gXCJhd2F5anMtbWV0aG9kbWF0ZXJpYWxzL2xpYi9NZXRob2RNYXRlcmlhbFwiO1xuXG5pbXBvcnQge09CSlBhcnNlcn1cdFx0XHRcdFx0ZnJvbSBcImF3YXlqcy1wYXJzZXJzL2xpYi9PQkpQYXJzZXJcIjtcblxuLyoqXG4gKiBcbiAqL1xuY2xhc3MgT2JqQ2hpZWZUZXN0RGF5XG57XG5cdHByaXZhdGUgdmlldzpWaWV3O1xuXHRwcml2YXRlIHJhZjpSZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG5cdHByaXZhdGUgc3ByaXRlczpBcnJheTxTcHJpdGU+ID0gbmV3IEFycmF5PFNwcml0ZT4oKTtcblx0cHJpdmF0ZSBtYXQ6TWV0aG9kTWF0ZXJpYWw7XG5cblx0cHJpdmF0ZSB0ZXJyYWluTWF0ZXJpYWw6TWV0aG9kTWF0ZXJpYWw7XG5cblx0cHJpdmF0ZSBsaWdodDpEaXJlY3Rpb25hbExpZ2h0O1xuXG5cdHByaXZhdGUgc3BhcnRhbjpEaXNwbGF5T2JqZWN0Q29udGFpbmVyID0gbmV3IERpc3BsYXlPYmplY3RDb250YWluZXIoKTtcblx0cHJpdmF0ZSB0ZXJyYWluOlNwcml0ZTtcblxuXHRwcml2YXRlIHNwYXJ0YW5GbGFnOmJvb2xlYW4gPSBmYWxzZTtcblxuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHREZWJ1Zy5MT0dfUElfRVJST1JTID0gZmFsc2U7XG5cdFx0RGVidWcuVEhST1dfRVJST1JTID0gZmFsc2U7XG5cblx0XHR0aGlzLnZpZXcgPSBuZXcgVmlldyhuZXcgRGVmYXVsdFJlbmRlcmVyKCkpO1xuXHRcdHRoaXMudmlldy5jYW1lcmEueiA9IC01MDtcblx0XHR0aGlzLnZpZXcuY2FtZXJhLnkgPSAyMDtcblx0XHR0aGlzLnZpZXcuY2FtZXJhLnByb2plY3Rpb24ubmVhciA9IDAuMTtcblx0XHR0aGlzLnZpZXcuYmFja2dyb3VuZENvbG9yID0gMHhDRUM4QzY7XG5cblx0XHR0aGlzLnJhZiA9IG5ldyBSZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5yZW5kZXIsIHRoaXMpO1xuXG5cdFx0dGhpcy5saWdodCA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0KCk7XG5cdFx0dGhpcy5saWdodC5jb2xvciA9IDB4YzE1ODJkO1xuXHRcdHRoaXMubGlnaHQuZGlyZWN0aW9uID0gbmV3IFZlY3RvcjNEKDEsIDAsIDApO1xuXHRcdHRoaXMubGlnaHQuYW1iaWVudCA9IDAuNDtcblx0XHR0aGlzLmxpZ2h0LmFtYmllbnRDb2xvciA9IDB4ODViMmNkO1xuXHRcdHRoaXMubGlnaHQuZGlmZnVzZSA9IDIuODtcblx0XHR0aGlzLmxpZ2h0LnNwZWN1bGFyID0gMS44O1xuXHRcdHRoaXMudmlldy5zY2VuZS5hZGRDaGlsZCh0aGlzLmxpZ2h0KTtcblxuXHRcdHRoaXMuc3BhcnRhbi50cmFuc2Zvcm0uc2NhbGVUbyguMjUsIC4yNSwgLjI1KTtcblx0XHR0aGlzLnNwYXJ0YW4ueSA9IDA7XG5cdFx0dGhpcy52aWV3LnNjZW5lLmFkZENoaWxkKHRoaXMuc3BhcnRhbik7XG5cblx0XHRBc3NldExpYnJhcnkuZW5hYmxlUGFyc2VyKE9CSlBhcnNlcik7XG5cblx0XHR2YXIgc2Vzc2lvbjpMb2FkZXI7XG5cblx0XHRzZXNzaW9uID0gQXNzZXRMaWJyYXJ5LmdldExvYWRlcigpO1xuXHRcdHNlc3Npb24uYWRkRXZlbnRMaXN0ZW5lcihMb2FkZXJFdmVudC5MT0FEX0NPTVBMRVRFLCAoZXZlbnQ6TG9hZGVyRXZlbnQpID0+IHRoaXMub25Mb2FkQ29tcGxldGUoZXZlbnQpKTtcblx0XHRzZXNzaW9uLmxvYWQobmV3IFVSTFJlcXVlc3QoJ2Fzc2V0cy9IYWxvXzNfU1BBUlRBTjQub2JqJykpO1xuXG5cdFx0c2Vzc2lvbiA9IEFzc2V0TGlicmFyeS5nZXRMb2FkZXIoKTtcblx0XHRzZXNzaW9uLmFkZEV2ZW50TGlzdGVuZXIoTG9hZGVyRXZlbnQuTE9BRF9DT01QTEVURSwgKGV2ZW50OkxvYWRlckV2ZW50KSA9PiB0aGlzLm9uTG9hZENvbXBsZXRlKGV2ZW50KSk7XG5cdFx0c2Vzc2lvbi5sb2FkKG5ldyBVUkxSZXF1ZXN0KCdhc3NldHMvdGVycmFpbi5vYmonKSk7XG5cblx0XHRzZXNzaW9uID0gQXNzZXRMaWJyYXJ5LmdldExvYWRlcigpO1xuXHRcdHNlc3Npb24uYWRkRXZlbnRMaXN0ZW5lcihMb2FkZXJFdmVudC5MT0FEX0NPTVBMRVRFLCAoZXZlbnQ6TG9hZGVyRXZlbnQpID0+IHRoaXMub25Mb2FkQ29tcGxldGUoZXZlbnQpKTtcblx0XHRzZXNzaW9uLmxvYWQobmV3IFVSTFJlcXVlc3QoJ2Fzc2V0cy9tYXN0ZXJjaGllZl9iYXNlLnBuZycpKTtcblxuXHRcdHNlc3Npb24gPSBBc3NldExpYnJhcnkuZ2V0TG9hZGVyKCk7XG5cdFx0c2Vzc2lvbi5hZGRFdmVudExpc3RlbmVyKExvYWRlckV2ZW50LkxPQURfQ09NUExFVEUsIChldmVudDpMb2FkZXJFdmVudCkgPT4gdGhpcy5vbkxvYWRDb21wbGV0ZShldmVudCkpO1xuXHRcdHNlc3Npb24ubG9hZChuZXcgVVJMUmVxdWVzdCgnYXNzZXRzL3N0b25lX3R4LmpwZycpKTtcblxuXHRcdHdpbmRvdy5vbnJlc2l6ZSA9IChldmVudDpVSUV2ZW50KSA9PiB0aGlzLm9uUmVzaXplKCk7XG5cblx0XHR0aGlzLnJhZi5zdGFydCgpO1xuXHR9XG5cblx0cHJpdmF0ZSByZW5kZXIoKVxuXHR7XG5cdFx0aWYgKCB0aGlzLnRlcnJhaW4pXG5cdFx0XHR0aGlzLnRlcnJhaW4ucm90YXRpb25ZICs9IDAuNDtcblxuXHRcdHRoaXMuc3BhcnRhbi5yb3RhdGlvblkgKz0gMC40O1xuXHRcdHRoaXMudmlldy5yZW5kZXIoKTtcblx0fVxuXG5cdHB1YmxpYyBvbkxvYWRDb21wbGV0ZShldmVudDpMb2FkZXJFdmVudClcblx0e1xuXHRcdHZhciBsb2FkZXI6TG9hZGVyID0gZXZlbnQudGFyZ2V0O1xuXHRcdHZhciBsOm51bWJlciA9IGxvYWRlci5iYXNlRGVwZW5kZW5jeS5hc3NldHMubGVuZ3RoO1xuXG5cdFx0Y29uc29sZS5sb2coJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xuXHRcdGNvbnNvbGUubG9nKCdldmVudHMuTG9hZGVyRXZlbnQuUkVTT1VSQ0VfQ09NUExFVEUnLCBldmVudCwgbCwgbG9hZGVyKTtcblx0XHRjb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XG5cblx0XHR2YXIgbDpudW1iZXIgPSBsb2FkZXIuYmFzZURlcGVuZGVuY3kuYXNzZXRzLmxlbmd0aDtcblxuXHRcdGZvciAodmFyIGM6bnVtYmVyID0gMDsgYyA8IGw7IGMrKykge1xuXG5cdFx0XHR2YXIgZDpJQXNzZXQgPSBsb2FkZXIuYmFzZURlcGVuZGVuY3kuYXNzZXRzW2NdO1xuXG5cdFx0XHRjb25zb2xlLmxvZyggZC5uYW1lICwgZXZlbnQudXJsKTtcblxuXHRcdFx0c3dpdGNoIChkLmFzc2V0VHlwZSkge1xuXHRcdFx0XHRjYXNlIFNwcml0ZS5hc3NldFR5cGU6XG5cdFx0XHRcdFx0aWYgKGV2ZW50LnVybCA9PSdhc3NldHMvSGFsb18zX1NQQVJUQU40Lm9iaicpIHtcblx0XHRcdFx0XHRcdHZhciBzcHJpdGU6U3ByaXRlID0gPFNwcml0ZT4gZDtcblxuXHRcdFx0XHRcdFx0dGhpcy5zcGFydGFuLmFkZENoaWxkKHNwcml0ZSk7XG5cdFx0XHRcdFx0XHR0aGlzLnNwYXJ0YW5GbGFnID0gdHJ1ZTtcblx0XHRcdFx0XHRcdHRoaXMuc3ByaXRlcy5wdXNoKHNwcml0ZSk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChldmVudC51cmwgPT0nYXNzZXRzL3RlcnJhaW4ub2JqJykge1xuXHRcdFx0XHRcdFx0dGhpcy50ZXJyYWluID0gPFNwcml0ZT4gZDtcblx0XHRcdFx0XHRcdHRoaXMudGVycmFpbi55ID0gOTg7XG5cdFx0XHRcdFx0XHR0aGlzLnRlcnJhaW4uZ3JhcGhpY3Muc2NhbGVVVigyMCwgMjApO1xuXHRcdFx0XHRcdFx0dGhpcy52aWV3LnNjZW5lLmFkZENoaWxkKHRoaXMudGVycmFpbik7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgQml0bWFwSW1hZ2UyRC5hc3NldFR5cGU6XG5cdFx0XHRcdFx0aWYgKGV2ZW50LnVybCA9PSAnYXNzZXRzL21hc3RlcmNoaWVmX2Jhc2UucG5nJyApIHtcblx0XHRcdFx0XHRcdHRoaXMubWF0ID0gbmV3IE1ldGhvZE1hdGVyaWFsKDxCaXRtYXBJbWFnZTJEPiBkKTtcblx0XHRcdFx0XHRcdHRoaXMubWF0LnN0eWxlLnNhbXBsZXIgPSBuZXcgU2FtcGxlcjJEKHRydWUsIHRydWUsIGZhbHNlKTtcblx0XHRcdFx0XHRcdHRoaXMubWF0LmxpZ2h0UGlja2VyID0gbmV3IFN0YXRpY0xpZ2h0UGlja2VyKFt0aGlzLmxpZ2h0XSk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChldmVudC51cmwgPT0gJ2Fzc2V0cy9zdG9uZV90eC5qcGcnKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnRlcnJhaW5NYXRlcmlhbCA9IG5ldyBNZXRob2RNYXRlcmlhbCg8Qml0bWFwSW1hZ2UyRD4gZCk7XG5cdFx0XHRcdFx0XHR0aGlzLnRlcnJhaW5NYXRlcmlhbC5zdHlsZS5zYW1wbGVyID0gbmV3IFNhbXBsZXIyRCh0cnVlLCB0cnVlLCBmYWxzZSk7XG5cdFx0XHRcdFx0XHR0aGlzLnRlcnJhaW5NYXRlcmlhbC5saWdodFBpY2tlciA9IG5ldyBTdGF0aWNMaWdodFBpY2tlcihbdGhpcy5saWdodF0pO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICh0aGlzLnRlcnJhaW4gJiYgdGhpcy50ZXJyYWluTWF0ZXJpYWwpXG5cdFx0XHR0aGlzLnRlcnJhaW4ubWF0ZXJpYWwgPSB0aGlzLnRlcnJhaW5NYXRlcmlhbDtcblxuXHRcdGlmICh0aGlzLm1hdCAmJiB0aGlzLnNwYXJ0YW5GbGFnKVxuXHRcdFx0Zm9yICh2YXIgYzpudW1iZXIgPSAwOyBjIDwgdGhpcy5zcHJpdGVzLmxlbmd0aDsgYysrKVxuXHRcdFx0XHR0aGlzLnNwcml0ZXNbY10ubWF0ZXJpYWwgPSB0aGlzLm1hdDtcblxuXHRcdHRoaXMub25SZXNpemUoKTtcblx0fVxuXG5cdHB1YmxpYyBvblJlc2l6ZShldmVudDpVSUV2ZW50ID0gbnVsbClcblx0e1xuXHRcdHRoaXMudmlldy55ID0gMDtcblx0XHR0aGlzLnZpZXcueCA9IDA7XG5cblx0XHR0aGlzLnZpZXcud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcblx0XHR0aGlzLnZpZXcuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXHR9XG59Il0sInNvdXJjZVJvb3QiOiIuL3Rlc3RzIn0=
