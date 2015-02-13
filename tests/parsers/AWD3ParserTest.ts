import AssetLibrary					= require("awayjs-core/lib/library/AssetLibrary");
import AssetType					= require("awayjs-core/lib/library/AssetType");
import AssetEvent					= require("awayjs-core/lib/events/AssetEvent");
import URLRequest					= require("awayjs-core/lib/net/URLRequest");
import LoaderEvent					= require("awayjs-core/lib/events/LoaderEvent");
import Vector3D						= require("awayjs-core/lib/geom/Vector3D");
import OrthographicOffCenterProjection		= require("awayjs-core/lib/projections/OrthographicOffCenterProjection");
import Keyboard						= require("awayjs-core/lib/ui/Keyboard");
import RequestAnimationFrame		= require("awayjs-core/lib/utils/RequestAnimationFrame");

import View							= require("awayjs-display/lib/containers/View");
import Mesh							= require("awayjs-display/lib/entities/Mesh");
import Container					= require("awayjs-display/lib/containers/DisplayObjectContainer");
import Geometry						= require("awayjs-display/lib/base/Geometry");
import HoverController				= require("awayjs-display/lib/controllers/HoverController");
import Loader						= require("awayjs-display/lib/containers/Loader");
import ColorMaterial				= require("awayjs-display/lib/materials/BasicMaterial");
import PrimitiveCubePrefab			= require("awayjs-display/lib/prefabs/PrimitiveCubePrefab");

import DefaultRenderer				= require("awayjs-renderergl/lib/DefaultRenderer");

import MethodMaterial				= require("awayjs-methodmaterials/lib/MethodMaterial");
import MethodRendererPool			= require("awayjs-methodmaterials/lib/pool/MethodRendererPool");

import AWDParser					= require("awayjs-parsers/lib/AWDParser");
import MovieClip					= require("awayjs-player/lib/fl/display/MovieClip");

class AWD3ParserTest
{
    //engine variables
    private _view: View;
    private _cameraController: HoverController;

    private _rootTimeLine: MovieClip;

    private _timer: RequestAnimationFrame;
    private _time: number = 0;

    //navigation
    private _lastPanAngle: number;
    private _lastTiltAngle: number;
    private _lastMouseX: number;
    private _lastMouseY: number;
    private _move: boolean;

    /**
     * Constructor
     */
    constructor()
    {
        this.init();
    }

    /**
     * Global initialise function
     */
    private init(): void
    {
        this.initEngine();
        this.initObjects();
        this.initListeners();
    }

    /**
     * Initialise the engine
     */
    private initEngine(): void
    {
        //create the view
        this._view = new View(new DefaultRenderer(MethodRendererPool));
        this._view.backgroundColor = 0xffffff;

        //create custom lens
        this._view.camera.projection = new OrthographicOffCenterProjection(0, 550, -400, 0);
        this._view.camera.projection.far = 500000;
        this._view.camera.projection.near = 0.1;

        //setup controller to be used on the camera
        this._cameraController = new HoverController(this._view.camera, null, 0, 0, 300, 10, 90);
        this._cameraController.lookAtPosition = new Vector3D(0, 50, 0);
        this._cameraController.tiltAngle = 0;
        this._cameraController.panAngle = 0;
        this._cameraController.minTiltAngle = 5;
        this._cameraController.maxTiltAngle = 60;
        this._cameraController.autoUpdate = false;
    }

    /**
     * Initialise the scene objects
     */
    private initObjects(): void
    {
        AssetLibrary.enableParser(AWDParser);

        //kickoff asset loading
        var loader:Loader = new Loader();
        loader.addEventListener(AssetEvent.ASSET_COMPLETE, (event: AssetEvent) => this.onAssetComplete(event));
        loader.addEventListener(LoaderEvent.RESOURCE_COMPLETE, (event: LoaderEvent) => this.onRessourceComplete(event));

        /*
         var _cube:PrimitiveCubePrefab = new PrimitiveCubePrefab(20.0, 20.0, 20.0);
         var newmesh2:Mesh=< Mesh>_cube.getNewObject();
         // newmesh2.material=new ColorMaterial(0xff0000, 1.0);
         //newmesh2.material.bothSides=true;
         var matTx:MethodMaterial = new MethodMaterial (0xFF0000);
         matTx.bothSides = true;
         newmesh2.material=matTx;
         this._view.scene.addChild(newmesh2);
         console.log("LOADET A Geom name = ")*/;
        loader.load(new URLRequest("assets/AWD3/ScareCrow_old.awd"));
        // console.log("START LOADING");
        //this._view.scene.addChild(loader);
    }

    /**
     * Initialise the listeners
     */
    private initListeners(): void
    {
        window.onresize  = (event) => this.onResize(event);

        document.onmousedown = (event) => this.onMouseDown(event);
        document.onmouseup = (event) => this.onMouseUp(event);
        document.onmousemove = (event) => this.onMouseMove(event);
        document.onmousewheel = (event) => this.onMouseWheel(event);

        this.onResize();

        this._timer = new RequestAnimationFrame(this.onEnterFrame, this);
        this._timer.start();
    }

    /**
     * loader listener for asset complete events
     */
    private onAssetComplete(event: AssetEvent): void
    {
        if(event.asset.assetType == AssetType.TIMELINE) {
            this._rootTimeLine = <MovieClip> event.asset;
        }
    }

    /**
     * loader listener for asset complete events
     */
    private onRessourceComplete(event: LoaderEvent): void {
        if (this._rootTimeLine) {
            //console.log("LOADING A ROOT name = " + this._rootTimeLine.name + " duration=" + this._rootTimeLine.duration);
            this._view.scene.addChild(this._rootTimeLine);
            // autoplay like in Flash
            //this._rootTimeLine.play();
        }
    }

    /**
     * Render loop
     */
    private onEnterFrame(dt: number): void {
        this._time += dt;

        //update camera controler
        this._cameraController.update();

        if (this._rootTimeLine != undefined) {
            //console.log("RENDER = ");
            this._rootTimeLine.update(dt);
        }
        //console.log("RENDER = ");
        //update view
        this._view.render();
    }

    private onMouseDown(event): void
    {
        this._lastPanAngle = this._cameraController.panAngle;
        this._lastTiltAngle = this._cameraController.tiltAngle;
        this._lastMouseX = event.clientX;
        this._lastMouseY = event.clientY;
        this._move = true;
    }

    private onMouseUp(event): void
    {
        this._move = false;
    }

    private onMouseMove(event)
    {
        if (this._move) {
            this._cameraController.panAngle = 0.3*(event.clientX - this._lastMouseX) + this._lastPanAngle;
            this._cameraController.tiltAngle = 0.3*(event.clientY - this._lastMouseY) + this._lastTiltAngle;
        }
    }

    private onMouseWheel(event): void
    {
        this._cameraController.distance -= event.wheelDelta * 5;

        if (this._cameraController.distance < 100) {
            this._cameraController.distance = 100;
        } else if (this._cameraController.distance > 2000) {
            this._cameraController.distance = 2000;
        }
    }

    private onResize(event = null): void
    {
        this._view.y         = 0;
        this._view.x         = 0;
        this._view.width     = window.innerWidth;
        this._view.height    = window.innerHeight;
    }
}